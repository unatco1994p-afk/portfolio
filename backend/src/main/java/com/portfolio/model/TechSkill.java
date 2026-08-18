package com.portfolio.model;

import java.util.List;

public record TechSkill(
        String id,
        String name,
        String category,
        String experience,
        String icon,
        List<String> highlights,
        SkillCertification certification) {}
