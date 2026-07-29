package com.portfolio.model;

public class UserProfile {
    private String name;
    private String title;
    private String avatarUrl;
    private String status;
    private String bio;
    private String location;
    private String email;
    private String githubUrl;
    private String linkedinUrl;

    public UserProfile() {}

    public UserProfile(String name, String title, String avatarUrl, String status, String bio, String location, String email, String githubUrl, String linkedinUrl) {
        this.name = name;
        this.title = title;
        this.avatarUrl = avatarUrl;
        this.status = status;
        this.bio = bio;
        this.location = location;
        this.email = email;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
}
