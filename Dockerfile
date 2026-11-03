# BUILD DEL FRONTEND
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build


# BUILD DEL BACKEND
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

COPY backend/pom.xml .

COPY backend/src ./src

COPY --from=frontend-build /frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests


# IMAGEN FINAL
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar


EXPOSE 8000

ENTRYPOINT ["java", "-jar", "app.jar"]