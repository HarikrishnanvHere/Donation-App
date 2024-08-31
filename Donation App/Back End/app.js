const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./database');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');


const app = express();
let cors = require('cors');
app.use(cors());

app.use(bodyParser.json({extended: true}));

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags : 'a'}
);

app.use(morgan('combined', {stream: accessLogStream}));

app.use(helmet());


let Org = require('./models/org');
let User = require('./models/user');
let Donation = require('./models/donation');
let Order = require('./models/order');
let DownloadUrl = require('./models/downloadUrl');

let orgRoutes = require('./routes/org');
let userRoutes = require('./routes/user');
let purchaseRoutes = require('./routes/purchase');
let adminRoutes = require('./routes/admin');

app.use('/org', orgRoutes);
app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/admin',adminRoutes);

User.hasMany(Donation);
Donation.belongsTo(User);

Org.hasMany(Donation);
Donation.belongsTo(Org);

User.hasMany(Order);
Order.belongsTo(User);

DownloadUrl.belongsTo(User);
User.hasMany(DownloadUrl);

sequelize.sync({})
    .then((result)=>{
        app.listen(3000)
    })
    .catch(err=>console.log(err));





