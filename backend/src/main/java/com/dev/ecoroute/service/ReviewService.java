package com.dev.ecoroute.service;


import com.dev.ecoroute.model.Review;
import com.dev.ecoroute.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository repository;

    public List<Review> getReviewsByDestination(
            Long destinationId
    ) {
        return repository.findByDestinationId(destinationId);
    }

    public Review createReview(Review review) {
        return repository.save(review);
    }
}
