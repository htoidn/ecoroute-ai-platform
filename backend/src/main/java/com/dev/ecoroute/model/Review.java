package com.dev.ecoroute.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer rating;

    private String comment;

    // Many Reviews -> ONE USER
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    // Many Reviews -> ONE DESTINATION
    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Destination destination;
}
