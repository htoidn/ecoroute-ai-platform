-- This file should be executed by a database administrator or superuser
-- It creates the destinations table and inserts sample data

CREATE TABLE IF NOT EXISTS destinations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    sustainability_score DOUBLE PRECISION,
    cost_index DOUBLE PRECISION,
    crowd_index DOUBLE PRECISION,
    co2_per_trip DOUBLE PRECISION,
    public_transport_score DOUBLE PRECISION,
    avg_temp DOUBLE PRECISION,
    best_season VARCHAR(50),
    tags VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions to the application user
GRANT SELECT, INSERT, UPDATE, DELETE ON destinations TO ecoroute_hdnh;
GRANT USAGE, SELECT ON SEQUENCE destinations_id_seq TO ecoroute_hdnh;

-- Insert sample data
INSERT INTO destinations (name, country, sustainability_score, cost_index, crowd_index, co2_per_trip, public_transport_score, avg_temp, best_season, tags, description)
VALUES
    ('Berlin','Germany',85,70,85,120,92,10,'Spring','urban,culture,public-transport','Capital city with excellent transport and vibrant culture'),
    ('Hamburg','Germany',88,75,70,110,90,9,'Summer','harbor,green,water','Green port city with waterways and sustainability focus'),
    ('Munich','Germany',87,90,80,140,88,9,'Summer','luxury,clean,urban','Modern clean city with high quality of life'),
    ('Cologne','Germany',83,65,85,130,85,10,'Spring','culture,cathedral,urban','Historic cathedral city with vibrant urban life'),
    ('Frankfurt','Germany',82,88,75,135,93,11,'Spring','finance,modern,transport','Financial hub with top transport infrastructure'),
    ('Stuttgart','Germany',86,78,70,125,84,10,'Summer','automotive,green,hills','Hilly city with strong green initiatives'),
    ('Düsseldorf','Germany',84,80,65,120,87,11,'Spring','fashion,urban,clean','Stylish city with clean environment'),
    ('Leipzig','Germany',90,55,60,95,82,9,'Spring','art,cheap,green','Affordable creative city with growing eco scene'),
    ('Dresden','Germany',89,60,65,100,80,9,'Spring','heritage,architecture,culture','Beautiful historic architecture and culture'),
    ('Hannover','Germany',87,65,55,98,83,9,'Spring','green,parks,calm','Relaxed city with many parks'),
    ('Nuremberg','Germany',88,60,60,105,82,9,'Spring','history,walkable,eco','Walkable historic eco-friendly city'),
    ('Bremen','Germany',86,58,55,95,85,9,'Summer','historic,quiet,cycling','Quiet cycling-friendly historic town'),
    ('Essen','Germany',91,55,50,90,88,10,'Spring','green-transformation,eco','Former industrial hub turned green city'),
    ('Freiburg','Germany',95,60,40,80,96,11,'Spring','solar,eco,cycling','Germany''s greenest solar-powered city'),
    ('Heidelberg','Germany',92,70,65,100,87,11,'Spring','romantic,walkable,green','Romantic university city with green spaces'),
    ('Augsburg','Germany',89,62,55,98,83,10,'Summer','historic,water,eco','Historic city with sustainable water systems'),
    ('Wiesbaden','Germany',87,75,50,105,80,11,'Summer','spa,quiet,green','Spa city with relaxed environment'),
    ('Münster','Germany',94,58,45,85,95,10,'Spring','cycling,eco,student','Top cycling city with strong sustainability'),
    ('Karlsruhe','Germany',90,65,55,100,85,11,'Summer','tech,planned-city,green','Planned tech city with green design'),
    ('Bonn','Germany',91,68,50,95,88,10,'Spring','green,calm,political','Calm former capital with green focus'),
    ('Mainz','Germany',88,63,55,98,82,11,'Summer','wine,walkable,eco','Walkable wine city with eco lifestyle'),
    ('Kiel','Germany',87,60,50,90,85,9,'Summer','coastal,wind,green','Coastal city with wind energy focus'),
    ('Rostock','Germany',89,55,45,85,80,9,'Summer','coast,quiet,nature','Quiet coastal city with nature access'),
    ('Erfurt','Germany',90,58,50,92,82,9,'Spring','historic,calm,eco','Historic calm eco-friendly city'),
    ('Magdeburg','Germany',88,52,45,90,78,9,'Spring','modern,cheap,green','Affordable modern green city'),
    ('Potsdam','Germany',93,70,60,100,90,10,'Spring','palaces,green,heritage','Green city with historic palaces'),
    ('Regensburg','Germany',91,65,55,95,85,10,'Spring','medieval,walkable,eco','Medieval eco-friendly city'),
    ('Passau','Germany',92,60,45,85,82,10,'Summer','rivers,quiet,scenic','Scenic riverside quiet town'),
    ('Ulm','Germany',90,63,50,95,84,10,'Spring','historic,clean,green','Clean city with historic charm'),
    ('Tübingen','Germany',94,55,40,80,93,10,'Spring','student,eco,walkable','Student city with strong eco culture'),
    ('Jena','Germany',91,57,50,90,86,10,'Spring','tech,green,young','Young tech city with green spaces'),
    ('Weimar','Germany',92,58,45,88,82,10,'Spring','culture,heritage,calm','Cultural heritage city with calm vibe'),
    ('Saarbrücken','Germany',85,55,50,95,78,11,'Summer','border,relaxed,cheap','Relaxed border city with low cost'),
    ('Flensburg','Germany',89,60,40,85,80,9,'Summer','coastal,quiet,eco','Quiet coastal eco-friendly city'),
    ('Cottbus','Germany',87,50,40,90,75,10,'Spring','nature,cheap,calm','Affordable city close to nature'),
    ('Görlitz','Germany',91,52,35,85,78,10,'Spring','historic,film,quiet','Beautiful historic film city'),
    ('Bayreuth','Germany',88,60,45,95,80,10,'Summer','music,culture,calm','Music festival city with calm lifestyle'),
    ('Bamberg','Germany',93,65,50,90,85,10,'Spring','unesco,walkable,eco','UNESCO heritage eco city'),
    ('Lübeck','Germany',92,67,55,95,83,10,'Summer','unesco,coastal,history','Historic coastal UNESCO city'),
    ('Schwerin','Germany',90,55,40,85,80,9,'Summer','castle,quiet,green','Quiet city with castle and lakes')
ON CONFLICT DO NOTHING;

