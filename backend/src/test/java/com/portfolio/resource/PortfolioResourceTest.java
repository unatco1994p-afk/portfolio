package com.portfolio.resource;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

@QuarkusTest
public class PortfolioResourceTest {

    @Test
    public void testGetPortfolioEndpoint() {
        given().when()
                .get("/api/portfolio")
                .then()
                .statusCode(200)
                .body("profile.name", is("Tomasz Zwierzyński"))
                .body("projects", notNullValue())
                .body("skills", notNullValue())
                .body("education", notNullValue());
    }

    @Test
    public void testGetProfileEndpointLanguage() {
        given().queryParam("lang", "en")
                .when()
                .get("/api/profile")
                .then()
                .statusCode(200)
                .body("name", is("Tomasz Zwierzyński"))
                .body("title", is("Senior Software Engineer"));

        given().queryParam("lang", "pl")
                .when()
                .get("/api/profile")
                .then()
                .statusCode(200)
                .body("name", is("Tomasz Zwierzyński"))
                .body("title", is("Senior Software Engineer"));
    }

    @Test
    public void testGetEducationEndpoint() {
        given().when().get("/api/education").then().statusCode(200).body("size()", is(2));
    }

    @Test
    public void testGetCertificationsEndpoint() {
        given().when()
                .get("/api/certifications")
                .then()
                .statusCode(200)
                .body("size()", is(1))
                .body("[0].name", is("Google Cloud Certified - Associate Cloud Engineer"));
    }
}
