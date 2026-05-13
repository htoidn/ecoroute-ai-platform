package com.dev.ecoroute.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FavoriteResponse {
    private Long id;

    private Long userId;

    private String username;

    private Long destinationId;

    private String destinationName;

    private String country;
}
