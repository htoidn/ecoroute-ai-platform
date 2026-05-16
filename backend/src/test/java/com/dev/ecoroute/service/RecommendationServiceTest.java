package com.dev.ecoroute.service;

import com.dev.ecoroute.client.AIClient;
import com.dev.ecoroute.model.Destination;
import com.dev.ecoroute.repository.DestinationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private DestinationRepository repository;

    @Mock
    private AIClient aiClient;

    @InjectMocks
    private RecommendationService service;

    private Destination destination;

    @BeforeEach
    void setup() {

        destination = new Destination();
        destination.setId(1L);
        destination.setName("Leipzig");
        destination.setDescription("Affordable sustainable city");
    }

    @Test
    void shouldReturnRecommendations() {

        when(repository.findAll())
                .thenReturn(List.of(destination));

        when(aiClient.recommend(anyString(), anyList()))
                .thenReturn(List.of(destination));

        List<?> result = service.recommend("eco city");

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(repository, times(1)).findAll();
        verify(aiClient, times(1))
                .recommend(anyString(), anyList());
    }
}