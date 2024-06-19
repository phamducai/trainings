# Sử dụng hình ảnh Node.js 22 làm base
FROM node:22-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Tạo thư mục prisma và sao chép schema.prisma
COPY prisma ./prisma
# RUN npx prisma migrate dev --name init
# Chạy Prisma generate
RUN npx prisma generate

# Xây dựng ứng dụng Next.js
RUN npm run build

# Thiết lập biến môi trường
ENV NODE_ENV=production

# Chạy lệnh để khởi động ứng dụng Next.js
CMD ["npm", "start"]
