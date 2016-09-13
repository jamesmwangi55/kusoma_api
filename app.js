var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan')
    logger = require('./utils/logger.js'),
    passport = require('passport')
    path = require('path'),
    cors = require('cors');

     
var db;

if(process.env.ENV == 'Test'){
    db = mongoose.connect('mongodb://kusoma-db-vm.cloudapp.net');
} else {
    db = mongoose.connect('mongodb://kusoma-db-vm.cloudapp.net');
}



var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // pass passport for configuration

// user
var User = require('./models/userModel.js');
var userRoutes = require('./routes/userRoutes.js')(User);
app.use('/api/users', userRoutes);

// universities
var University = require('./models/universityModel.js');
var universityRouter = require('./routes/universityRouter.js')(University, passport);
app.use('/api/universities', universityRouter);

// courses
var Course = require('./models/courseModel.js');
var courseRouter = require('./routes/courseRouter.js')(Course, passport);
app.use('/api/courses', courseRouter);

// resources
var Resource = require('./models/resourceModel.js');
var resourceRouter = require('./routes/resourceRouter.js')(Resource, passport);
app.use('/api/resources', resourceRouter);


app.get('/', function(req, res){
    res.send('hello, world!');
})

app.listen(port, function(){
    logger.info('App running on port: ', port);
})