package com.dev.ecoroute.service;

import com.dev.ecoroute.client.AIClient;
import com.dev.ecoroute.dto.RecommendationRequest;
import com.dev.ecoroute.model.Destination;
import com.dev.ecoroute.model.Recommendation;
import com.dev.ecoroute.model.User;
import com.dev.ecoroute.repository.DestinationRepository;
import com.dev.ecoroute.repository.RecommendationRepository;
import com.dev.ecoroute.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository repository;

    private final UserRepository userRepository;

    private final DestinationRepository destinationRepository;

    private final AIClient aiClient;

    public List<Recommendation> getRecommendations(
            Long userId
    ) {

        return repository.findByUser_Id(userId);
    }

    public Recommendation createRecommendation(
            RecommendationRequest request
    ) {

        User user = userRepository.findById(
                request.getUserId()
        ).orElseThrow();

        Destination destination =
                destinationRepository.findById(
                        request.getDestinationId()
                ).orElseThrow();

        Recommendation recommendation =
                Recommendation.builder()
                        .user(user)
                        .destination(destination)
                        .aiScore(request.getAiScore())
                        .reason(request.getReason())
                        .build();

        return repository.save(recommendation);
    }

    public List<?> recommend(String input) {

        List<Destination> destinations =
                destinationRepository.findAll();

        return (List<?>) aiClient.recommend(
                input,
                destinations
        );
    }
}
