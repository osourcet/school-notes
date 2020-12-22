// Setup Script to install the server

const fs = require('fs');
const sqlite3 = require('sqlite3');
const logSymbols = require('log-symbols');

if (!fs.existsSync('./data/')){
    // Create directory
    try {
        fs.mkdirSync('./data/')
        console.log(logSymbols.success ,'FS <- Directory created: "data"');
    }
    catch(err){
        console.log(err);
    }
    

    // Create Database with tables: shared_notes, users
    let db = new sqlite3.Database('./data/data.db');

    db.serialize(() => {
        db.run(`CREATE TABLE shared_notes (id TEXT PRIMARY KEY, val TEXT DEFAULT '', expiry_date TEXT NOT NULL);`, (err) => {if(err){logSymbols.error, console.log(err); } else { console.log(logSymbols.success ,'DB <- Table created: "shared_notes"')}});
        db.run(`CREATE TABLE 'users' (id TEXT PRIMARY KEY NOT NULL, username TEXT NOT NULL, passwd TEXT NOT NULL, email TEXT DEFAULT '', json_notes TEXT DEFAULT '{}', json_notes_update TEXT DEFAULT '', json_settings TEXT DEFAULT '{}', json_settings_update TEXT DEFAULT '');`, (err) => {if(err){logSymbols.error, console.log(err); } else { console.log(logSymbols.success ,'DB <- Table created: "users"')}});
    });

    db.close();

    // Create confing.json
    try {
        fs.writeFileSync('./data/config.json', JSON.stringify({'token-secret': require('crypto').randomBytes(64).toString('hex')}));
        console.log(logSymbols.success, 'FS <- File created: "config.json"');
    }
    catch (err){
        console.log(logSymbols.error, err);
    }
}
else{
    console.log(logSymbols.error, 'FS <- Directory already exists');
}