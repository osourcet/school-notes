// Setup Script to install the server

const fs = require('fs');
const sqlite3 = require('sqlite3');

if (!fs.existsSync('./data/')){
    // Create directory
    fs.mkdirSync('./data/')

    // Create Database with tables: shared_notes, users
    let db = new sqlite3.Database('./data/data.db');

    db.serialize(() => {
        db.run(`CREATE TABLE shared_notes (id TEXT PRIMARY KEY, val TEXT DEFAULT '', expiry_date TEXT NOT NULL);`, (err) => console.log((err) ? err : 'Success'));
        db.run(`CREATE TABLE 'users' (id TEXT PRIMARY KEY NOT NULL, username TEXT NOT NULL, passwd TEXT NOT NULL, email TEXT DEFAULT '', json_notes TEXT DEFAULT '{}', json_notes_update TEXT DEFAULT '', json_settings TEXT DEFAULT '{}', json_settings_update TEXT DEFAULT '');`, (err) => console.log((err) ? err : 'Success'));
    });

    db.close();

    // Create confing.json
    fs.writeFileSync('./data/config.json', JSON.stringify({'token-secret': require('crypto').randomBytes(64).toString('hex')}));
}