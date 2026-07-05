# Manga Management System

Hệ thống quản lý quy trình sản xuất và xuất bản manga, gồm backend Spring Boot và frontend React/Vite. Project hỗ trợ quản lý dự án truyện, chương truyện, tài sản bản vẽ/nội dung, công việc Kanban, xét duyệt nội dung và API đọc truyện công khai.

## Mục tiêu

Project này tập trung gom các hoạt động sản xuất manga vào một hệ thống thống nhất:

- Quản lý dự án manga theo trạng thái và tiến độ.
- Quản lý chương truyện từ bản nháp đến khi xuất bản.
- Theo dõi tài sản như ảnh, bản vẽ, file nội dung và phản hồi duyệt.
- Giao việc, cập nhật trạng thái công việc trên workflow Kanban.
- Xác thực người dùng bằng JWT và phân quyền theo vai trò.
- Cung cấp API công khai để độc giả xem danh mục truyện và đọc chương đã xuất bản.

## Tính năng chính

### Backend

- Đăng ký, đăng nhập, lấy hồ sơ người dùng và quản lý danh sách user.
- Quản lý dự án manga: tạo, xem, cập nhật, xóa.
- Quản lý chương: tạo chương, lấy chương theo manga, đổi trạng thái, xuất bản.
- Quản lý task workflow: tạo task, giao việc, cập nhật trạng thái, sửa và xóa task.
- Quản lý asset: upload file, duyệt, từ chối, bình luận và xóa asset.
- API public cho độc giả: danh mục manga, nội dung chương, file asset đã upload.
- Spring Security + JWT, phân quyền theo role: `ADMIN`, `TEAM_LEAD`, `CREATOR`, `EDITOR`, `READER`.
- Scheduled task hỗ trợ xử lý lịch xuất bản.

### Frontend

- Giao diện đăng nhập/đăng ký.
- Dashboard tổng quan dự án, task và số liệu.
- Library/Reader cho trải nghiệm xem danh mục và đọc truyện.
- Composition/Chapters để quản lý dự án và chương.
- Assets/Review để upload, duyệt và phản hồi tài sản.
- Sidebar điều hướng giữa các màn hình nghiệp vụ.

## Công nghệ sử dụng

### Backend

- Java 21
- Spring Boot 3.5.14
- Spring Web
- Spring Data JPA
- Spring Security
- JWT với `jjwt`
- MySQL
- Maven
- Lombok

### Frontend

- React 19
- TypeScript
- Vite
- Axios
- Tailwind CSS
- Lucide React
- Motion

## Cấu trúc thư mục

```text
.
├── src/
│   ├── main/
│   │   ├── java/edu/uth/manga/
│   │   │   ├── controller/        # REST API
│   │   │   ├── dto/               # Request/response DTO
│   │   │   ├── entity/            # JPA entities
│   │   │   ├── enums/             # Trạng thái và role
│   │   │   ├── exception/         # Xử lý lỗi tập trung
│   │   │   ├── repository/        # Spring Data repositories
│   │   │   ├── security/          # JWT, filter, security config
│   │   │   ├── service/           # Interface nghiệp vụ
│   │   │   ├── service/impl/      # Cài đặt nghiệp vụ
│   │   │   └── task/              # Scheduled tasks
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── index.html
│   │       ├── kanban.css
│   │       └── kanban.js
│   └── test/                      # Test backend
├── frontend/
│   ├── src/
│   │   ├── components/            # Các màn hình React
│   │   ├── services/api.ts        # Axios client gọi backend
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── package.json
│   └── vite.config.ts
├── postman/
│   └── MangaManagement.postman_collection.json
├── uploads/                       # File upload khi chạy local
├── ERD.png
├── pom.xml
└── README.md
```

## Yêu cầu môi trường

- JDK 21
- Maven hoặc Maven Wrapper có sẵn trong repo
- Node.js và npm
- MySQL đang chạy local

## Cấu hình backend

File cấu hình nằm tại:

```text
src/main/resources/application.properties
```

Cấu hình mặc định:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/manga_management_system
spring.datasource.username=root
spring.datasource.password=
server.port=8080
jwt.secret=MyVeryStrongSecretKeyForJwtAuthentication2026!
```

Trước khi chạy backend, tạo database MySQL:

```sql
CREATE DATABASE manga_management_system;
```

Hibernate đang để `spring.jpa.hibernate.ddl-auto=update`, nên bảng sẽ được tự cập nhật theo entity khi ứng dụng khởi động.

## Chạy project

### 1. Chạy backend

Trên Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Trên macOS/Linux:

```bash
./mvnw spring-boot:run
```

Backend chạy tại:

```text
http://localhost:8080
```

### 2. Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại:

```text
http://localhost:3000
```

Frontend hiện gọi backend qua base URL:

```text
http://localhost:8080
```

## Chạy test

```bash
./mvnw test
```

Trên Windows:

```powershell
.\mvnw.cmd test
```

Kiểm tra TypeScript frontend:

```bash
cd frontend
npm run lint
```

## API chính

### Người dùng

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/users` | Đăng ký user mới |
| `POST` | `/users/login` | Đăng nhập và nhận JWT |
| `GET` | `/users/profile` | Lấy hồ sơ user hiện tại |
| `GET` | `/users/all` | Lấy danh sách user, chỉ dành cho admin |
| `GET` | `/users/count-readers` | Đếm số lượng độc giả |

### Dự án manga

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/projects` | Lấy danh sách dự án |
| `GET` | `/projects/{id}` | Lấy chi tiết dự án |
| `POST` | `/projects` | Tạo dự án |
| `PUT` | `/projects/{id}` | Cập nhật dự án |
| `DELETE` | `/projects/{id}` | Xóa dự án |

### Chương truyện

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/api/chapters` | Tạo chương |
| `GET` | `/api/chapters/manga/{mangaId}` | Lấy chương theo manga |
| `PATCH` | `/api/chapters/{id}/status?status=...` | Đổi trạng thái chương |
| `PATCH` | `/api/chapters/{id}/publish` | Xuất bản chương |
| `DELETE` | `/api/chapters/{id}` | Xóa chương |

### Asset và review

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/api/assets` | Lấy danh sách asset |
| `POST` | `/api/assets/upload` | Upload asset |
| `POST` | `/api/assets/{id}/approve` | Duyệt asset |
| `POST` | `/api/assets/{id}/reject` | Từ chối asset |
| `GET` | `/api/assets/{id}/reviews` | Lấy review của asset |
| `POST` | `/api/assets/{id}/comments` | Thêm bình luận |
| `DELETE` | `/api/assets/{id}` | Xóa asset |

### Task workflow

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/api/tasks` | Lấy toàn bộ task |
| `GET` | `/api/tasks/{id}` | Lấy chi tiết task |
| `POST` | `/api/tasks` | Tạo task |
| `PUT` | `/api/tasks/{id}` | Cập nhật task |
| `PUT` | `/api/tasks/{id}/assign?user=...` | Giao task |
| `PUT` | `/api/tasks/{id}/status?status=...` | Đổi trạng thái task |
| `DELETE` | `/api/tasks/{id}` | Xóa task |

### API public cho độc giả

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/api/public/mangas` | Lấy danh mục manga public |
| `GET` | `/api/public/chapters/{id}` | Đọc nội dung chương |
| `GET` | `/api/public/assets/files/{filename}` | Xem file asset trong thư mục upload |

## Trạng thái nghiệp vụ

### ProjectStatus

- `PLANNING`
- `IN_PROGRESS`
- `ON_HOLD`
- `COMPLETED`
- `PUBLISHED`
- `CANCELLED`

### ChapterStatus

- `DRAFT`
- `PENDING`
- `SCHEDULED`
- `PUBLISHED`
- `REJECTED`

### TaskStatus

- `TODO`
- `IN_PROGRESS`
- `REVIEW`
- `DONE`

## Postman

Repo có sẵn collection Postman tại:

```text
postman/MangaManagement.postman_collection.json
```

Bạn có thể import collection này vào Postman để test nhanh các API backend.

## Ghi chú bảo mật

- JWT secret đang đặt trực tiếp trong `application.properties`, phù hợp cho môi trường học tập/local.
- Khi triển khai thật, nên chuyển `jwt.secret`, tài khoản database và các cấu hình nhạy cảm sang biến môi trường.
- CORS hiện cho phép các origin local như `localhost:3000`, `localhost:5173`, `localhost:5174`, `localhost:8080`.

## Tóm tắt

Manga Management System là một project full-stack phục vụ quản lý quy trình làm manga từ lúc lên kế hoạch, tạo chương, upload asset, duyệt nội dung, giao việc cho đội ngũ sản xuất cho đến khi xuất bản nội dung cho độc giả.
