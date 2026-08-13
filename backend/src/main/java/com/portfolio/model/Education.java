package com.portfolio.model;

public record Education(
        String id,
        String institution,
        String degree,
        String fieldOfStudy,
        String specialization,
        String period,
        String location,
        String description) {}
