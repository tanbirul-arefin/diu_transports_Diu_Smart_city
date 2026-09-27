# DIU Transport Spring Boot Backend

## Requirements

- JDK 21
- Maven is provided by the Maven Wrapper; a separate Maven install is not required.

## Run

From this directory, run the app with the Maven Wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

Alternatively, run `start.bat` from this directory. The backend runs at `http://localhost:8080`.

- REST routes: `GET /api/v1/transport/routes`
- Live buses: `GET /api/v1/transport/tracking/live`
- Thymeleaf schedule: `http://localhost:8080/th/schedule`
- Thymeleaf tickets: `http://localhost:8080/th/tickets?studentId=251-15-863`
- H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/diu-transport`)

The React development app runs separately at `http://localhost:3000`. Start it from the repository root with `npm install` (first run only), then `npm run dev`. The API allows requests from this origin.

## Project Structure

```text
backend/
	src/main/java/bd/edu/daffodilvarsity/transport/
		config/       # CORS and database seed configuration
		controller/   # REST and Thymeleaf controllers
		dto/          # Validated API request objects
		exception/    # JSON API error handling
		model/        # JPA entities and response models; entity fields stay in their model classes
		repository/   # Spring Data JPA repositories
		service/      # Booking, route, ticket, and tracking logic
	src/main/resources/
		templates/    # Thymeleaf HTML pages
		application.properties
	pom.xml
```