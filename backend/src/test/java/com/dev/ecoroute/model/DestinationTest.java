package com.dev.ecoroute.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DestinationTest {
    @Test
    void shouldCreateDestinationSuccessfully() {

        Destination destination = new Destination();

        destination.setName("Leipzig");
        destination.setCountry("Germany");
        destination.setSustainabilityScore(90.00);
        destination.setCostIndex(55.00);

        assertEquals("Leipzig", destination.getName());
        assertEquals("Germany", destination.getCountry());
        assertEquals(90.00, destination.getSustainabilityScore());
        assertEquals(55.00, destination.getCostIndex());
    }

    @Test
    void shouldHandleDescription() {

        Destination destination = new Destination();

        destination.setDescription("Creative sustainable city");

        assertNotNull(destination.getDescription());
        assertTrue(destination.getDescription().contains("sustainable"));
    }
}