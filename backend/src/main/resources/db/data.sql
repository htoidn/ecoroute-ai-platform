INSERT INTO destinations (name, country, sustainability_score, cost_index, crowd_index, co2_per_trip, public_transport_score, avg_temp, best_season,
 tags, description)
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
    ('Freiburg','Germany',95,60,40,80,96,11,'Spring','solar,eco,cycling','Germany’s greenest solar-powered city'),
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
    ('Schwerin','Germany',90,55,40,85,80,9,'Summer','castle,quiet,green','Quiet city with castle and lakes');

-- User data
INSERT INTO users
(username, email, password, role, preferred_budget, preferred_climate)
VALUES
    ('alex','alice@mail.com','$2a$10$hash','USER',70,'cool'),
    ('byan','bob@mail.com','$2a$10$hash','USER',60,'warm'),
    ('cherry','charlie@mail.com','$2a$10$hash','USER',80,'mild'),
    ('denis','diana@mail.com','$2a$10$hash','USER',50,'cool'),
    ('eric','eric@mail.com','$2a$10$hash','USER',90,'warm'),
    ('fiona','fiona@mail.com','$2a$10$hash','USER',55,'cold'),
    ('george','george@mail.com','$2a$10$hash','USER',65,'mild'),
    ('hannah','hannah@mail.com','$2a$10$hash','USER',70,'warm'),
    ('ivan','ivan@mail.com','$2a$10$hash','USER',45,'cold'),
    ('julia','julia@mail.com','$2a$10$hash','USER',75,'mild'),
    ('kevin','kevin@mail.com','$2a$10$hash','USER',60,'warm'),
    ('laura','laura@mail.com','$2a$10$hash','USER',68,'cool'),
    ('mike','mike@mail.com','$2a$10$hash','USER',72,'warm'),
    ('nina','nina@mail.com','$2a$10$hash','USER',58,'mild'),
    ('oliver','oliver@mail.com','$2a$10$hash','USER',82,'cool'),
    ('pauline','paula@mail.com','$2a$10$hash','USER',49,'cold'),
    ('querin','quentin@mail.com','$2a$10$hash','USER',65,'warm'),
    ('richard','rachel@mail.com','$2a$10$hash','USER',78,'mild'),
    ('sam','sam@mail.com','$2a$10$hash','USER',53,'cool'),
    ('tina','tina@mail.com','$2a$10$hash','USER',67,'warm');

-- User preferences
INSERT INTO user_preferences
(user_id, prefers_low_co2, prefers_public_transport,
 prefers_quiet_places, preferred_tags)
VALUES
    (1,true,true,true,'eco,cycling'),
    (2,true,false,false,'urban,nightlife'),
    (3,true,true,false,'culture,architecture'),
    (4,true,true,true,'quiet,nature'),
    (5,false,true,false,'luxury,shopping'),
    (6,true,true,true,'cold,nature'),
    (7,true,false,false,'food,urban'),
    (8,true,true,false,'cycling,green'),
    (9,true,true,true,'calm,eco'),
    (10,true,false,false,'culture,history'),
    (11,true,true,false,'modern,urban'),
    (12,true,true,true,'walkable,quiet'),
    (13,false,false,false,'luxury,resort'),
    (14,true,true,true,'eco,student'),
    (15,true,true,false,'mountains,green'),
    (16,true,true,true,'nature,lakes'),
    (17,true,false,false,'beach,summer'),
    (18,true,true,false,'historic,walkable'),
    (19,true,true,true,'solar,eco'),
    (20,true,false,false,'shopping,city');

-- Recommendations with AI Analysis - Diverse User and Destination Combinations
INSERT INTO recommendations
(user_id, destination_id, ai_score, reason)
VALUES
    -- User 1: Eco-conscious, low CO2, public transport lover
    (1,14,96,'Excellent sustainability score (95); Outstanding public transportation network'),
    (1,18,95,'Top cycling infrastructure; Low carbon footprint travel'),
    (1,22,94,'Strong eco-friendly profile matches interests; Excellent for cycling'),
    (1,40,92,'Perfect for cycling and walking; Outstanding public transportation'),
    (1,17,90,'Great for travelers seeking value and sustainability; Excellent for cycling'),

    -- User 2: Urban lifestyle, nightlife enthusiast
    (2,1,88,'Urban lifestyle match; Outstanding public transportation network'),
    (2,5,86,'Modern urban fit; Financial hub with vibrant culture'),
    (2,3,85,'Luxury clean city; Great urban experience'),

    -- User 3: Culture and history enthusiast
    (3,9,92,'Rich cultural and historic heritage; Perfect for cultural enthusiasts'),
    (3,41,91,'UNESCO heritage city beautifully designed'),
    (3,39,89,'Beautiful historic film city atmosphere'),
    (3,8,88,'Affordable creative city with rich history'),

    -- User 4: Quiet nature lover, low crowds
    (4,10,95,'Quiet destination with fewer crowds; Outstanding nature access'),
    (4,32,93,'Quiet coastal eco-friendly city'),
    (4,27,91,'Scenic riverside quiet town'),

    -- User 5: Luxury traveler, high budget
    (5,3,80,'Luxury travel and high quality of life'),
    (5,6,82,'Automotive hub with luxury facilities'),
    (5,5,81,'Modern financial hub with luxury services'),

    -- User 6: Cold climate, nature enthusiast
    (6,15,93,'Nature and cold climate; Excellent for eco travelers'),
    (6,11,91,'Walkable historic eco-friendly city'),
    (6,37,89,'Quiet coastal eco-friendly destination'),

    -- User 7: Food and urban culture
    (7,5,84,'Modern urban fit; Finance hub with dining'),
    (7,4,82,'Historic urban vibe; Great food culture'),
    (7,25,81,'Wine city with walkable dining areas'),

    -- User 8: Cycling enthusiast, eco-conscious
    (8,18,97,'Top cycling city; Excellent for cycling and walking'),
    (8,22,96,'Exceptional cycling infrastructure'),
    (8,40,94,'Perfect for cycling and walking'),
    (8,14,92,'High sustainability and cycling'),

    -- User 9: Calm, peaceful, eco-lover
    (9,16,94,'Quiet eco atmosphere; Outstanding nature access'),
    (9,33,91,'Historic calm eco-friendly destination'),
    (9,27,90,'Scenic riverside quiet town'),

    -- User 10: Culture and history buff
    (10,8,89,'Affordable creative city; Rich cultural heritage'),
    (10,41,88,'UNESCO heritage eco-friendly city'),
    (10,33,87,'Historic calm eco-friendly destination'),

    -- User 11: Modern urban seeker
    (11,4,86,'Historic urban vibe; Modern infrastructure'),
    (11,5,85,'Modern transportation infrastructure'),
    (11,1,84,'Urban lifestyle with modern amenities'),

    -- User 12: Walkable, quiet places
    (12,12,91,'Relaxed green environment; Perfect for peaceful getaway'),
    (12,34,90,'Top cycling city; Quiet destination'),
    (12,27,89,'Scenic riverside quiet town'),

    -- User 13: Luxury resort seeker
    (13,3,79,'Luxury travel with high quality'),
    (13,6,78,'Luxury automotive city'),
    (13,5,77,'Modern luxury finance hub'),

    -- User 14: Eco-conscious superuser
    (14,14,98,'Exceptional eco score; Cycling infrastructure'),
    (14,18,97,'Top cycling city; Green infrastructure'),
    (14,22,96,'Strong eco-friendly profile'),

    -- User 15: Mountains and green spaces
    (15,20,90,'Scenic sustainable location; Green spaces'),
    (15,14,89,'Sustainability and nature access'),
    (15,15,88,'Romantic green destination'),

    -- User 16: Nature and lakes lover
    (16,17,87,'Nature and calmness; Quiet destination'),
    (16,31,86,'Scenic riverside destination'),
    (16,27,85,'Scenic riverside quiet town'),

    -- User 17: Beach and summer vibes
    (17,2,82,'Coastal city experience; Harbor charm'),
    (17,43,81,'Quiet coastal eco-friendly city'),
    (17,32,80,'Scenic riverside coastal destination'),

    -- User 18: Historic walkable cities
    (18,19,93,'Green smart city; Historic charm'),
    (18,41,92,'UNESCO heritage walkable city'),
    (18,33,90,'Historic calm city'),

    -- User 19: Solar and eco innovations
    (19,14,99,'Best sustainability and solar score'),
    (19,18,98,'Top cycling; Exceptional eco credentials'),
    (19,22,96,'Exception eco-friendly city'),

    -- User 20: Shopping and urban centers
    (20,5,85,'Modern transportation; Shopping districts'),
    (20,7,84,'Stylish city with fashion'),
    (20,4,83,'Historic urban shopping');

-- Favorites
INSERT INTO favorites
(user_id, destination_id)
VALUES
    (1,14),
    (2,1),
    (3,9),
    (4,10),
    (5,3),
    (6,15),
    (7,5),
    (8,18),
    (9,16),
    (10,8),
    (11,4),
    (12,12),
    (13,3),
    (14,14),
    (15,20),
    (16,17),
    (17,2),
    (18,19),
    (19,14),
    (20,5);

-- App User data for authentication
INSERT INTO app_user
(email, username, password, preferences, role, active, created_at)
VALUES
    ('alice@example.com','alice','$2a$10$hash','eco-friendly destinations','USER',true,CURRENT_TIMESTAMP),
    ('bob@example.com','bob','$2a$10$hash','urban adventures','USER',true,CURRENT_TIMESTAMP),
    ('charlie@example.com','charlie','$2a$10$hash','cultural experiences','USER',true,CURRENT_TIMESTAMP),
    ('diana@example.com','diana','$2a$10$hash','nature and quiet places','USER',true,CURRENT_TIMESTAMP),
    ('eric@example.com','eric','$2a$10$hash','luxury travel','USER',true,CURRENT_TIMESTAMP);
