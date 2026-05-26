package com.dev.ecoroute.service;

import com.dev.ecoroute.model.Destination;
import com.dev.ecoroute.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DestinationService {
    private final DestinationRepository repository;

    // READ ALL
    @Transactional(readOnly = true)
    public List<Destination> getAllDestinations() {
        try {
            return repository.findAll();
        } catch (Exception e) {
            log.error("Error fetching destinations: {}", e.getMessage());
            // Return empty list if table doesn't exist
            if (e.getMessage().contains("does not exist")) {
                log.warn("Destinations table does not exist. Please run the database initialization script.");
                return Collections.emptyList();
            }
            throw new RuntimeException("Database error: " + e.getMessage());
        }
    }

    // CREATE/INSERT
    public Destination createDestination(Destination destination) {
        try {
            return repository.save(destination);
        } catch (Exception e) {
            log.error("Error creating destination: {}", e.getMessage());
            throw new RuntimeException("Database error: " + e.getMessage());
        }
    }



    // READ BY ID
    public Destination getById(Long id) {
        try {
            return repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
        } catch (Exception e) {
            log.error("Error fetching destination by id: {}", e.getMessage());
            if (e.getMessage().contains("does not exist")) {
                throw new RuntimeException("Destinations table does not exist. Please run database initialization.");
            }
            throw new RuntimeException("Database error: " + e.getMessage());
        }
    }

    public List<Destination> getEcoRecommendations() {
        return repository.findEcoFriendly(85, 70);
    }

    public List<Destination> searchByTag(String tag) {
        return repository.findByTag(tag);
    }
}
