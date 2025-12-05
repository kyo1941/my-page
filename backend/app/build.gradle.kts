
val ktorVersion = "2.3.9"

plugins {
    application
    id("org.jetbrains.kotlin.jvm") version "1.9.23"
    id("org.jetbrains.kotlin.plugin.serialization") version "1.9.23"
    id("io.ktor.plugin") version "2.3.9"
}

application {
    mainClass.set("my.backend.ApplicationKt")
}

ktor {
    fatJar {
        archiveFileName.set("app-all.jar")
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Ktor Server
    implementation("io.ktor:ktor-server-core-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-netty-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktorVersion")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-cors-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-status-pages-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-request-validation:$ktorVersion")
    implementation("io.ktor:ktor-server-config-yaml:$ktorVersion")

    // Ktor Client (Turnstile認証用)
    implementation("io.ktor:ktor-client-core:$ktorVersion")
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
    implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")

    // Logging
    implementation("ch.qos.logback:logback-classic:1.4.14")

    // Resend
    implementation("com.resend:resend-java:2.1.0")

    // HTML Escaping
    implementation("org.apache.commons:commons-text:1.12.0")

    // Markdown to HTML
    implementation("com.vladsch.flexmark:flexmark-all:0.64.8")

    // SnakeYaml
    implementation("org.yaml:snakeyaml:2.5")

    // Testing
    testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation(platform("org.junit:junit-bom:5.10.2"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "21"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
