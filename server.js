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

app.get('/shared', (req, res) => {
    let id = req.query.id;
    let db = new sqlite.Database('./data/data.db');
    db.run(`SELECT val FROM shared_notes WHERE id=${id};`, (err) => {
        if (err) {console.log(err); return;}

        console.log(this);

        let note = {};
        res.render('shared.ejs', {version: require('./package.json').version, note});
    });
});

// +--------+
// |  POST  |
// +--------+

app.post('/share', (req, res) => {
    let note = req.body.note;
    let uuid = uuidv4();
    let expiry_date = ''; // TODO: generate expiry date
    let db = new sqlite.Database('./data/data.db', sqlite.OPEN_READWRITE);

    db.serialize(() => {
        db.run(`INSERT INTO shared_notes (id, val, expiry_date) VALUES (${uuid}, ${note}, ${expiry_date})`, (err) => {
            if(err){
                res.json({status: 'failed'})
                db.close();
                return;
            }

            res.json({status: 'success', id: uuid})

            db.close();
        })
    })

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));