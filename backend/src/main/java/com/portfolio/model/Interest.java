package com.portfolio.model;

import java.util.List;

public record Interest(
        String id,
        String icon,
        String title,
        String category,
        String description,
        List<String> tags) {}
