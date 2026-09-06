package bd.edu.daffodilvarsity.transport.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bookingId;
    private String studentId;
    private String studentName;
    private String routeNo;
    private String routeName;
    private String busNumber;
    private int seatNumber;
    private LocalDate departureDate;
    private String departureTime;
    private String pickupStop;
    private String destinationStop;
    private String status;
    private String qrData;

    protected Ticket() {}

    public Ticket(String bookingId, String studentId, String studentName, String routeNo, String routeName,
                  String busNumber, int seatNumber, LocalDate departureDate, String departureTime,
                  String pickupStop, String destinationStop, String status, String qrData) {
        this.bookingId = bookingId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.routeNo = routeNo;
        this.routeName = routeName;
        this.busNumber = busNumber;
        this.seatNumber = seatNumber;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.pickupStop = pickupStop;
        this.destinationStop = destinationStop;
        this.status = status;
        this.qrData = qrData;
    }

    public Long getId() { return id; }
    public String getBookingId() { return bookingId; }
    public String getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public String getRouteNo() { return routeNo; }
    public String getRouteName() { return routeName; }
    public String getBusNumber() { return busNumber; }
    public int getSeatNumber() { return seatNumber; }
    public LocalDate getDepartureDate() { return departureDate; }
    public String getDepartureTime() { return departureTime; }
    public String getPickupStop() { return pickupStop; }
    public String getDestinationStop() { return destinationStop; }
    public String getStatus() { return status; }
    public String getQrData() { return qrData; }
}