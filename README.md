# Manga Management System

## Mục tiêu của dự án

Dự án này xây dựng một hệ thống quản lý quy trình sản xuất và xuất bản manga từ đầu đến cuối, giúp đội ngũ gồm tác giả, biên tập, người quản lý công việc và người đọc có thể theo dõi tiến độ của từng dự án manga, từng chương, từng tài sản (ảnh, file nội dung) và từng công việc trên bảng Kanban.

## Vấn đề hệ thống giải quyết

Trước đây, quá trình quản lý một bộ manga thường rơi vào tình trạng:

- thông tin dự án, chương, tài sản và công việc bị phân tán qua nhiều file, bảng tính hoặc trao đổi thủ công;
- khó theo dõi trạng thái của từng chương (nháp, chờ duyệt, đã xuất bản, ...);
- khó phối hợp giữa các vai trò khác nhau trong quy trình sáng tác;
- thiếu một API thống nhất để kết nối backend với giao diện quản trị và trải nghiệm người đọc.

Hệ thống này cung cấp một nền tảng tập trung để:

1. quản lý dự án manga và tiến độ thực hiện;
2. quản lý các chương theo trạng thái xử lý;
3. theo dõi công việc bằng Kanban workflow;
4. xác thực người dùng bằng JWT;
5. cung cấp API công khai cho người đọc xem thư mục và nội dung chương.

## Tính năng chính

### Backend (Spring Boot)

- Quản lý người dùng: đăng ký, đăng nhập, lấy thông tin hồ sơ.
- Quản lý dự án manga: tạo, đọc, cập nhật, xóa dự án.
- Quản lý chương: tạo chương, lấy chương theo manga, cập nhật trạng thái, xuất bản.
- Quản lý công việc: tạo công việc, giao việc, thay đổi trạng thái, xóa/sửa công việc.
- Quản lý tài sản: hỗ trợ lưu trữ và theo dõi tài nguyên liên quan đến dự án/chương.
- Bảo mật: JWT authentication và phân quyền cơ bản qua Spring Security.
- API công khai: phục vụ danh mục manga và nội dung chương cho người đọc.

### Frontend (React + Vite)

- Giao diện đăng nhập/đăng ký.
- Bảng điều khiển quản trị hiển thị dự án, công việc và tiến độ.
- Giao diện Kanban để kéo thả công việc theo trạng thái.
- Kết nối với API backend để lấy dữ liệu thực tế.

## Kiến trúc tổng thể

Dự án gồm hai phần chính:

- Backend: Spring Boot, Java 21, Spring Data JPA, Spring Security, JWT, MySQL.
- Frontend: React, TypeScript, Vite.

Luồng hoạt động cơ bản như sau:

1. Người dùng đăng nhập qua API `/users/login`.
2. Backend tạo JWT và trả về token cho frontend.
3. Frontend gọi các API để quản lý dự án, nhiệm vụ và chương.
4. Backend xử lý nghiệp vụ, truy vấn database và trả về response chuẩn.
5. Người dùng đọc truyện qua API công khai `/api/public/...`.

## Cấu trúc thư mục chính

```text
manga-management-system/
├── src/
│   ├── main/
│   │   ├── java/edu/uth/manga/
│   │   │   ├── controller/          # REST API endpoints
│   │   │   ├── service/             # Business logic
│   │   │   ├── service/impl/        # Implementation of services
│   │   │   ├── repository/          # JPA repositories
│   │   │   ├── entity/              # Database entities
│   │   │   ├── dto/                 # Request/response DTOs
│   │   │   ├── enums/               # Status enums
│   │   │   ├── security/            # JWT + Security config
│   │   │   └── exception/           # Exception handling
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/              # Static assets for UI support
│   └── test/                        # Unit tests
├── frontend/
│   ├── src/
│   │   ├── components/              # UI components
│   │   ├── App.tsx                 # Main app UI
│   │   └── main.tsx                # App entry point
├── database/                        # SQL schema/data scripts
├── pom.xml                          # Backend dependencies
├── frontend/package.json            # Frontend dependencies
└── README.md                        # Documentation for the project
```

## Công nghệ sử dụng

### Backend

- Java 21
- Spring Boot 3.5.14
- Spring Web / Spring Data JPA / Spring Security
- JWT (jjwt)
- MySQL
- Maven

### Frontend

- React 19
- TypeScript
- Vite
- CSS / UI components

## Luồng nghiệp vụ chính

1. Tạo dự án manga.
2. Gắn các công việc vào quy trình sản xuất bằng bảng Kanban.
3. Quản lý trạng thái chương và tài sản.
4. Duyệt và xuất bản chương khi đủ điều kiện.
5. Cung cấp nội dung cho người đọc qua API công khai.

## Kết luận ngắn gọn

Đây là một hệ thống full-stack giúp tự động hóa và tập trung hóa quy trình làm manga, giảm thao tác thủ công, tăng khả năng theo dõi tiến độ và hỗ trợ tốt hơn cho việc phối hợp giữa các vai trò trong nhóm sản xuất nội dung.
