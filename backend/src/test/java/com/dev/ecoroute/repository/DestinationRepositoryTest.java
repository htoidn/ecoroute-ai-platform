package com.dev.ecoroute.repository;

import com.dev.ecoroute.model.Destination;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.*;

class DestinationRepositoryTest {
    @Autowired
    private DestinationRepository repository;

    @Test
    void shouldSaveDestination() {

        Destination destination = new Destination();

        destination.setName("Berlin");
        destination.setCountry("Germany");
        destination.setSustainabilityScore(85.00);

        Destination saved = repository.save(destination);

        assertNotNull(saved.getId());
        assertEquals("Berlin", saved.getName());
    }

}