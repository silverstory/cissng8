const express = require('express');
const security = require('./security');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
// const config = require("./config/config.js");
require('./mongo').connect();

const root = '../dist/';

const app = express();
const port = process.env.PORT || 4000;
const publicweb = process.env.PUBLICWEB || '../dist/publicweb';

// cors middleware
app.use(cors());

//body-parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// enable cors to the server
// if specific origins, set to env vars
// process.env.CORS_ALLOW_ORIGIN
// const corsOpt = {
//   origin: '*', // this work well to configure origin url in the server
//   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // to works well with web app, OPTIONS is required
//   allowedHeaders: ['sessionId', 'Content-Type', 'Authorization'], // allow json and token in the headers
//   exposedHeaders: ['sessionId'],
//   preflightContinue: false
// };
// app.use(cors(corsOpt)); // cors for all the routes of the application
// app.options('*', cors(corsOpt)); // automatic cors gen for HTTP verbs in all routes, This can be redundant but I kept to be sure that will always work.

// ng azure security way
app.use(security());

// don't really need this code anymore... but just keep it anyway.
// app.use(csrf({ cookie: true }));

// serve publicweb folder
app.use(express.static(path.join(root, 'publicweb')));

// users routes
const users = require("./routes/users");
app.use('/users', users);

// other routes go here
// const heroes_routes = require('./routes/heroes');
const heroes = require('./routes/heroes');
app.use('/api', heroes);
const profiles = require('./routes/profiles');
app.use('/api', profiles);
const qrcode = require('./routes/qrcode');
app.use('/api', qrcode);
const profile2fa = require('./routes/profile2fa');
app.use('/api', profile2fa);
const ipwhitelist = require('./routes/ipwhitelist');
app.use('/api', ipwhitelist);
const approvaltemplate = require('./routes/approvaltemplate');
app.use('/api', approvaltemplate);

// try to implement this line if it'll solve resource not found if :3000/{path}
// app.get('*', (req, res) => {
//     res.sendFile('index.html', {root: root});
// });

app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: publicweb });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
