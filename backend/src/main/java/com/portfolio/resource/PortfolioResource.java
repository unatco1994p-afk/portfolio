package com.portfolio.resource;

import com.portfolio.model.*;
import com.portfolio.service.PortfolioDataService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
public class PortfolioResource {

    @Inject
    PortfolioDataService dataService;

    @GET
    @Path("/portfolio")
    public PortfolioData getPortfolio() {
        return dataService.getPortfolioData();
    }

    @GET
    @Path("/profile")
    public UserProfile getProfile() {
        return dataService.getProfile();
    }

    @GET
    @Path("/projects")
    public List<Project> getProjects() {
        return dataService.getProjects();
    }

    @GET
    @Path("/skills")
    public List<TechSkill> getSkills() {
        return dataService.getSkills();
    }

    @GET
    @Path("/experiences")
    public List<WorkExperience> getExperiences() {
        return dataService.getExperiences();
    }

    @GET
    @Path("/metrics")
    public List<SystemMetric> getMetrics() {
        return dataService.getMetrics();
    }
}
