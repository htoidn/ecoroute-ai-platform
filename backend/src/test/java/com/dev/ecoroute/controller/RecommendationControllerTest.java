package com.dev.ecoroute.controller;

import com.dev.ecoroute.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationControllerTest {

    @Mock
    private RecommendationService service;

    @InjectMocks
    private RecommendationController controller;

    @Test
    void shouldReturnRecommendations() {

        when(service.recommend("eco city"))
                .thenReturn(List.of());

        var result = controller.recommend("eco city");

        assertNotNull(result);
    }
}