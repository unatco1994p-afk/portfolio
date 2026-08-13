package com.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.model.*;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.io.File;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.jboss.logging.Logger;

@ApplicationScoped
public class PortfolioDataService {

    private static final Logger LOG = Logger.getLogger(PortfolioDataService.class);

    @Inject ObjectMapper objectMapper;

    private final Map<String, PortfolioData> cache = new ConcurrentHashMap<>();

    @PostConstruct
    void init() {
        reloadCache();
    }

    public synchronized void reloadCache() {
        cache.clear();
        PortfolioData pl = loadDataFromFile("data/portfolio_pl.json");
        PortfolioData en = loadDataFromFile("data/portfolio_en.json");

        if (pl != null) {
            cache.put("pl", pl);
            LOG.info("Loaded Polish portfolio data into cache.");
        } else {
            LOG.warn("Failed to load Polish portfolio data (data/portfolio_pl.json).");
        }

        if (en != null) {
            cache.put("en", en);
            LOG.info("Loaded English portfolio data into cache.");
        } else {
            LOG.warn("Failed to load English portfolio data (data/portfolio_en.json).");
        }
    }

    private PortfolioData loadDataFromFile(String resourcePath) {
        // 1. Try ClassLoader
        try (InputStream is =
                Thread.currentThread().getContextClassLoader().getResourceAsStream(resourcePath)) {
            if (is != null) {
                return objectMapper.readValue(is, PortfolioData.class);
            }
        } catch (Exception e) {
            LOG.warn(
                    "Unable to load portfolio resource '"
                            + resourcePath
                            + "' via ClassLoader: "
                            + e.getMessage(),
                    e);
        }

        // 2. Try filesystem (dev mode fallback)
        try {
            File file = new File("src/main/resources/" + resourcePath);
            if (file.exists()) {
                return objectMapper.readValue(file, PortfolioData.class);
            }
        } catch (Exception e) {
            LOG.warn(
                    "Unable to load portfolio resource '"
                            + resourcePath
                            + "' via filesystem fallback: "
                            + e.getMessage(),
                    e);
        }

        LOG.warn(
                "Portfolio data resource '"
                        + resourcePath
                        + "' could not be found in ClassLoader or filesystem.");
        return null;
    }

    public PortfolioData getPortfolioData(String lang) {
        boolean isPl =
                "pl".equalsIgnoreCase(lang)
                        || (lang != null && lang.toLowerCase().startsWith("pl"));
        String primaryKey = isPl ? "pl" : "en";
        String fallbackKey = isPl ? "en" : "pl";

        PortfolioData data = cache.get(primaryKey);
        if (data == null) {
            LOG.warn(
                    "Portfolio data for language '"
                            + primaryKey
                            + "' not found in cache. Falling back to '"
                            + fallbackKey
                            + "'.");
            data = cache.get(fallbackKey);
        }
        return data != null ? data : new PortfolioData();
    }

    public UserProfile getProfile(String lang) {
        PortfolioData data = getPortfolioData(lang);
        return data.profile();
    }

    public List<Project> getProjects(String lang) {
        PortfolioData data = getPortfolioData(lang);
        return data.projects() != null ? data.projects() : Collections.emptyList();
    }

    public List<TechSkill> getSkills(String lang) {
        PortfolioData data = getPortfolioData(lang);
        return data.skills() != null ? data.skills() : Collections.emptyList();
    }

    public List<WorkExperience> getExperiences(String lang) {
        PortfolioData data = getPortfolioData(lang);
        return data.experiences() != null ? data.experiences() : Collections.emptyList();
    }

    public List<Education> getEducation(String lang) {
        PortfolioData data = getPortfolioData(lang);
        return data.education() != null ? data.education() : Collections.emptyList();
    }

    public List<SystemMetric> getMetrics(String lang) {
        PortfolioData data = getPortfolioData(lang);
        return data.metrics() != null ? data.metrics() : Collections.emptyList();
    }
}
