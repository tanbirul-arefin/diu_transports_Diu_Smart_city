package bd.edu.daffodilvarsity.transport.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "transport_users")
public class TransportUser {
    @Id
    private String id;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(nullable = false, unique = true, length = 32)
    private String username;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(unique = true, length = 40)
    private String studentId;

    @Column(length = 30)
    private String phone;

    @Column(length = 100)
    private String preferredRoute;

    @Column(nullable = false, length = 100)
    private String passwordHash;

    @Column(columnDefinition = "TEXT")
    private String picture;

    protected TransportUser() {}

    public TransportUser(String id, String email, String username, String name, String studentId,
                         String passwordHash, String picture) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.name = name;
        this.studentId = studentId;
        this.passwordHash = passwordHash;
        this.picture = picture;
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getStudentId() { return studentId; }
    public String getPhone() { return phone; }
    public String getPreferredRoute() { return preferredRoute; }
    public String getPasswordHash() { return passwordHash; }
    public String getPicture() { return picture; }

    public void updateProfile(String name, String studentId, String picture, String phone, String preferredRoute) {
        this.name = name;
        this.studentId = studentId;
        this.picture = picture;
        this.phone = phone;
        this.preferredRoute = preferredRoute;
    }

    public void attachLegacyStudentId(String studentId) {
        this.studentId = studentId;
    }
}