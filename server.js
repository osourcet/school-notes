const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sqlite = require('sqlite3').verbose();
const {v4: uuidv4} = require('uuid');
const schedule = require('node-schedule');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json({limit: '1mb'}));

// static
app.use('/sources', express.static(__dirname + '/sources'));

// view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// +-------+
// |  GET  |
// +-------+

app.get('/', (req, res) => {
    res.render('index.ejs', {version: require('./package.json').version})
});

app.get('/shared', (req, res) => {res.render('shared.ejs', {version: require('./package.json').version})});

app.get('/login', auth_token, (req, res) => {
    if (typeof req.user != 'undefined')
        res.redirect('/user');
    else
        res.render('login.ejs', {version: require('./package.json').version});
});

app.get('/register', (req, res) => {res.render('register.ejs', {version: require('./package.json').version})});

app.get('/user', auth_token, (req, res) => {
    if (typeof req.user == 'undefined')
        res.redirect('/login');
    else

    res.render('user.ejs', {version: require('./package.json').version});
});

// +--------+
// |  POST  |
// +--------+

app.post('/api/note/share', (req, res) => {
    let note = req.body.note;
    let uuid = uuidv4();
    let expiry_date = new Date();
    expiry_date.setDate(expiry_date.getDate() + 7);
    expiry_date = `${expiry_date.getDate()}-${expiry_date.getMonth()+1}-${expiry_date.getFullYear()}`;
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
        if (err || typeof row == 'undefined') res.json({status: "failed"})
        else {
            let note = JSON.parse(row.val);
            note.id = 0;
            res.json({status: "success", note});
        }
    });

    db.close();
});



// login
app.post('/api/users/login', async (req, res) => {
    if(req.body.userdata) {
        let db = new sqlite.Database('./data/data.db');

        let password = req.body.userdata.password;

        db.get(`SELECT * FROM users WHERE username=?;`, [req.body.userdata.username], async (err, row) => {
            if (err || typeof row == 'undefined') res.json({status: "failed", reason: "invalid-username"})
            else {
                if (await bcrypt.compare(password, row.passwd)){
                    let user = {id: row.id, username: row.username}
                    let token = await jwt.sign({user: user}, require('./data/config.json')["token-secret"]);
                    
                    await res.json({status: "success", user: user, jwt: token, redirect: "/"});
                }
                else {
                    await res.json({status: "failed", reason: "invalid-password"});
                }
            }
        });

        db.close();
    }
});

// register

app.post('/api/users/register', (req, res) => {
    if(req.body.userdata) {
        let db = new sqlite.Database('./data/data.db');

        db.get(`SELECT * FROM users WHERE username=?;`, [req.body.userdata.username], async (err, row) => {
            if (err || typeof row != 'undefined') res.json({status: "failed", reason: "user-already-in-db", redirect: "/login?reason=user-already-in-db"});
            else {
                // user isn't registered
                let username = req.body.userdata.username,
                    email = req.body.userdata.username,
                    password = await bcrypt.hash(req.body.userdata.password, 10);

                if(req.body.userdata.email){
                    db.serialize(() => {
                        db.run(`INSERT INTO users (id, username, email, passwd) VALUES (?,?,?,?)`, [uuidv4().toString(), username.toString(), email.toString(), password.toString()], (err) => {
                            if(err){
                                res.json({status: "failed"});
                            }
                            else{
                                res.json({status: "success", redirect: "/login?reason=success"});
                            }
                            db.close();
                        });
                    });
                }
                else {
                    db.serialize(() => {
                        db.run(`INSERT INTO users (id, username, passwd) VALUES (?,?,?)`, [uuidv4().toString(), username.toString(), password.toString()], (err) => {
                            if(err){
                                res.json({status: "failed"}); 
                            }
                            else{
                                res.json({status: "success", redirect: "/login?reason=success"})
                            }
                            db.close();
                        });
                    });
                }
            }
        });
    }
});

// get notes of user from db
app.post('/api/users/notes/get', auth_token, (req, res) => {
    if (req.user){
        let db = new sqlite.Database('./data/data.db');

        db.get('SELECT * FROM users WHERE id=?', [req.user.id], (err, row) => {
            if (err) 
                res.json({'status': 'failed'});
            else
                res.json({'status': 'success', 'notes': (typeof JSON.parse(row['json_notes']).notes == 'undefined') ? [] : JSON.parse(row['json_notes']).notes});
            db.close();
        });
    }
    else
        res.json({'status': 'failed'});
});

app.post('/api/users/notes/update_time', auth_token, (req, res) => {
    
    if (req.user){
        let db = new sqlite.Database('./data/data.db');

        db.get('SELECT * FROM users WHERE id=?', [req.user.id], (err, row) => {
            if (err) 
                    res.json({'status': 'failed'});
            else
                res.json({'status': 'success', 'json_notes_update':{obj: new Date(row['json_notes_update']), str: row['json_notes_update']}});
            db.close();
        });
    }
    else
        res.json({'status': 'failed'});
});

// set notes of user in db
app.post('/api/users/notes/set', auth_token, (req, res) => {
    if (req.user){
        let db = new sqlite.Database('./data/data.db');

        db.serialize(() => {
            db.run('UPDATE users SET json_notes=?, json_notes_update=? WHERE id=?', [JSON.stringify({notes: (typeof req.body.notes == 'string') ? JSON.parse(req.body.notes) : req.body.notes}), new Date().toString(), req.user.id], (err) => {
                if (err) 
                    res.json({'status': 'failed'});
                else
                    res.json({'status': 'success'});
                db.close();
            })
        });
    }
    else
        res.json({'status': 'failed'});
});

// authentication
function auth_token(req, res, next){
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if (!token){
        token = req.cookies["school-notes-login"];
    }
    jwt.verify(token, require('./data/config.json')["token-secret"], (err, payload) => {
        if (!err)
            req.user = payload.user;
        else 
            req.user = undefined;
    });

    next();
}

// schedule

// deletes shared notes from db, which has expired
const cleanDB = schedule.scheduleJob('1 0 0 * * *', () => {
    let db = new sqlite.Database('./data/data.db');
    
    db.run(`DELETE FROM shared_notes WHERE (expiry_date=? OR expiry_date<?);`, [`${new Date().getDate()-1}-${new Date().getMonth()+1}-${new Date().getFullYear()}`, `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`], (err) => {
        if(err){
            console.log(err);
        }
    });

    db.close();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));