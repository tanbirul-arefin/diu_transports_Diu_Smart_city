package bd.edu.daffodilvarsity.transport.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Email @Size(max = 254) String email,
        @Size(max = 40) String studentId,
        @NotBlank @Size(max = 72) String password) {}