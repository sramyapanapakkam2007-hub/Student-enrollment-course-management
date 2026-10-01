# Phase 2 - System Design

## Architecture
React UI -> Express REST API -> MySQL

## API
### Auth
POST /api/auth/login

### Students
GET /api/students
GET /api/students/:id
POST /api/students
PUT /api/students/:id
DELETE /api/students/:id

### Courses
GET /api/courses
POST /api/courses
PUT /api/courses/:id
DELETE /api/courses/:id

### Enrollments
GET /api/enrollments
POST /api/enrollments
DELETE /api/enrollments/:id

## Relationships
- One student can have many enrollments.
- One course can have many enrollments.
- Student and Course have a many-to-many relationship through Enrollment.
