package bd.edu.daffodilvarsity.transport.config;

import bd.edu.daffodilvarsity.transport.model.BusRoute;
import bd.edu.daffodilvarsity.transport.repository.BusRouteRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedRoutes(BusRouteRepository repository) {
        return args -> {
            if (repository.count() > 0) return;
            repository.saveAll(List.of(
                    route("Campus Loop", "DIU Campus Loop", "DIU Shuttle", "DIU Main Campus (Sobhanbag)",
                            "DIU Permanent Campus (Ashulia)", "DIU Main Campus <> Daffodil Smart City <> DIU Permanent Campus",
                            40, 14, "Every 15 min", List.of("07:30 AM", "08:30 AM", "09:30 AM", "10:30 AM"),
                            List.of("01:30 PM", "03:30 PM", "04:30 PM"),
                            List.of("DIU Main Campus", "Daffodil Smart City Main Gate", "Academic Building 4", "DIU Permanent Campus"),
                            List.of("DIU-07-1203", "DIU-07-1204")),
                    route("R1", "DIU - Dhanmondi", "City Routes", "Dhanmondi (Sobhanbag)", "Daffodil Smart City (DSC)",
                            "Dhanmondi <> Shyamoli Square <> Gabtoli <> Birulia <> DSC", 48, 8, "Every 30 min",
                            List.of("07:00 AM", "10:00 AM"), List.of("01:30 PM", "04:20 PM", "06:10 PM"),
                            List.of("Dhanmondi Sobhanbag", "Shyamoli Square", "Technical Mor", "Daffodil Smart City"),
                            List.of("DIU-07-1105", "DIU-07-1106")),
                    route("R2", "DIU - Uttara (Rajlokkhi & Metro)", "City Routes", "Uttara Rajlokkhi", "Daffodil Smart City (DSC)",
                            "Uttara Rajlokkhi <> Metro Rail Center <> Birulia <> DSC", 48, 19, "Every 30 min",
                            List.of("07:00 AM", "10:00 AM"), List.of("01:30 PM", "04:20 PM", "06:10 PM"),
                            List.of("Uttara Rajlokkhi", "House Building", "Uttara Metro Rail Center", "Daffodil Smart City"),
                            List.of("DIU-07-1420", "DIU-07-1422")),
                    route("F1", "Friday: Dhanmondi <> DSC", "Friday Schedule", "Dhanmondi Sobhanbag", "Daffodil Smart City (DSC)",
                            "Friday special: Dhanmondi <> DSC", 48, 24, "Friday only",
                            List.of("07:30 AM"), List.of("02:20 PM"),
                            List.of("Dhanmondi Sobhanbag", "Shyamoli Square", "Daffodil Smart City"), List.of("DIU-07-1901")),
                    route("F2", "Friday: Tongi & Uttara <> DSC", "Friday Schedule", "Tongi College Gate", "Daffodil Smart City (DSC)",
                            "Friday special: Tongi <> Uttara <> DSC", 48, 20, "Friday only",
                            List.of("07:30 AM"), List.of("02:20 PM"),
                            List.of("Tongi College Gate", "Uttara Rajlokkhi", "Daffodil Smart City"), List.of("DIU-07-1902"))
            ));
        };
    }

    private BusRoute route(String no, String name, String category, String start, String destination, String details,
                           int total, int available, String frequency, List<String> toDsc, List<String> fromDsc,
                           List<String> stops, List<String> buses) {
        return new BusRoute(no, name, category, start, destination, details, total, available, "Active", frequency,
                toDsc, fromDsc, stops, buses);
    }
}