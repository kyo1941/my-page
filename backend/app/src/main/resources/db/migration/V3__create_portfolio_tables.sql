CREATE TABLE portfolio_tag_names (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT uk_portfolio_tag_names_name UNIQUE (name)
);

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

CREATE TABLE portfolio_tags (
    portfolio_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (portfolio_id, tag_id),
    CONSTRAINT fk_portfolio_tags_portfolio_id FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_portfolio_tags_tag_id FOREIGN KEY (tag_id) REFERENCES portfolio_tag_names(id) ON DELETE CASCADE ON UPDATE CASCADE
);
