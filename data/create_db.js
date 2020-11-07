const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('./data.db');

db.serialize(() => {
    db.run(`CREATE TABLE shared_notes (id INTEGER PRIMARY KEY, val TEXT DEFAULT '');`, (err) => console.log((err) ? err : 'Success'))
});

db.close();