CREATE TABLE IF NOT EXISTS destinations
(
    id                     BIGSERIAL PRIMARY KEY,

    name                   VARCHAR(255)     NOT NULL,
    country                VARCHAR(100)     NOT NULL,

    sustainability_score   DOUBLE PRECISION NOT NULL,
    cost_index             DOUBLE PRECISION NOT NULL,
    crowd_index            DOUBLE PRECISION NOT NULL,

    co2_per_trip           DOUBLE PRECISION,
    public_transport_score DOUBLE PRECISION,
    avg_temp               DOUBLE PRECISION,

    best_season            VARCHAR(50),

    tags                   TEXT,

    description            TEXT,

    latitude               DOUBLE PRECISION,
    longitude              DOUBLE PRECISION,

    image_url              TEXT,

    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_destination_country
    ON destinations (country);

CREATE INDEX idx_destination_sustainability
    ON destinations (sustainability_score);

CREATE INDEX idx_destination_tags
    ON destinations USING gin (to_tsvector('english', tags));