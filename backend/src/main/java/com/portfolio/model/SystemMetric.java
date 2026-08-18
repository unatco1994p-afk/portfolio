package com.portfolio.model;

public record SystemMetric(
        String id, String label, String value, String unit, String trend, String status) {}
