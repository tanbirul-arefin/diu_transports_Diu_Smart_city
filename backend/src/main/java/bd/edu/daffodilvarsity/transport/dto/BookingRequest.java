package bd.edu.daffodilvarsity.transport.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record BookingRequest(
        @NotBlank String routeNo,
        @NotBlank String studentId,
        @NotBlank String studentName,
        @Min(1) @Max(60) int seatNumber,
        LocalDate departureDate,
        @NotBlank String departureTime,
        String pickupStop) {
}