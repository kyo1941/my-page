plugins {
    application
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ktor)
    alias(libs.plugins.ktlint)
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
    // Ktor BOM
    implementation(platform("io.ktor:ktor-bom:${libs.versions.ktor.get()}"))

    // Koin BOM
    implementation(platform("io.insert-koin:koin-bom:${libs.versions.koin.get()}"))

    // Database (MySQL & Connection Pool)
    implementation(libs.mysql.connector)
    implementation(libs.hikaricp)

    // ORM (Exposed)
    implementation(libs.bundles.exposed)

    // Flyway
    implementation(libs.flyway.core)
    implementation(libs.flyway.mysql)

    // NanoID
    implementation(libs.jnanoid)

    // Ktor Server
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm")
    implementation("io.ktor:ktor-server-cors-jvm")
    implementation("io.ktor:ktor-server-status-pages-jvm")
    implementation("io.ktor:ktor-server-request-validation")
    implementation("io.ktor:ktor-server-config-yaml")
    implementation("io.ktor:ktor-server-auth")
    implementation("io.ktor:ktor-server-auth-jwt")

    // Ktor Client (Turnstile認証用)
    implementation("io.ktor:ktor-client-core")
    implementation("io.ktor:ktor-client-cio")
    implementation("io.ktor:ktor-client-content-negotiation")

    // Koin
    implementation("io.insert-koin:koin-ktor")
    implementation("io.insert-koin:koin-logger-slf4j")

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

    // BCrypt
    implementation(libs.jbcrypt)

    // Testing
    testImplementation(libs.h2)
    testImplementation("io.ktor:ktor-server-test-host")
    testImplementation("io.ktor:ktor-client-mock")
    testImplementation("io.insert-koin:koin-test")
    testImplementation("io.insert-koin:koin-test-junit5")
    testImplementation("io.mockk:mockk:1.13.10")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation(platform("org.junit:junit-bom:5.10.2"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

tasks.named<Test>("test") {
    environment("ADMIN_USERNAME", "admin")
    environment("ADMIN_PASSWORD", "password")
    useJUnitPlatform()
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

tasks.withType<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar> {
    mergeServiceFiles()
}

tasks.withType<Test> {
    useJUnitPlatform()
}
