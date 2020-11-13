const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('./data.db');

// db.serialize(() => {
//     db.run(`CREATE TABLE shared_notes (id TEXT PRIMARY KEY, val TEXT DEFAULT '', expiry_date TEXT NOT NULL);`, (err) => console.log((err) ? err : 'Success'))
// });

// db.run(`DELETE FROM shared_notes`, (err) => {
//     if(err){
//         console.log(err);
        
//     }
//     else{
//         console.log('Success');
//     }
// });

// db.run(`INSERT INTO shared_notes (id, val, expiry_date) VALUES ('2', '{}', '07-11-2020')`, (err) => {
//     if(err){
//         console.log(err);
        
//     }
//     else{
//         console.log('Success');
//     }
// });

// db.all('SELECT * FROM shared_notes', (err, rows) => {
//     console.log(rows);
// });

db.close();