package com.portfolio.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class PortfolioResourceTest {

    @Test
    public void testGetPortfolioEndpoint() {
        given()
          .when().get("/api/portfolio")
          .then()
             .statusCode(200)
             .body("profile.name", is("Partial Derivative"))
             .body("projects", notNullValue())
             .body("skills", notNullValue());
    }

    @Test
    public void testGetProfileEndpoint() {
        given()
          .when().get("/api/profile")
          .then()
             .statusCode(200)
             .body("name", is("Partial Derivative"))
             .body("title", notNullValue());
    }

    @Test
    public void testGetProjectsEndpoint() {
        given()
          .when().get("/api/projects")
          .then()
             .statusCode(200)
             .body("size()", is(3));
    }
}
