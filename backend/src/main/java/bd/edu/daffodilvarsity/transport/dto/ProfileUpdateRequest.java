package bd.edu.daffodilvarsity.transport.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Size(max = 40) String studentId,
        @NotBlank @Size(max = 2_800_000) String picture,
        @Size(max = 30) String phone,
        @Size(max = 100) String preferredRoute) {}