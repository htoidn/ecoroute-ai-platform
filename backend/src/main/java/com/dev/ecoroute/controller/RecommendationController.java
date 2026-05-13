package com.dev.ecoroute.controller;

import com.dev.ecoroute.model.Recommendation;
import com.dev.ecoroute.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RecommendationController {
    @Autowired
    private final RecommendationService service;

    @GetMapping("/{userId}")
    public List<Recommendation> recommendations(
            @PathVariable Long userId
    ) {
        return service.getRecommendations(userId);
    }

    @PostMapping
    public Recommendation create(
            @RequestBody Recommendation recommendation
    ) {
        return service.createRecommendation(recommendation);
    }

    @PostMapping("/recommend")
    public List<?> recommend(@RequestBody String input) {
        return service.recommend(input);
    }
}
