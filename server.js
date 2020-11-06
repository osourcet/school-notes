const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const sqlite = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static
app.use('/sources', express.static(__dirname + '/sources'));


// view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index.ejs', {version: require('./package.json').version}));

// router.post('/create', (req, res) => {
//     console.log(req.body);
//     res.redirect('/');
// });

app.use('/', router);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));