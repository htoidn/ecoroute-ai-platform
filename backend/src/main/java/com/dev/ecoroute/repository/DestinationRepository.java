package com.dev.ecoroute.repository;

import com.dev.ecoroute.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByCountry(String country);

    List<Destination> findBySustainabilityScoreGreaterThan(Double score);

    List<Destination> findTop5ByOrderBySustainabilityScoreDesc();
}
