# Hệ Thống Quản Lý Quy Trình Sáng Tác và Xuất Bản Manga

## 📖 Giới Thiệu

Đây là một hệ thống quản lý toàn diện cho quy trình sáng tác, chỉnh sửa và xuất bản các bộ manga. Hệ thống được thiết kế để quản lý tác giả, biên tập viên, và các giai đoạn xuất bản, cung cấp một giải pháp tổng thể cho ngành công nghiệp manga.

**Dự án thực hiện bởi: Nhóm 6 thành viên**

---

## ✨ Tính Năng Chính

- 👤 **Quản Lý Người Dùng**: Hệ thống quản lý tài khoản người dùng với nhiều vai trò khác nhau
- 🔐 **Bảo Mật**: Xác thực và phân quyền dựa trên JWT (JSON Web Token)
- 🎨 **Quản Lý Công Việc**: Theo dõi quy trình sáng tác từ ý tưởng đến xuất bản
- 📊 **Quản Lý Dữ Liệu**: Lưu trữ và quản lý thông tin manga, tác giả và chương
- 🔄 **API RESTful**: Cung cấp API để tích hợp với các ứng dụng khác

---

## 🛠 Công Nghệ Sử Dụng

### Backend

- **Java 11+** - Ngôn ngữ lập trình
- **Spring Boot** - Framework chính
- **Spring Security** - Bảo mật ứng dụng
- **JWT (JSON Web Token)** - Xác thực người dùng
- **Spring Data JPA** - Truy cập dữ liệu
- **Maven** - Build tool

### Database

- **MySQL**

### Khác

- **Lombok** - Giảm code boilerplate
- **MapStruct** - Mapping DTO

---

## 📁 Cấu Trúc Dự Án

```
manga-management-system/
├── src/
│   ├── main/
│   │   ├── java/edu/uth/manga/
│   │   │   ├── MangaManagementSystemApplication.java    # Entry point
│   │   │   ├── config/                                   # Cấu hình ứng dụng
│   │   │   ├── controller/                               # REST Controllers
│   │   │   ├── service/                                  # Business logic
│   │   │   ├── entity/                                   # Database entities
│   │   │   ├── repository/                               # Data access layer
│   │   │   ├── dto/                                      # Data Transfer Objects
│   │   │   ├── security/                                 # JWT & Security config
│   │   │   ├── enums/                                    # Enumerations
│   │   │   ├── exception/                                # Custom exceptions
│   │   │   ├── mapper/                                   # Object mappers
│   │   │   └── util/                                     # Utility classes
│   │   └── resources/
│   │       ├── application.properties                    # Application config
│   │       ├── static/                                   # Static files
│   │       └── templates/                                # Thymeleaf templates
│   └── test/                                             # Unit tests
├── pom.xml                                               # Maven dependencies
├── mvnw & mvnw.cmd                                       # Maven wrapper
└── README.md                                             # This file
```

---
