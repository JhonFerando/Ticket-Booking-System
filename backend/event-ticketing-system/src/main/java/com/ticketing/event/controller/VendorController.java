package com.ticketing.event.controller;

import com.ticketing.event.model.TicketPool;
import com.ticketing.event.service.VendorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vendors")
public class VendorController {

    private final VendorService vendorService;
    private final TicketPool ticketPool;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
        this.ticketPool = new TicketPool(0); // Initial pool with 0 tickets
    }

    @PostMapping("/start")
    public String startVendor(@RequestParam String event, @RequestParam int releaseRate) {
        vendorService.startVendor(ticketPool, event, releaseRate);
        return "Vendor started for event: " + event;
    }

    @GetMapping("/tickets")
    public int getTotalTickets() {
        return ticketPool.getTotalTickets();
    }
}
