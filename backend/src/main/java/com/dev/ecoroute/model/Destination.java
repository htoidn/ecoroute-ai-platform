package com.dev.ecoroute.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
