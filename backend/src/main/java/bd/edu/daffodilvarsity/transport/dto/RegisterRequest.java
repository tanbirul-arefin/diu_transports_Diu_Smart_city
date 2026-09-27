package bd.edu.daffodilvarsity.transport.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 3, max = 32) @Pattern(regexp = "[a-zA-Z0-9._-]+") String username,
        @NotBlank @Size(max = 40) String studentId,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank @Size(max = 2_800_000) String picture) {}