package com.ticketing.event.controller;

import com.ticketing.event.service.TicketPoolService;
import com.ticketing.event.service.CustomerService;
import com.ticketing.event.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketPoolService ticketPoolService;

    @Autowired
    private VendorService vendorService;

    @Autowired
    private CustomerService customerService;

    @PostMapping("/initialize")
    public String initializeEvent(@RequestParam String event, @RequestParam int maxCapacity) {
        if (maxCapacity <= 0) {
            return "Error: Maximum capacity must be greater than zero.";
        }
        try {
            ticketPoolService.initializeEvent(event, maxCapacity);
            return "Event '" + event + "' initialized with capacity: " + maxCapacity;
        } catch (Exception e) {
            return "Error initializing event: " + e.getMessage();
        }
    }

    @PostMapping("/add-vendor")
    public String addVendor(@RequestParam String event, @RequestParam int releaseRate) {
        if (!ticketPoolService.eventExists(event)) {
            return "Error: Event '" + event + "' is not initialized.";
        }
        if (releaseRate <= 0) {
            return "Error: Release rate must be greater than zero.";
        }
        vendorService.startVendors(ticketPoolService.getTicketPool(), event, releaseRate);
        return "Vendor for event '" + event + "' started with release rate of " + releaseRate + " tickets/second.";
    }

    @PostMapping("/add-customers")
    public String addCustomers(@RequestParam String event, @RequestParam int count) {
        if (!ticketPoolService.eventExists(event)) {
            return "Error: Event '" + event + "' is not initialized.";
        }
        if (count <= 0) {
            return "Error: Customer count must be greater than zero.";
        }
        customerService.startCustomers(ticketPoolService.getTicketPool(), count, event);
        return count + " customers added for event '" + event + "'.";
    }

    @GetMapping("/tickets")
    public String getRemainingTickets(@RequestParam String event) {
        if (!ticketPoolService.eventExists(event)) {
            return "Error: Event '" + event + "' is not initialized.";
        }
        int count = ticketPoolService.getTicketCount(event);
        return "Remaining tickets for event '" + event + "': " + count;
    }
}
