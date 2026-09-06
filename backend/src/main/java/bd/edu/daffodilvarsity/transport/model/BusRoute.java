package bd.edu.daffodilvarsity.transport.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bus_routes")
public class BusRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String routeNo;
    private String name;
    private String category;
    private String startPoint;
    private String destination;
    private String routeDetails;
    private int totalSeats;
    private int availableSeats;
    private String status;
    private String frequency;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "route_start_times", joinColumns = @JoinColumn(name = "route_id"))
    private List<String> startTimesToDsc = new ArrayList<>();
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "route_return_times", joinColumns = @JoinColumn(name = "route_id"))
    private List<String> departureTimesFromDsc = new ArrayList<>();
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "route_stops", joinColumns = @JoinColumn(name = "route_id"))
    private List<String> stops = new ArrayList<>();
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "route_buses", joinColumns = @JoinColumn(name = "route_id"))
    private List<String> activeBuses = new ArrayList<>();

    protected BusRoute() {}

    public BusRoute(String routeNo, String name, String category, String startPoint, String destination,
                    String routeDetails, int totalSeats, int availableSeats, String status, String frequency,
                    List<String> startTimesToDsc, List<String> departureTimesFromDsc, List<String> stops,
                    List<String> activeBuses) {
        this.routeNo = routeNo;
        this.name = name;
        this.category = category;
        this.startPoint = startPoint;
        this.destination = destination;
        this.routeDetails = routeDetails;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.status = status;
        this.frequency = frequency;
        this.startTimesToDsc = new ArrayList<>(startTimesToDsc);
        this.departureTimesFromDsc = new ArrayList<>(departureTimesFromDsc);
        this.stops = new ArrayList<>(stops);
        this.activeBuses = new ArrayList<>(activeBuses);
    }

    public Long getId() { return id; }
    public String getRouteNo() { return routeNo; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getStartPoint() { return startPoint; }
    public String getDestination() { return destination; }
    public String getRouteDetails() { return routeDetails; }
    public int getTotalSeats() { return totalSeats; }
    public int getAvailableSeats() { return availableSeats; }
    public String getStatus() { return status; }
    public String getFrequency() { return frequency; }
    public List<String> getStartTimesToDsc() { return startTimesToDsc; }
    public List<String> getDepartureTimesFromDsc() { return departureTimesFromDsc; }
    public List<String> getStops() { return stops; }
    public List<String> getActiveBuses() { return activeBuses; }
}