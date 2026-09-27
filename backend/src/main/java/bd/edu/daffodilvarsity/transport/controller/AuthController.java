package bd.edu.daffodilvarsity.transport.controller;

import bd.edu.daffodilvarsity.transport.dto.AuthUserResponse;
import bd.edu.daffodilvarsity.transport.dto.EmailVerificationRequest;
import bd.edu.daffodilvarsity.transport.dto.LoginRequest;
import bd.edu.daffodilvarsity.transport.dto.ProfileUpdateRequest;
import bd.edu.daffodilvarsity.transport.dto.RegisterRequest;
import bd.edu.daffodilvarsity.transport.service.AuthService;
import bd.edu.daffodilvarsity.transport.service.EmailVerificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.security.SecureRandom;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private static final String USER_ID = "transportUserId";
    private static final String OTP_EMAIL = "verificationEmail";
    private static final String OTP_HASH = "verificationHash";
    private static final String OTP_EXPIRY = "verificationExpiry";
    private static final String OTP_ATTEMPTS = "verificationAttempts";
    private static final String OTP_LAST_SENT = "verificationLastSent";
    private static final String VERIFIED_EMAIL = "verifiedEmail";
    private static final String VERIFIED_EXPIRY = "verifiedExpiry";
    private static final long OTP_TTL_MILLIS = 10 * 60 * 1000L;
    private static final long RESEND_WAIT_MILLIS = 60 * 1000L;
    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final SecureRandom RANDOM = new SecureRandom();
    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    public AuthController(AuthService authService, EmailVerificationService emailVerificationService) {
        this.authService = authService;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/email-code")
    public ResponseEntity<Void> sendEmailCode(@Valid @RequestBody EmailVerificationRequest request,
                                              HttpSession session) {
        String email = AuthService.normalizeEmail(request.email());
        AuthService.requireDiuEmail(email);
        Long lastSent = (Long) session.getAttribute(OTP_LAST_SENT);
        if (lastSent != null && Instant.now().toEpochMilli() - lastSent < RESEND_WAIT_MILLIS) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait one minute before requesting another code");
        }
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        emailVerificationService.sendCode(email, code);
        session.setAttribute(OTP_EMAIL, email);
        session.setAttribute(OTP_HASH, authService.hashVerificationCode(code));
        session.setAttribute(OTP_EXPIRY, Instant.now().toEpochMilli() + OTP_TTL_MILLIS);
        session.setAttribute(OTP_ATTEMPTS, 0);
        session.setAttribute(OTP_LAST_SENT, Instant.now().toEpochMilli());
        session.removeAttribute(VERIFIED_EMAIL);
        session.removeAttribute(VERIFIED_EXPIRY);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@Valid @RequestBody EmailVerificationRequest request,
                                            HttpSession session) {
        String email = AuthService.normalizeEmail(request.email());
        String pendingEmail = (String) session.getAttribute(OTP_EMAIL);
        Long expiry = (Long) session.getAttribute(OTP_EXPIRY);
        Integer attempts = (Integer) session.getAttribute(OTP_ATTEMPTS);
        String expectedHash = (String) session.getAttribute(OTP_HASH);
        if (!email.equals(pendingEmail) || expiry == null || Instant.now().toEpochMilli() > expiry
                || expectedHash == null || attempts == null || attempts >= MAX_OTP_ATTEMPTS) {
            clearOtp(session);
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The code is expired or unavailable. Request a new code.");
        }
        session.setAttribute(OTP_ATTEMPTS, attempts + 1);
        if (!authService.matchesVerificationCode(request.code(), expectedHash)) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "That verification code does not match");
        }
        session.setAttribute(VERIFIED_EMAIL, email);
        session.setAttribute(VERIFIED_EXPIRY, Instant.now().toEpochMilli() + OTP_TTL_MILLIS);
        clearOtp(session);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public AuthUserResponse register(@Valid @RequestBody RegisterRequest request, HttpServletRequest servletRequest) {
        HttpSession session = servletRequest.getSession(false);
        String verifiedEmail = session == null ? null : (String) session.getAttribute(VERIFIED_EMAIL);
        Long verifiedExpiry = session == null ? null : (Long) session.getAttribute(VERIFIED_EXPIRY);
        String email = AuthService.normalizeEmail(request.email());
        if (!email.equals(verifiedEmail) || verifiedExpiry == null || Instant.now().toEpochMilli() > verifiedExpiry) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Verify your DIU email before creating an account");
        }
        AuthUserResponse user = authService.register(request);
        return startSession(user, servletRequest);
    }

    @PostMapping("/login")
    public AuthUserResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        return startSession(authService.login(request), servletRequest);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> me(HttpSession session) {
        Object userId = session.getAttribute(USER_ID);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.findProfile(userId.toString()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/profile")
    public AuthUserResponse updateProfile(@Valid @RequestBody ProfileUpdateRequest request, HttpSession session) {
        Object userId = session.getAttribute(USER_ID);
        if (userId == null) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Please sign in again");
        }
        return authService.updateProfile(userId.toString(), request);
    }

    private void clearOtp(HttpSession session) {
        session.removeAttribute(OTP_EMAIL);
        session.removeAttribute(OTP_HASH);
        session.removeAttribute(OTP_EXPIRY);
        session.removeAttribute(OTP_ATTEMPTS);
    }

    private AuthUserResponse startSession(AuthUserResponse user, HttpServletRequest request) {
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }
        request.getSession(true).setAttribute(USER_ID, user.id());
        return user;
    }
}