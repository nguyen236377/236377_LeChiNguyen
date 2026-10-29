# 236377_LeChiNguyen
Dự án Quản lý món ăn - MERN Stack

## Câu 3: Backend RESTful API
- Xây dựng bằng Node.js, Express.js và Mongoose.
- Kết nối cơ sở dữ liệu MongoDB Atlas (Database: 236377_LeChiNguyen, Collection: foods).
- Danh sách API Endpoints:
  - GET /health : Kiểm tra trạng thái hệ thống
  - GET /api/foods : Lấy danh sách / Tìm kiếm món ăn (?search=)
  - GET /api/foods/:id : Xem thông tin một món ăn
  - POST /api/foods : Thêm món ăn mới (kiểm tra trùng foodId)
  - PUT /api/foods/:id : Cập nhật thông tin món ăn
  - DELETE /api/foods/:id : Xóa món ăn

## Câu 2: Cấu hình MongoDB Atlas
- Database: 236377_LeChiNguyen
- Collection: foods
- Dữ liệu mẫu: Khởi tạo 3 tài liệu món ăn

## Hướng dẫn chạy Backend bằng Docker

1. Tải Image từ Docker Hub:
docker pull nguyen236377/backend:latest

2. Khởi chạy Container Backend với biến môi trường:
docker run -d -p 5000:5000 -e PORT=5000 -e MONGO_URI="mongodb+srv://nguyen236377:123@nguyen236377.samht5y.mongodb.net/236377_LeChiNguyen?retryWrites=true&w=majority" --name api-236377 nguyen236377/backend:latest

3. Kiểm tra trạng thái:
curl http://localhost:5000/health

* Docker Hub Repository: https://hub.docker.com/r/nguyen236377/backend

## Hướng dẫn chạy Frontend bằng Docker
