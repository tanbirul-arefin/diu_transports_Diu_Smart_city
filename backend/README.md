# DIU Transport Spring Boot Backend

## Requirements

- JDK 17 or newer
- Maven 3.9+ (or the Maven Wrapper, when added to the machine)

## Run

From this directory:

```powershell
mvn spring-boot:run
```

The API runs at `http://localhost:8080`.

- REST routes: `GET /api/v1/transport/routes`
- Live buses: `GET /api/v1/transport/tracking/live`
- Thymeleaf schedule: `http://localhost:8080/th/schedule`
- Thymeleaf tickets: `http://localhost:8080/th/tickets?studentId=251-15-863`
- H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/diu-transport`)

The React development app remains at `http://localhost:3000` and is allowed by the API CORS configuration.

## Project Structure

```text
backend/
	src/main/java/bd/edu/daffodilvarsity/transport/
		config/       # CORS and database seed configuration
		controller/   # REST and Thymeleaf controllers
		dto/          # Validated API request objects
		exception/    # JSON API error handling
		model/        # JPA entities and response models
		repository/   # Spring Data JPA repositories
		service/      # Booking, route, ticket, and tracking logic
	src/main/resources/
		templates/    # Thymeleaf HTML pages
		application.properties
	pom.xml
```