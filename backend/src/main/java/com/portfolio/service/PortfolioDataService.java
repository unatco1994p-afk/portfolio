package com.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.model.*;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class PortfolioDataService {

    @Inject
    ObjectMapper objectMapper;

    private PortfolioData portfolioData;

    @PostConstruct
    void init() {
        try (InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("data/portfolio.json")) {
            if (is != null) {
                this.portfolioData = objectMapper.readValue(is, PortfolioData.class);
            } else {
                this.portfolioData = new PortfolioData();
            }
        } catch (Exception e) {
            e.printStackTrace();
            this.portfolioData = new PortfolioData();
        }
    }

    public PortfolioData getPortfolioData() {
        return portfolioData;
    }

    public UserProfile getProfile() {
        return portfolioData != null ? portfolioData.getProfile() : null;
    }

    public List<Project> getProjects() {
        return portfolioData != null && portfolioData.getProjects() != null ? portfolioData.getProjects() : Collections.emptyList();
    }

    public List<TechSkill> getSkills() {
        return portfolioData != null && portfolioData.getSkills() != null ? portfolioData.getSkills() : Collections.emptyList();
    }

    public List<WorkExperience> getExperiences() {
        return portfolioData != null && portfolioData.getExperiences() != null ? portfolioData.getExperiences() : Collections.emptyList();
    }

    public List<SystemMetric> getMetrics() {
        return portfolioData != null && portfolioData.getMetrics() != null ? portfolioData.getMetrics() : Collections.emptyList();
    }
}
