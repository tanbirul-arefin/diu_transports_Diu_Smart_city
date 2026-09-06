export interface CodeFile {
  name: string;
  language: string;
  description: string;
  code: string;
}

export const SPRING_BOOT_PROJECT_FILES: CodeFile[] = [
  {
    name: 'DiuTransportApplication.java',
    language: 'java',
    description: 'Spring Boot Main Application Entry Point with CORS and scheduling enabled',
    code: `package bd.edu.daffodilvarsity.transport;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DiuTransportApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiuTransportApplication.class, args);
        System.out.println("DIU Transport Spring Boot Backend initialized on port 8080");
    }
}`,
  },
  {
    name: 'TransportRestController.java',
    language: 'java',
    description: 'Spring Boot REST Controller providing full API for Routes, Schedules, Tracking, and Tickets',
    code: `package bd.edu.daffodilvarsity.transport.controller;

import bd.edu.daffodilvarsity.transport.model.BusRoute;
import bd.edu.daffodilvarsity.transport.model.BusTracking;
import bd.edu.daffodilvarsity.transport.model.Ticket;
import bd.edu.daffodilvarsity.transport.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transport")
@CrossOrigin(origins = "*")
public class TransportRestController {

    @Autowired
    private TransportService transportService;

    // 1. Get all routes with category filter (Fall 2026 Schedule)
    @GetMapping("/routes")
    public ResponseEntity<List<BusRoute>> getAllRoutes(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(transportService.getRoutesByCategory(category));
    }

    // 2. Get specific route details by route number (e.g. R1, R2, R11, F1)
    @GetMapping("/routes/{routeNo}")
    public ResponseEntity<BusRoute> getRouteByNo(@PathVariable String routeNo) {
        return ResponseEntity.ok(transportService.getRouteByNo(routeNo));
    }

    // 3. Live bus GPS tracking feed for DSC Campus transit
    @GetMapping("/tracking/live")
    public ResponseEntity<List<BusTracking>> getLiveBuses() {
        return ResponseEntity.ok(transportService.getLiveTrackingBuses());
    }

    // 4. Book a seat / generate digital QR pass
    @PostMapping("/tickets/book")
    public ResponseEntity<Ticket> bookSeatPass(@RequestBody Ticket bookingRequest) {
        Ticket confirmedTicket = transportService.bookSeat(bookingRequest);
        return ResponseEntity.ok(confirmedTicket);
    }

    // 5. Get student ticket history
    @GetMapping("/tickets/student/{studentId}")
    public ResponseEntity<List<Ticket>> getStudentTickets(@PathVariable String studentId) {
        return ResponseEntity.ok(transportService.getTicketsByStudent(studentId));
    }

    // 6. Verify Digital Pass via QR Code at Campus Gate
    @PostMapping("/tickets/verify-qr")
    public ResponseEntity<String> verifyQrCode(@RequestParam String qrPayload) {
        boolean valid = transportService.verifyDigitalPass(qrPayload);
        return ResponseEntity.ok(valid ? "PASS_VERIFIED_SUCCESS" : "PASS_INVALID");
    }
}`,
  },
  {
    name: 'BusRouteEntity.java',
    language: 'java',
    description: 'JPA Entity mapped to PostgreSQL / MySQL for Route and Stop data',
    code: `package bd.edu.daffodilvarsity.transport.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "diu_bus_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String routeNo; // e.g. R1, R2, R11, F1

    @Column(nullable = false)
    private String name; // e.g. Dhanmondi <> DSC

    private String category; // City Routes, DIU Shuttle, Friday Schedule

    private String startPoint;
    private String destination;

    @ElementCollection
    private List<String> startTimesToDSC;

    @ElementCollection
    private List<String> departureTimesFromDSC;

    @ElementCollection
    private List<String> stops;

    @Column(length = 2000)
    private String routeDetails;

    private int totalSeats;
    private int availableSeats;
    private String status; // Active, Unavailable, Heavy Traffic
    private String frequency;
}`,
  },
  {
    name: 'SecurityConfig.java',
    language: 'java',
    description: 'Spring Security 6.x configuration with JWT Authentication for DIU Student Portal',
    code: `package bd.edu.daffodilvarsity.transport.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/transport/routes/**", "/api/v1/transport/tracking/**", "/th/**").permitAll()
                .requestMatchers("/api/v1/transport/tickets/**").authenticated()
                .anyRequest().permitAll()
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`,
  },
  {
    name: 'ThymeleafWebController.java',
    language: 'java',
    description: 'Spring Boot Thymeleaf Controller for Server-Side Rendered (SSR) Web Views',
    code: `package bd.edu.daffodilvarsity.transport.controller;

import bd.edu.daffodilvarsity.transport.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ThymeleafWebController {

    @Autowired
    private TransportService transportService;

    // Server-side rendered DIU Transport Schedule page with Thymeleaf
    @GetMapping("/th/schedule")
    public String viewSchedule(Model model, @RequestParam(defaultValue = "All") String filter) {
        model.addAttribute("title", "DIU Transport Schedule - Fall 2026");
        model.addAttribute("routes", transportService.getRoutesByCategory(filter));
        model.addAttribute("campus", "Daffodil Smart City (DSC)");
        return "routes"; // renders templates/routes.html
    }

    @GetMapping("/th/tickets")
    public String viewMyTickets(Model model) {
        model.addAttribute("studentName", "Ishrat Jahan Ahona");
        model.addAttribute("studentId", "262-40-017");
        return "tickets";
    }
}`,
  },
  {
    name: 'routes.html (Thymeleaf Template)',
    language: 'html',
    description: 'Thymeleaf HTML template rendering the Fall-2026 transport schedule',
    code: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title th:text="\${title}">DIU Transport Schedule</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
                <h2 class="text-primary fw-bold">Daffodil International University</h2>
                <h5 class="text-muted">Transport Schedule @ <span th:text="\${campus}"></span></h5>
            </div>
            <span class="badge bg-success p-2">Fall-2026 Semester</span>
        </div>

        <div class="table-responsive bg-white rounded shadow-sm p-3">
            <table class="table table-hover align-middle">
                <thead class="table-primary">
                    <tr>
                        <th>Route No</th>
                        <th>Route Name</th>
                        <th>Start Time (To DSC)</th>
                        <th>Departure Time (From DSC)</th>
                        <th>Route Details</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr th:each="route : \${routes}">
                        <td class="fw-bold" th:text="\${route.routeNo}">R1</td>
                        <td th:text="\${route.name}">Dhanmondi <> DSC</td>
                        <td>
                            <span th:each="t : \${route.startTimesToDSC}" class="badge bg-info text-dark me-1" th:text="\${t}"></span>
                        </td>
                        <td>
                            <span th:each="d : \${route.departureTimesFromDSC}" class="badge bg-secondary me-1" th:text="\${d}"></span>
                        </td>
                        <td class="small text-muted" th:text="\${route.routeDetails}"></td>
                        <td>
                            <span class="badge bg-success" th:text="\${route.status}">Active</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>`,
  },
  {
    name: 'pom.xml',
    language: 'xml',
    description: 'Maven Project configuration with Spring Boot, Spring Web, Thymeleaf, Spring Data JPA, and Lombok',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.3</version>
        <relativePath/>
    </parent>
    <groupId>bd.edu.daffodilvarsity</groupId>
    <artifactId>diu-transport-backend</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>DIU Transport System</name>
    <description>Spring Boot backend for Daffodil International University Transport</description>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web for REST APIs -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Thymeleaf for Server-Side Rendering -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <!-- Spring Data JPA & PostgreSQL -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Security & JWT -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.5</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>`,
  },
];
