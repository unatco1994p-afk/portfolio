package com.portfolio.model;

import java.util.List;

public record PortfolioData(
        UserProfile profile,
        List<SystemMetric> metrics,
        List<Project> projects,
        List<TechSkill> skills,
        List<WorkExperience> experiences,
        List<Education> education,
        List<Certification> certifications,
        List<Interest> interests) {
    public PortfolioData() {
        this(null, null, null, null, null, null, null, null);
    }
}
