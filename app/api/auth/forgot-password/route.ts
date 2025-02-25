// app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import prisma from "@/utils/prisma";
import axios from "axios";

// async function sendPasswordResetEmail(
//   email: string,
//   temporaryPassword: string
// ) {
//   console.log(email, "email");
//   console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Đặt lại mật khẩu",
//     text: `Mật khẩu tạm thời của bạn là: ${temporaryPassword}`,
//     html: `<p>Mật khẩu tạm thời của bạn là: <strong>${temporaryPassword}</strong></p>`,
//   };

//   await transporter.sendMail(mailOptions);
// }

async function sendPasswordResetEmail(
    email: string,
    temporaryPassword: string,
    username: string
  ) {
    const transporter = nodemailer.createTransport({
      host: 'mail.famima.vn', // Thay đổi thành máy chủ SMTP của công ty bạn
      port: 465, // Cổng thường dùng cho TLS, thay đổi nếu cần
      secure: true, // false nếu sử dụng TLS, true nếu sử dụng SSL
      auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email công ty của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu của email công ty
      },
      tls: {
        rejectUnauthorized: false, // Chỉ thêm tùy chọn này nếu máy chủ SMTP của bạn yêu cầu
      }
    });
  
    const mailOptions = {
        from: process.env.EMAIL_USER, // Địa chỉ email người gửi
        to: email,
        subject: 'Mật khẩu đăng nhập Elearning của bạn đã thay đổi',
        text: `Mật khẩu mới của của bạn là: ${temporaryPassword}`,
        html: `
          <p>Xin chào ${username},</p>
          <p>Mật khẩu đăng nhập vào tài khoản Elearning của bạn đã thay đổi thành công.</p>
          <p>Vui lòng đăng nhập bằng mật khẩu mới: <strong>${temporaryPassword}</strong></p>
          <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ Bộ phận Nhân sự qua mail <a href="mailto:nhansu@famima.vn">nhansu@famima.vn</a> để được hỗ trợ.</p>
          <p>Trân trọng,</p>
          <p>FamilyMart</p>
        `,
      };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email là bắt buộc" }, { status: 400 });
  }

  function generateRandomPassword(length: number) {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  const temporaryPassword = generateRandomPassword(8);
  console.log(temporaryPassword, "temporaryPassword");

  try {
    // const response = await axios.post(
    //   "https://account.base.vn/extapi/v1/user/search.by.email",
    //   new URLSearchParams({
    //     access_token: process.env.BASE_API_TOKEN!,
    //     email: email,
    //   }),
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   }
    // );
    // const userBaseAccount = response.data;

    // if (userBaseAccount.code == 0) {
    //     return NextResponse.json({ message: "Email không hợp lệ" }, { status: 404 });
    // }

    //  console.log(userBaseAccount, "userBaseAccount");
     const userBaseAccount =await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    await prisma.users.update({
      where: { email },
      data: { password: temporaryPassword },
    });

    await sendPasswordResetEmail(email, temporaryPassword,userBaseAccount?.full_name || "");
    return NextResponse.json(
      { message: "Đã gửi email đặt lại mật khẩu" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi gửi email" },
      { status: 500 }
    );
  }
}
