package com.ticketing.event.controller;

import com.ticketing.event.model.TicketPool;
import com.ticketing.event.service.CustomerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final TicketPool ticketPool;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
        this.ticketPool = new TicketPool(100, "Concert"); // Initialize with 100 tickets for "Concert"
    }

    @PostMapping("/start")
    public String startCustomers(@RequestParam int customerCount, @RequestParam String event) {
        customerService.startCustomers(ticketPool, customerCount, event);
        return customerCount + " customers started for event: " + event;
    }

    @GetMapping("/tickets")
    public int getRemainingTickets() {
        return ticketPool.getTicketCount();
    }
}
