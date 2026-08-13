package com.portfolio.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record WorkExperience(
        String id,
        String company,
        String role,
        String period,
        String location,
        String summary,
        List<String> achievements,
        List<String> technologies,
        @JsonProperty("isCurrent") boolean isCurrent) {}
