# DIU Transports - Daffodil Smart City

Official transport management, live bus tracking, schedule, and digital pass app for Daffodil International University (DSC).

## Run Locally

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev` or double-click `start.bat`
3. Open: http://localhost:3000

## Spring Boot Backend

The full Java backend is in `backend/` and uses Spring Boot, Spring Data JPA, H2, REST, and Thymeleaf.

1. Build the backend from `backend/` with `mvn clean package`.
2. Run it with `java -jar target/diu-transport-backend-1.0.0.jar`.
3. REST API: http://localhost:8080/api/v1/transport/routes
4. Thymeleaf schedule: http://localhost:8080/th/schedule
5. Thymeleaf tickets: http://localhost:8080/th/tickets?studentId=251-15-863

The React frontend remains at http://localhost:3000 and is configured for API calls from that origin.
