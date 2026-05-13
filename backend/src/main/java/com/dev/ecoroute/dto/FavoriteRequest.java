package com.dev.ecoroute.dto;

import lombok.Data;

@Data
public class FavoriteRequest {
    private Long userId;
    private Long destinationId;
}
