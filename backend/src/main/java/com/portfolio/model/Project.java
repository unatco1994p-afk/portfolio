package com.portfolio.model;

import java.util.List;

public record Project(
        String id,
        String title,
        String category,
        String description,
        String metrics,
        List<String> techStack,
        String githubUrl,
        boolean featured,
        String status) {}
