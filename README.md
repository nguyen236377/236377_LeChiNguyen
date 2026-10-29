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
