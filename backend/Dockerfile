FROM gradle:8.5-jdk21 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle buildFatJar --no-daemon

FROM openjdk:21-slim
mkdir /app
COPY --from=build /home/gradle/src/app/build/libs/app-all.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
