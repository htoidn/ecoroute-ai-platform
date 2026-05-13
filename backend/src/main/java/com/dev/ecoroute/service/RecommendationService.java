package com.dev.ecoroute.service;

import com.dev.ecoroute.model.Recommendation;
import com.dev.ecoroute.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository repository;

    public List<Recommendation> getRecommendations(
            Long userId
    ) {
        return repository.findByUserId(userId);
    }

    public Recommendation createRecommendation(
            Recommendation recommendation
    ) {
        return repository.save(recommendation);
    }
}
