
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
    // Ktor BOM (Bill of Materials) - バージョンを一元管理
    implementation(platform("io.ktor:ktor-bom:$ktorVersion"))

    // Ktor Server
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm")
    implementation("io.ktor:ktor-server-cors-jvm")
    implementation("io.ktor:ktor-server-status-pages-jvm")
    implementation("io.ktor:ktor-server-request-validation")
    implementation("io.ktor:ktor-server-config-yaml")

    // Ktor Client (Turnstile認証用)
    implementation("io.ktor:ktor-client-core")
    implementation("io.ktor:ktor-client-cio")
    implementation("io.ktor:ktor-client-content-negotiation")

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
    testImplementation("io.ktor:ktor-server-test-host")
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
