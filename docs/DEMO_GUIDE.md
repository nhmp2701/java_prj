# DEMO GUIDE

## 1. System Requirements

* Java 21
* Maven 3.9+
* MySQL 8+
* Postman

---

## 2. Create Database

```sql
CREATE DATABASE manga_management;
```

---

## 3. Configure Database

Update `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/manga_management
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 4. Import Demo Data

```bash
mysql -u root -p manga_management < database/demo.sql
```

---

## 5. Build Project

```bash
mvn clean install
```

---

## 6. Run Application

```bash
mvn spring-boot:run
```

Expected:

```text
Started MangaManagementApplication
```

Server:

```text
http://localhost:8080
```

---

## 7. Login

```http
POST /users/login
```

Request:

```json
{
  "email":"admin@test.com",
  "password":"123456"
}
```

Copy JWT token.

---

## 8. Use JWT Token

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 9. Test Workflow

1. Login
2. Create Project
3. Create Chapter
4. Create Task
5. Assign Task
6. Upload Asset
7. Approve Asset
8. Read Manga via Public API

---

## 10. Import Postman Collection

Open Postman

Import:

```text
postman/MangaManagement.postman_collection.json
```

Ready for testing.
