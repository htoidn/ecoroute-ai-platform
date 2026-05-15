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

-- Recommendations
INSERT INTO recommendations
(user_id, destination_id, ai_score, reason)
VALUES
    (1,14,96,'High sustainability and cycling'),
    (2,1,88,'Urban lifestyle match'),
    (3,9,92,'Historic eco destination'),
    (4,10,95,'Quiet and low crowd'),
    (5,3,80,'Luxury travel match'),
    (6,15,93,'Nature and cold climate'),
    (7,5,84,'Modern urban fit'),
    (8,18,97,'Top cycling city'),
    (9,16,94,'Quiet eco atmosphere'),
    (10,8,89,'Affordable creative city'),
    (11,4,86,'Historic urban vibe'),
    (12,12,91,'Relaxed green environment'),
    (13,3,79,'Luxury clean city'),
    (14,14,98,'Strong eco score'),
    (15,20,90,'Scenic sustainable location'),
    (16,17,87,'Nature and calmness'),
    (17,2,82,'Coastal city experience'),
    (18,19,93,'Green smart city'),
    (19,14,99,'Best sustainability score'),
    (20,5,85,'Modern transportation');

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
