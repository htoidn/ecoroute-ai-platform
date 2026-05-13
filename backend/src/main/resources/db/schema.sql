-- DESTINATIONS
CREATE TABLE IF NOT EXISTS destinations
(
    id                     BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                   VARCHAR(255)     NOT NULL,
    country                VARCHAR(255)     NOT NULL,
    sustainability_score   DOUBLE PRECISION NOT NULL,
    cost_index             DOUBLE PRECISION NOT NULL,
    crowd_index            DOUBLE PRECISION NOT NULL,
    co2_per_trip           DOUBLE PRECISION,
    public_transport_score DOUBLE PRECISION,
    avg_temp               DOUBLE PRECISION,
    best_season            VARCHAR(255),
    tags                   CLOB,
    description            CLOB,
    latitude               DOUBLE PRECISION,
    longitude              DOUBLE PRECISION,
    image_url              CLOB,
    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- USERS
CREATE TABLE IF NOT EXISTS users
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    username          VARCHAR(255) UNIQUE NOT NULL,
    email             VARCHAR(255) UNIQUE NOT NULL,
    password          VARCHAR(255)        NOT NULL,
    role              VARCHAR(50) DEFAULT 'USER',
    preferred_budget  DOUBLE PRECISION,
    preferred_climate VARCHAR(255),
    created_at        TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);


-- USER PREFERENCES
CREATE TABLE IF NOT EXISTS user_preferences
(
    id                       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id                  BIGINT REFERENCES users (id) ON DELETE CASCADE,
    prefers_low_co2          BOOLEAN   DEFAULT TRUE,
    prefers_public_transport BOOLEAN   DEFAULT TRUE,
    prefers_quiet_places     BOOLEAN   DEFAULT FALSE,
    preferred_tags           CLOB,
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT REFERENCES users (id),
    destination_id BIGINT REFERENCES destinations (id),
    rating         INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment        CLOB,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- AI RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS recommendations
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT REFERENCES users (id),
    destination_id BIGINT REFERENCES destinations (id),
    ai_score       DOUBLE PRECISION,
    reason         CLOB,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- FAVORITES / SAVED DESTINATIONS
CREATE TABLE IF NOT EXISTS favorites
(
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT REFERENCES users (id)
        ON DELETE CASCADE,
    destination_id BIGINT REFERENCES destinations (id)
        ON DELETE CASCADE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- INDEXES
CREATE INDEX idx_destination_country
    ON destinations (country);

CREATE INDEX idx_destination_sustainability
    ON destinations (sustainability_score);
