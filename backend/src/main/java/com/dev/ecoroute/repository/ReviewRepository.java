package com.dev.ecoroute.repository;

import com.dev.ecoroute.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDestinationId(Long destinationId);
}
