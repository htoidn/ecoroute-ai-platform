package com.dev.ecoroute.controller;

import com.dev.ecoroute.model.Review;
import com.dev.ecoroute.repository.ReviewRepository;
import com.dev.ecoroute.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @GetMapping("/destination/{destinationId}")
    public List<Review> byDestination(
            @PathVariable Long destinationId
    ) {
        return service.getReviewsByDestination(destinationId);
    }

    @PostMapping
    public Review create(
            @RequestBody Review review
    ) {
        return service.createReview(review);
    }
}
