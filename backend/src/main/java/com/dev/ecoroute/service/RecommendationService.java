package com.dev.ecoroute.service;

import com.dev.ecoroute.client.AIClient;
import com.dev.ecoroute.model.Recommendation;
import com.dev.ecoroute.repository.DestinationRepository;
import com.dev.ecoroute.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository repository;

    @Autowired
    private DestinationRepository repo;

    @Autowired
    private AIClient aiClient;

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

    public List<?> recommend(String input) {
        return (List<?>) aiClient.recommend(input, repo.findAll());
    }
}
