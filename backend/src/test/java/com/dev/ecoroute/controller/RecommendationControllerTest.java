package com.dev.ecoroute.controller;

import com.dev.ecoroute.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RecommendationController.class)
class RecommendationControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RecommendationService service;

    @Test
    void shouldReturnRecommendations() throws Exception {

        when(service.recommend("eco city"))
                .thenReturn(List.of());

        mockMvc.perform(post("/api/recommend")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("eco city"))
                .andExpect(status().isOk());
    }
}