package com.dev.ecoroute.repository;

import com.dev.ecoroute.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {

    @Query("""
                SELECT d FROM Destination d
                WHERE d.sustainabilityScore > :score
                AND d.costIndex < :cost
                ORDER BY d.sustainabilityScore DESC
            """)
    List<Destination> findEcoFriendly(
            @Param("score") double score,
            @Param("cost") double cost
    );

    @Query(value = """
                SELECT * FROM destinations
                WHERE tags ILIKE %:tag%
            """, nativeQuery = true)
    List<Destination> findByTag(@Param("tag") String tag);

}
