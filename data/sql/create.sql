CREATE TABLE 'users' (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email TEXT NOT NULL, passwd TEXT NOT NULL, json_data TEXT DEFAULT '');
INSERT INTO 'users' (email, passwd) VALUES ('felixwochnick@gmx.de', 'passwd');
