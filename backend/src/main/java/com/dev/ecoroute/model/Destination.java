package com.dev.ecoroute.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String country;
    private Double sustainabilityScore;
    private Double costIndex;
    private Double crowdIndex;
    private Double co2PerTrip;
    private Double publicTransportScore;
    private Double avgTemp;
    private String bestSeason;
    private String tags;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Relationships with other entities(e.g., reviews, itineraries)
    @OneToMany(mappedBy = "destination")
    @JsonIgnore
    private List<Review> reviews;

    @OneToMany(mappedBy = "destination")
    @JsonIgnore
    private List<Recommendation> recommendations;
}
