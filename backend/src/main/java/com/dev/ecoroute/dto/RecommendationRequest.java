package com.dev.ecoroute.dto;

import lombok.Data;

@Data
public class RecommendationRequest {
    private Long userId;
    private Long destinationId;
    private Double aiScore;
    private String reason;
}
