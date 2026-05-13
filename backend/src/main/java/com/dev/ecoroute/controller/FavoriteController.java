package com.dev.ecoroute.controller;

import com.dev.ecoroute.dto.FavoriteRequest;
import com.dev.ecoroute.dto.FavoriteResponse;
import com.dev.ecoroute.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FavoriteController {

    private final FavoriteService favoriteService;

    // CREATE FAVORITE
    @PostMapping
    public FavoriteResponse createFavorite(
            @RequestBody FavoriteRequest request
    ) {
        return favoriteService.createFavorite(request);
    }


    // GET USER FAVORITES
    @GetMapping("/user/{userId}")
    public List<FavoriteResponse> getFavorites(
            @PathVariable Long userId
    ) {
        return favoriteService.getUserFavorites(userId);
    }


    // DELETE FAVORITE
    @DeleteMapping("/{id}")
    public void deleteFavorite(
            @PathVariable Long id
    ) {
        favoriteService.deleteFavorite(id);
    }
}
