package com.dev.ecoroute.repository;

import com.dev.ecoroute.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);

    boolean existsByUserIdAndDestinationId(
            Long userId,
            Long destinationId
    );
}
