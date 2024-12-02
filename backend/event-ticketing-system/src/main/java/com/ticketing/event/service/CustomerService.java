package com.ticketing.event.service;

import com.ticketing.event.model.Customer;
import com.ticketing.event.model.TicketPool;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Async
    public void startCustomers(TicketPool ticketPool, int customerCount, String event) {
        for (int i = 0; i < customerCount; i++) {
            Customer customer = new Customer(ticketPool, event);
            Thread customerThread = new Thread(customer, "Customer-" + (i + 1));
            customerThread.start();
        }
    }
}
