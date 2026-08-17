package com.portfolio.resource;

import com.portfolio.model.*;
import com.portfolio.service.PortfolioDataService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
public class PortfolioResource {

    @Inject PortfolioDataService dataService;

    private String resolveLang(String queryLang, String acceptLang) {
        if (queryLang != null && !queryLang.isBlank()) {
            return queryLang;
        }
        if (acceptLang != null && !acceptLang.isBlank()) {
            return acceptLang;
        }
        return "pl";
    }

    @GET
    @Path("/portfolio")
    public PortfolioData getPortfolio(
            @QueryParam("lang") String lang,
            @HeaderParam("Accept-Language") String acceptLanguage) {
        return dataService.getPortfolioData(resolveLang(lang, acceptLanguage));
    }

    @GET
    @Path("/profile")
    public UserProfile getProfile(
            @QueryParam("lang") String lang,
            @HeaderParam("Accept-Language") String acceptLanguage) {
        return dataService.getProfile(resolveLang(lang, acceptLanguage));
    }

    @GET
    @Path("/projects")
    public List<Project> getProjects(
            @QueryParam("lang") String lang,
            @HeaderParam("Accept-Language") String acceptLanguage) {
        return dataService.getProjects(resolveLang(lang, acceptLanguage));
    }

    @GET
    @Path("/skills")
    public List<TechSkill> getSkills(
            @QueryParam("lang") String lang,
            @HeaderParam("Accept-Language") String acceptLanguage) {
        return dataService.getSkills(resolveLang(lang, acceptLanguage));
    }

    @GET
    @Path("/experiences")
    public List<WorkExperience> getExperiences(
            @QueryParam("lang") String lang,
            @HeaderParam("Accept-Language") String acceptLanguage) {
        return dataService.getExperiences(resolveLang(lang, acceptLanguage));
    }

    @GET
    @Path("/education")
    public List<Education> getEducation(
            @QueryParam("lang") String lang,
            @HeaderParam("Accept-Language") String acceptLanguage) {
        return dataService.getEducation(resolveLang(lang, acceptLanguage));
    }

    @GET
    @Path("/metrics")
    public List<SystemMetric> getMetrics(
            @QueryParam("lang") String lang,
            @HeaderParam("Accept-Language") String acceptLanguage) {
        return dataService.getMetrics(resolveLang(lang, acceptLanguage));
    }

    @GET
    @Path("/certifications")
    public List<Certification> getCertifications(
            @QueryParam("lang") String lang,
            @HeaderParam("Accept-Language") String acceptLanguage) {
        return dataService.getCertifications(resolveLang(lang, acceptLanguage));
    }
}
