package com.portfolio.model;

public record Certification(
        String id,
        String name,
        String issuer,
        String issueDate,
        String credentialUrl,
        String badgeUrl,
        String description) {}
