CREATE TABLE portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(255) NULL,
    date DATETIME NOT NULL,
    CONSTRAINT uk_portfolios_slug UNIQUE (slug)
);
