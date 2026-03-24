FROM gradle:8.5-jdk21 AS builder
WORKDIR /home/gradle/src

COPY --chown=gradle:gradle backend/gradle/ gradle/
COPY --chown=gradle:gradle backend/gradlew gradlew
COPY --chown=gradle:gradle backend/settings.gradle.kts settings.gradle.kts
COPY --chown=gradle:gradle backend/gradle/libs.versions.toml gradle/libs.versions.toml
COPY --chown=gradle:gradle backend/app/build.gradle.kts app/build.gradle.kts

RUN chmod +x gradlew && ./gradlew --no-daemon assemble -x test

COPY --chown=gradle:gradle backend/ .

# application.yaml はgitignoreされているため、テンプレートからコピーして生成する
RUN cp app/src/main/resources/application.yaml.template app/src/main/resources/application.yaml

RUN ./gradlew --no-daemon buildFatJar -x test

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /home/gradle/src/app/build/libs/app-all.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
