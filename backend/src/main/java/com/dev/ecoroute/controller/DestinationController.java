package com.dev.ecoroute.controller;


import com.dev.ecoroute.model.Destination;
import com.dev.ecoroute.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService service;

    // CREATE
    @PostMapping
    public Destination create(@RequestBody Destination destination) {
        return service.createDestination(destination);
    }

    // READ ALL
    @GetMapping
    public List<Destination> getAll() {
        return service.getAllDestinations();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Destination getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/eco")
    public List<Destination> eco() {
        return service.getEcoRecommendations();
    }

    @GetMapping("/tag")
    public List<Destination> tag(@RequestParam String tag) {
        return service.searchByTag(tag);
    }
}
