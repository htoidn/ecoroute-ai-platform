CREATE TABLE IF NOT EXISTS destinations (
                                            id SERIAL PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,

    sustainability_score DOUBLE PRECISION,
    cost_index DOUBLE PRECISION,
    crowd_index DOUBLE PRECISION,

    co2_per_trip DOUBLE PRECISION,
    public_transport_score DOUBLE PRECISION,
    avg_temp DOUBLE PRECISION,
    best_season VARCHAR(50),

    tags TEXT,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );