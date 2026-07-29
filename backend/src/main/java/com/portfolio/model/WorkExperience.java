package com.portfolio.model;

import java.util.List;

public class WorkExperience {
    private String id;
    private String company;
    private String role;
    private String period;
    private String location;
    private String summary;
    private List<String> achievements;
    private List<String> technologies;
    private boolean isCurrent;

    public WorkExperience() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getAchievements() { return achievements; }
    public void setAchievements(List<String> achievements) { this.achievements = achievements; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

    public boolean isIsCurrent() { return isCurrent; }
    public void setIsCurrent(boolean current) { isCurrent = current; }
}
