# Stage 1: Build Quarkus Application Fast-Jar
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy pom.xml
COPY pom.xml ./

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build fast-jar distribution
RUN mvn package -DskipTests -B

# Stage 2: Runtime Image
FROM eclipse-temurin:21-jre-alpine AS runtime

ENV LANGUAGE='en_US:en'

WORKDIR /deployments/

# Copy compiled Quarkus application files
COPY --from=build /app/target/quarkus-app/lib/ /deployments/lib/
COPY --from=build /app/target/quarkus-app/*.jar /deployments/
COPY --from=build /app/target/quarkus-app/app/ /deployments/app/
COPY --from=build /app/target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080

USER 185

ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"

ENTRYPOINT ["java", "-jar", "/deployments/quarkus-run.jar"]
