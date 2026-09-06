package bd.edu.daffodilvarsity.transport.controller;

import bd.edu.daffodilvarsity.transport.service.TransportService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ThymeleafWebController {
    private final TransportService transportService;

    public ThymeleafWebController(TransportService transportService) {
        this.transportService = transportService;
    }

    @GetMapping("/th/schedule")
    public String schedule(Model model, @RequestParam(defaultValue = "All") String category) {
        model.addAttribute("title", "DIU Transport Schedule - Fall 2026");
        model.addAttribute("routes", transportService.getRoutes(category));
        model.addAttribute("selectedCategory", category);
        return "schedule";
    }

    @GetMapping("/th/tickets")
    public String tickets(Model model, @RequestParam(defaultValue = "251-15-863") String studentId) {
        model.addAttribute("studentId", studentId);
        model.addAttribute("studentName", "Md.Tanbirul Arefin");
        model.addAttribute("tickets", transportService.getTickets(studentId));
        return "tickets";
    }
}