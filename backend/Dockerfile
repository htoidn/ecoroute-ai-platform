# Use Eclipse Temurin JDK 25 as base image
FROM eclipse-temurin:25-jdk

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew gradlew.bat build.gradle settings.gradle gradle.properties ./
COPY gradle/ gradle/

# Copy source code
COPY src/ src/

# Make gradlew executable
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build -x test

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "build/libs/ecoroute-ai-platform-0.0.1-SNAPSHOT.jar"]
