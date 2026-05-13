package com.dev.ecoroute.service;

import com.dev.ecoroute.dto.FavoriteRequest;
import com.dev.ecoroute.dto.FavoriteResponse;
import com.dev.ecoroute.model.Destination;
import com.dev.ecoroute.model.Favorite;
import com.dev.ecoroute.model.User;
import com.dev.ecoroute.repository.DestinationRepository;
import com.dev.ecoroute.repository.FavoriteRepository;
import com.dev.ecoroute.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    // CREATE FAVORITE
    public FavoriteResponse createFavorite(
            FavoriteRequest request
    ) {

        boolean exists =
                favoriteRepository.existsByUserIdAndDestinationId(
                        request.getUserId(),
                        request.getDestinationId()
                );

        if (exists) {
            throw new RuntimeException(
                    "Destination already favorited"
            );
        }

        User user = userRepository.findById(
                request.getUserId()
        ).orElseThrow(() ->
                new RuntimeException("User not found"));

        Destination destination =
                destinationRepository.findById(
                        request.getDestinationId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Destination not found"));

        Favorite favorite = Favorite.builder()
                .user(user)
                .destination(destination)
                .build();

        Favorite saved =
                favoriteRepository.save(favorite);

        return mapToResponse(saved);
    }

    // GET USER FAVORITES
    public List<FavoriteResponse> getUserFavorites(
            Long userId
    ) {

        return favoriteRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // DELETE FAVORITE
    public void deleteFavorite(Long id) {
        favoriteRepository.deleteById(id);
    }


    // MAPPER
    private FavoriteResponse mapToResponse(
            Favorite favorite
    ) {

        return FavoriteResponse.builder()
                .id(favorite.getId())
                .userId(favorite.getUser().getId())
                .username(favorite.getUser().getUsername())
                .destinationId(
                        favorite.getDestination().getId()
                )
                .destinationName(
                        favorite.getDestination().getName()
                )
                .country(
                        favorite.getDestination().getCountry()
                )
                .build();
    }
}
