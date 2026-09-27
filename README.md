# DIU Transports - Daffodil Smart City

Official transport management, live bus tracking, schedule, and digital pass app for Daffodil International University (DSC).

## Run Locally

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev` or double-click `start.bat`
3. Open: http://localhost:3000

## Spring Boot Backend

The Java backend in `backend/` uses Java 21, Spring Boot 4.1.1, Spring Data JPA, H2, REST, and Thymeleaf. The source is already split into conventional `model`, `repository`, `service`, `controller`, `dto`, `config`, and `exception` packages.

1. Install a JDK 21 distribution and make sure `java -version` reports version 21.
2. From `backend/`, run `.\mvnw.cmd spring-boot:run` in PowerShell, or double-click `backend/start.bat`.
3. REST API: http://localhost:8080/api/v1/transport/routes
4. Thymeleaf schedule: http://localhost:8080/th/schedule
5. Thymeleaf tickets: http://localhost:8080/th/tickets?studentId=251-15-863

For the React frontend, in a second terminal at the repository root run `npm install` once, then `npm run dev`; open http://localhost:3000. The backend and frontend run separately. The API also has the H2 console at http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:file:./data/diu-transport`).
