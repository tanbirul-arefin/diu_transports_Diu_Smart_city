package bd.edu.daffodilvarsity.transport.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class EmailVerificationService {
    private final JavaMailSender mailSender;
    private final String mailHost;
    private final String fromAddress;

    public EmailVerificationService(JavaMailSender mailSender,
                                    @Value("${spring.mail.host:}") String mailHost,
                                    @Value("${transport.mail.from:}") String fromAddress) {
        this.mailSender = mailSender;
        this.mailHost = mailHost;
        this.fromAddress = fromAddress;
    }

    public void sendCode(String email, String code) {
        if (mailHost.isBlank() || fromAddress.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Email verification is not configured yet. Please contact the administrator.");
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(email);
        message.setSubject("DIU Transports email verification");
        message.setText("Your DIU Transports verification code is " + code
                + ". It expires in 10 minutes. If you did not request this code, ignore this email.");
        try {
            mailSender.send(message);
        } catch (MailException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "We could not send the verification email. Please try again later.");
        }
    }
}