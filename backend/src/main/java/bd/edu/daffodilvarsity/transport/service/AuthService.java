package bd.edu.daffodilvarsity.transport.service;

import bd.edu.daffodilvarsity.transport.dto.AuthUserResponse;
import bd.edu.daffodilvarsity.transport.dto.LoginRequest;
import bd.edu.daffodilvarsity.transport.dto.ProfileUpdateRequest;
import bd.edu.daffodilvarsity.transport.dto.RegisterRequest;
import bd.edu.daffodilvarsity.transport.model.TransportUser;
import bd.edu.daffodilvarsity.transport.repository.TransportUserRepository;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final TransportUserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(TransportUserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthUserResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        String username = request.username().trim().toLowerCase(Locale.ROOT);
        String studentId = normalizeStudentId(request.studentId());
        requireDiuEmail(email);
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        if (users.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This username is already taken");
        }
        if (users.existsByStudentId(studentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This student ID is already linked to an account");
        }

        TransportUser user = users.save(new TransportUser(
                UUID.randomUUID().toString(), email, username, request.name().trim(), studentId,
                passwordEncoder.encode(request.password()), request.picture()));
        return toResponse(user);
    }

    public AuthUserResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        TransportUser user = users.findByEmail(email)
                .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect"));
        if (request.studentId() != null && !request.studentId().isBlank()) {
            String studentId = normalizeStudentId(request.studentId());
            if (user.getStudentId() == null || user.getStudentId().isBlank()) {
                if (users.existsByStudentId(studentId)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "This student ID is already linked to another account");
                }
                user.attachLegacyStudentId(studentId);
                users.save(user);
            } else if (!studentId.equals(user.getStudentId())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect");
            }
        }
        return toResponse(user);
    }

        public AuthUserResponse updateProfile(String id, ProfileUpdateRequest request) {
        String studentId = normalizeStudentId(request.studentId());
        if (users.existsByStudentIdAndIdNot(studentId, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This student ID is already linked to another account");
        }
        TransportUser user = users.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in again"));
        user.updateProfile(request.name().trim(), studentId, request.picture(),
            request.phone() == null ? "" : request.phone().trim(),
            request.preferredRoute() == null ? "" : request.preferredRoute().trim());
        return toResponse(users.save(user));
        }

    public AuthUserResponse findProfile(String id) {
        return users.findById(id).map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in again"));
    }

    private AuthUserResponse toResponse(TransportUser user) {
        return new AuthUserResponse(user.getId(), user.getStudentId(), user.getName(), user.getEmail(),
                "DIU Student", "Daffodil Smart City (DSC)", user.getPhone() == null ? "" : user.getPhone(),
                user.getPicture(), "Fall 2026", "Unpaid",
                user.getPreferredRoute() == null || user.getPreferredRoute().isBlank()
                        ? "DIU Campus Loop" : user.getPreferredRoute(), 0);
    }

    public static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    public static String normalizeStudentId(String studentId) {
        return studentId.trim().toUpperCase(Locale.ROOT);
    }

    public static void requireDiuEmail(String email) {
        if (!normalizeEmail(email).endsWith("@diu.edu.bd")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use your @diu.edu.bd email address");
        }
    }

    public String hashVerificationCode(String code) {
        return passwordEncoder.encode(code);
    }

    public boolean matchesVerificationCode(String code, String hash) {
        return code != null && passwordEncoder.matches(code, hash);
    }
}