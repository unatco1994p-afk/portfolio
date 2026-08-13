package com.portfolio.model;

public record UserProfile(
        String name,
        String title,
        String avatarUrl,
        String status,
        String bio,
        String location,
        String email,
        String githubUrl,
        String linkedinUrl) {}
