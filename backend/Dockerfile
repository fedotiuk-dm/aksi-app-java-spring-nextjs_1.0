# Stage 1: Build the application
FROM bellsoft/liberica-openjdk-alpine:21@sha256:5f23f8082baea518a1657b420dbe19c181483255209b70af836543d6068fed8c AS build
WORKDIR /app

# Copy maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Make the mvnw script executable and fix line endings
RUN chmod +x ./mvnw && \
    sed -i 's/\r$//' ./mvnw

# Download dependencies (cached if pom.xml didn't change)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src/ ./src/

# Build the application
RUN ./mvnw package -DskipTests -Dmaven.test.skip=true -P docker

# Stage 2: Run the application
FROM bellsoft/liberica-runtime-container:jre-21-musl@sha256:4e193e6c77614f4b924e3518bfe77b17a7266b9da837111874f603deff942d64
WORKDIR /app

# Copy checkstyle.xml
COPY checkstyle.xml /app/checkstyle.xml

# Add spring user
RUN addgroup --system spring && \
    adduser --system spring --ingroup spring

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=dev
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

# Copy the jar file from the build stage
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Use non-root user
USER spring:spring

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 