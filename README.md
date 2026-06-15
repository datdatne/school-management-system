# Student & School Management System (CMS)

A robust Full-stack Content Management System (CMS) designed to streamline student and faculty management operations. This project features a secure, multi-role authentication system and an automated API integration workflow.

---

## 🛠️ Tech Stack

- **Backend:** Java Spring Boot, Spring Security, Spring Data JPA, Hibernate
- **Frontend:** React, TypeScript, Vite, React Context API, Tailwind CSS / Bootstrap
- **Database:** MySQL
- **Tools & APIs:** JWT (JSON Web Tokens), Swagger/OpenAPI, openapi-typescript-codegen, Postman

---

## ✨ Key Features

- **Secure Authentication & Authorization:** Implemented using Spring Security and JWT.
- **Role-Based Access Control (RBAC):** Strictly enforces route-level and component-level permissions for three distinct roles: `ROLE_ADMIN`, `ROLE_TEACHER`, and `ROLE_STUDENT`.
- **Dynamic UI State Management:** UI elements (such as Add, Edit, Delete buttons) automatically adapt or hide based on the authenticated user's permissions.
- **Automated API Integration:** Integrated Swagger/OpenAPI with `openapi-typescript-codegen` to completely automate frontend API client generation, ensuring 100% type safety and synchronization between FE and BE.
- **Advanced Data Operations:** Efficient server-side pagination, sorting, and dynamic search filters for large user data tables.

---

## 🚀 Getting Started

### Prerequisites
- Java Development Kit (JDK 17 or higher)
- Node.js & npm
- MySQL Server

### Backend Setup
1. Clone the repository and navigate to the backend folder.
2. Update the database configurations in `src/main/resources/application.properties`.
3. Run the Spring Boot application:
```bash
   ./mvnw spring-boot:run
