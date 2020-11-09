const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3').verbose();
const {v4: uuidv4} = require('uuid');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({limit: '1mb'}));

// static
app.use('/sources', express.static(__dirname + '/sources'));

// view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// +-------+
// |  GET  |
// +-------+

app.get('/', (req, res) => res.render('index.ejs', {version: require('./package.json').version}));

app.get('/shared', (req, res) => res.render('shared.ejs', {version: require('./package.json').version}));

// +--------+
// |  POST  |
// +--------+

app.post('/api/note/share', (req, res) => {
    let note = req.body.note;
    let uuid = uuidv4();
    let expiry_date = new Date();
    expiry_date.setDate(expiry_date.getDate() + 1);
    expiry_date = `${expiry_date.getDate()}-${expiry_date.getMonth() + 7}-${expiry_date.getFullYear()}`;
    let db = new sqlite.Database('./data/data.db', sqlite.OPEN_READWRITE);

    db.serialize(() => {
        db.run(`INSERT INTO "shared_notes" ("id", "val", "expiry_date") VALUES (?, ?, ?);`, [uuid.toString(), JSON.stringify(note), expiry_date], (err) => {
            if(err){
                res.json({status: 'failed'})
            }
            else{
                res.json({status: 'success', id: uuid});
            }
        });
    });

    db.close();
});

app.post('/api/note/get', (req, res) => {
    let id = req.body.id;

    let db = new sqlite.Database('./data/data.db');

    db.get(`SELECT * FROM shared_notes WHERE id=?;`, [id], (err, row) => {
        if (err) {console.log(err); res.json({status: "failed"}); return;}
        let note = JSON.parse(row.val);
        note.id = 0;
        res.json({status: "success", note});
    });

    db.close();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));