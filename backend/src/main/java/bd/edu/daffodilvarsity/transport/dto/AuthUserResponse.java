package bd.edu.daffodilvarsity.transport.dto;

public record AuthUserResponse(
        String id,
        String studentId,
        String name,
        String email,
        String department,
        String campus,
        String phone,
        String avatarUrl,
        String semester,
        String transportFeeStatus,
        String preferredRoute,
        int walletBalance) {}