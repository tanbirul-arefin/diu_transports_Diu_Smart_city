package bd.edu.daffodilvarsity.transport.repository;

import bd.edu.daffodilvarsity.transport.model.TransportUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportUserRepository extends JpaRepository<TransportUser, String> {
    Optional<TransportUser> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByStudentId(String studentId);
    boolean existsByStudentIdAndIdNot(String studentId, String id);
}