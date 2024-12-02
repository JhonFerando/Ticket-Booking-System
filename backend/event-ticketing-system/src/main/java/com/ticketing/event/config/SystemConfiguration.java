package com.ticketing.event.config;

import com.google.gson.Gson;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

@Getter
@Setter
@Component
public class SystemConfiguration {
    private int totalTickets;
    private int ticketReleaseRate;
    private int customerRetrievalRate;
    private int maxTicketCapacity;

    // Validate configuration values
    public void validateConfig() {
        if (totalTickets <= 0 || ticketReleaseRate <= 0 || customerRetrievalRate <= 0 || maxTicketCapacity <= 0) {
            throw new IllegalArgumentException("All configuration parameters must be greater than zero.");
        }
        if (totalTickets > maxTicketCapacity) {
            throw new IllegalArgumentException("Total tickets cannot exceed the maximum ticket capacity.");
        }
    }

    // Save the configuration to a JSON file
    public void saveConfigToFile(String filename) throws IOException {
        Gson gson = new Gson();
        try (FileWriter writer = new FileWriter(filename)) {
            gson.toJson(this, writer);
        }
    }

    // Load the configuration from a JSON file
    public static SystemConfiguration loadConfigFromFile(String filename) throws IOException {
        Gson gson = new Gson();
        try (FileReader reader = new FileReader(filename)) {
            return gson.fromJson(reader, SystemConfiguration.class);
        }
    }

    public String getDefaultEvent() {
        return "DefaultEvent";
    }
}
