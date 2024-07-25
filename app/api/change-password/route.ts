import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req: NextRequest) {
  const { email, oldPassword, newPassword } = await req.json();

  console.log("email", email, oldPassword, newPassword);
  if (!email || !oldPassword || !newPassword) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (oldPassword !== user.password) {
      return NextResponse.json(
        { message: "Incorrect old password" },
        { status: 401 }
      );
    }
    await prisma.users.update({
      where: { email },
      data: {
        password: newPassword,
        update_at: new Date(),
        isPasswordChanged: true,
      },
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
