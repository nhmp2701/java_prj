# API TEST REPORT

## Project Information

**Project:** Manga Management System

**Test Type:** API Design Review + Postman Collection Verification

**Environment:** Local Development

**Base URL:** http://localhost:8080

---

# Testing Scope

The following APIs were reviewed and prepared for automated testing using Postman.

Coverage includes:

* Positive Test Cases
* Negative Test Cases
* Authentication Tests
* Authorization Tests
* Workflow Tests
* Response Validation
* Dynamic Variable Handling

---

# Postman Collection Structure

```text
MangaManagement
│
├── Auth
│   ├── Register
│   ├── Login
│   ├── Profile
│   └── Get All Users
│
├── Projects
│   ├── Create Project
│   ├── Get Projects
│   ├── Get Project By Id
│   ├── Update Project
│   └── Delete Project
│
├── Chapters
│   ├── Create Chapter
│   ├── Get Chapters
│   ├── Publish Chapter
│   └── Delete Chapter
│
├── Tasks
│   ├── Create Task
│   ├── Get Tasks
│   ├── Assign Task
│   └── Update Task Status
│
├── Assets
│   ├── Upload Asset
│   ├── Approve Asset
│   └── Reject Asset
│
├── Public
│   ├── Get Mangas
│   └── Get Chapter
│
└── Negative Tests
    ├── Invalid Login
    ├── Missing JWT
    ├── Invalid Project ID
    └── Invalid Chapter ID
```

---

# Environment Variables

The collection uses environment variables to avoid hardcoded values.

| Variable  | Purpose            |
|-----------|--------------------|
| baseUrl   | API Base URL       |
| token     | JWT Token          |
| projectId | Project Identifier |
| chapterId | Chapter Identifier |
| taskId    | Task Identifier    |
| assetId   | Asset Identifier   |
| userId    | User Identifier    |

---

# Authentication Tests

## Register User

| Item            | Value  |
|-----------------|--------|
| Method          | POST   |
| Endpoint        | /users |
| Expected Status | 200    |

Request Body:

```json
{
  "username": "testuser",
  "email": "testuser@test.com",
  "password": "123456"
}
```

---

## Login

| Item            | Value        |
|-----------------|--------------|
| Method          | POST         |
| Endpoint        | /users/login |
| Expected Status | 200          |

Assertions:

* Response status equals 200
* JWT token exists
* JWT token saved to environment

Postman Test Script:

```javascript
pm.test("Status 200", function () {
    pm.response.to.have.status(200);
});

var jsonData = pm.response.json();

if(jsonData.token){
    pm.environment.set("token", jsonData.token);
}
```

---

# Project Tests

## Create Project

Expected:

* Status 201
* Project ID generated

Stored Variable:

```text
projectId
```

---

## Get Project By ID

Endpoint:

```text
/projects/{{projectId}}
```

Expected:

* Status 200
* Valid project data

---

## Delete Project

Expected:

* Status 200 or 204

---

# Chapter Tests

## Create Chapter

Expected:

* Status 201
* Chapter ID generated

Stored Variable:

```text
chapterId
```

---

## Publish Chapter

Expected:

* Status 200

---

# Task Tests

## Create Task

Expected:

* Status 201

Stored Variable:

```text
taskId
```

---

## Assign Task

Expected:

* Status 200

---

## Update Status

Expected:

* Status 200

---

# Asset Tests

## Upload Asset

Expected:

* Status 201

Stored Variable:

```text
assetId
```

---

## Approve Asset

Expected:

* Status 200

---

## Reject Asset

Expected:

* Status 200

---

# Public API Tests

## Get Manga List

Expected:

* Status 200
* Non-empty list

---

## Get Published Chapter

Expected:

* Status 200

---

# Negative Test Cases

| Test Case            | Expected |
|----------------------|----------|
| Invalid Login        | 401      |
| Missing JWT          | 401      |
| Invalid JWT          | 401      |
| Invalid Project ID   | 404      |
| Invalid Chapter ID   | 404      |
| Duplicate Email      | 409      |
| Invalid Request Body | 400      |

---

# Authorization Tests

| Scenario                          | Expected |
|-----------------------------------|----------|
| User accesses own profile         | PASS     |
| Missing token                     | 401      |
| Invalid token                     | 401      |
| User accesses restricted endpoint | 403      |
| Admin endpoint protection         | PASS     |

---

# Automated Assertions

Implemented in Postman:

* Status Code Validation
* JWT Extraction
* Dynamic ID Storage
* Response Validation
* Authorization Validation

---

# End-to-End Workflow

```text
Register
↓
Login
↓
Create Project
↓
Create Chapter
↓
Create Task
↓
Assign Task
↓
Upload Asset
↓
Approve Asset
↓
Read Public Manga
```

---

# Test Coverage Summary

| Category             | Count |
|----------------------|-------|
| Authentication Tests | 4     |
| Project Tests        | 5     |
| Chapter Tests        | 4     |
| Task Tests           | 4     |
| Asset Tests          | 3     |
| Public API Tests     | 2     |
| Negative Tests       | 7     |

Total Coverage: 29 Test Scenarios

---

# Conclusion

The API design supports complete manga production workflow management. Postman automation is configured using environment variables, JWT token handling, automated assertions, and end-to-end workflow testing. Remaining improvements should focus on exception handling consistency and upload validation security.
