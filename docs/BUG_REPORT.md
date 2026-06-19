# BUG REPORT

## BUG-001

Title:
Validation exception may return HTTP 200 instead of HTTP 400.

Severity:
High

Impact:
Frontend cannot distinguish validation errors correctly.

Recommendation:
Return ResponseEntity with HttpStatus.BAD_REQUEST.

---

## BUG-002

Title:
RuntimeException handling returns success HTTP status.

Severity:
High

Impact:
API consumers receive incorrect response status.

Recommendation:
Use proper HTTP error responses.

---

## BUG-003

Title:
JWT secret key hardcoded in source code.

Severity:
High

Impact:
Credential exposure risk.

Recommendation:
Move secret into environment variable or application.properties.

---

## BUG-004

Title:
Wildcard CORS configuration.

Severity:
Medium

Impact:
Allows requests from any domain.

Recommendation:
Restrict origins.

---

## BUG-005

Title:
File upload validation incomplete.

Severity:
High

Impact:
Potential upload of executable files.

Recommendation:
Validate file extension, MIME type and size.

---

## BUG-006

Title:
Potential duplicate username issue.

Severity:
Medium

Impact:
Data consistency problems.

Recommendation:
Add unique constraint on username.
