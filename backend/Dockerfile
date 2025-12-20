FROM gradle:8.5-jdk21 AS builder
WORKDIR /home/gradle/src

COPY --chown=gradle:gradle gradle/ gradle/
COPY --chown=gradle:gradle gradlew gradlew
COPY --chown=gradle:gradle settings.gradle.kts settings.gradle.kts
COPY --chown=gradle:gradle gradle/libs.versions.toml gradle/libs.versions.toml
COPY --chown=gradle:gradle app/build.gradle.kts app/build.gradle.kts

RUN --mount=type=cache,target=/home/gradle/.gradle \
    chmod +x gradlew && ./gradlew --no-daemon assemble -x test

COPY --chown=gradle:gradle . .

RUN --mount=type=cache,target=/home/gradle/.gradle \
    ./gradlew --no-daemon buildFatJar -x test

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /home/gradle/src/app/build/libs/app-all.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
