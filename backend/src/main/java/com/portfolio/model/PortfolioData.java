package com.portfolio.model;

import java.util.List;

public class PortfolioData {
    private UserProfile profile;
    private List<SystemMetric> metrics;
    private List<Project> projects;
    private List<TechSkill> skills;
    private List<WorkExperience> experiences;

    public PortfolioData() {}

    public UserProfile getProfile() { return profile; }
    public void setProfile(UserProfile profile) { this.profile = profile; }

    public List<SystemMetric> getMetrics() { return metrics; }
    public void setMetrics(List<SystemMetric> metrics) { this.metrics = metrics; }

    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }

    public List<TechSkill> getSkills() { return skills; }
    public void setSkills(List<TechSkill> skills) { this.skills = skills; }

    public List<WorkExperience> getExperiences() { return experiences; }
    public void setExperiences(List<WorkExperience> experiences) { this.experiences = experiences; }
}
