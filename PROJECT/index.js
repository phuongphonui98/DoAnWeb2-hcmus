var express = require('express');
var app = express();
let bodyParser = require('body-parser');
let DatXe = require('./models').datxe;
let User = require('./models').User;

let models = require('./models');
// Setting for app here
// Set Public Folder
app.use(express.static(__dirname + '/public'));
var expressHbs = require('express-handlebars');
var userController = require('./controllers/users');
var hbs = expressHbs.create({
	extname			: 'hbs',
	defaultLayout	: 'layout', 
	layoutsDir		: __dirname + '/views/layouts/',
	partialsDir		: __dirname + '/views/partials/',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var urlparser =bodyParser.urlencoded({extended:false})
var session = require('express-session');
app.use(session({
    cookie : {httpOnly:true,maxAge: 30*24*60*60*1000},
    secret: "S3cret",
    resave: false,
    saveUninitialized: false
}));


var expressValidator = require('express-validator');
app.use(expressValidator());

app.use(function(req,res,next){
    res.locals.user= req.session.user;
    res.locals.isLoggedIn = req.session.user ? true : false;
    next();
})
app.use(bodyParser.urlencoded({
    extended: true
}));

// Define your route here
app.post('/', (req, res) => {
    var email = req.body.email_login;
    var password = req.body.password_login;

    userController.getUserByEmail(email, function(user) {
        if (!user) {
            res.render('login', { error: 'No email is found' });
        } else {
            
            userController.comparePassword(password, user.Password, function(isMatch) {
                if (!isMatch) {
                    res.render('login', { error: 'Incorrect Password' });
                    
                } else {
                    req.session.user = user;
                    if (req.session.returnURL) {
                        res.redirect(req.session.returnURL);
                    } else {
                        if (user.isAdmin === true) {
                            res.redirect('/users/admin');
                        } else {
                            console.log(password);
                        console.log(user.Password);
                            User.update({
                                Check:1
                            },{
                                where:{
                                    Email:req.session.user.Email
                                }
                            }).then(()=>{
                                res.redirect('/');
                            })
                            
                        }
                    }
                }
            });
        }
    });
});
app.post('/register', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var sdt = req.body.sdt;
    var img=  "../images/avata/"+req.body.image;
    var bs = req.body.bs;
    var confirm = req.body.confirm;

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm', 'Confirm Password is required').notEmpty();
    req.checkBody('confirm', 'Confirm Password must match wirh Password').equals(password);

    var errors = req.validationErrors();
    if (errors) {
        console.log("fail");
        res.render('register', { errors: errors });
    } else {
        userController.getUserByEmail(email, function(user) {
            if (user) {
                console.log("1");
                res.render('register', { error: `Email ${email} exists! Please choose another email.` });
            } else {
                var user = {
                    Email: email,
                    Password: password,
                    HoTen: name,
                    SDT:sdt,
                    ImagePath: img,
                    SoXe: bs,
                    isAdmin: false
                };
                userController.createUser(user, function(err) {
                    if (err) throw err;
                    res.render('login', { error: 'You have registered, now please login' });
                });
            }
        });
    }
});

app.get('/',(req,res)=>{
    if(req.session.user){
        
        res.render('index',{check:JSON.stringify(1),ArrUser:JSON.stringify(req.session.user),datxe:JSON.stringify(temp)});
    }
    else{
        User.findAll({
            where:{
                Check:1
            }
        }).then(mang=>{
            res.render('index',{check:JSON.stringify(0), ArrUser:JSON.stringify(mang),datxe:JSON.stringify(temp)});    
        })
    }
})
app.get('/profile',(req,res)=>{
    DatXe.findAll({
        where:{
            TenTX:req.session.user.HoTen
        }
    }).then(datxe=>{
        res.locals.datxe = datxe;
    })
    User.findOne({
        where:{ id:req.session.user.id}
    })
    .then(User=>{
        res.locals.User = User;
        if(req.session.user == undefined || req.session.user == null){
            res.render('login')
        }   
        else  res.render('profileDriver');
    })
})

app.get('/profileDriver',(req,res)=>{
    if(req.session.user == undefined || req.session.user == null){
       res.render('login')
    } else res.render('editprofileDriver')
})


app.get('/sync', (req, res) => {    
    models.sequelize
    .sync()
    .then(() => {
        res.send('tables created!');
    });
});
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/gioithieu', (req, res) => {
    res.render('gioithieu');
});
app.get('/logout', function(req, res) {
    User.update({
        Check:0
    },{
        where:{
            Email:req.session.user.Email
        }
    }).then(()=>{
        req.session.user = null;
        res.redirect('/login');
    })
    
});

app.post('/editprofile', (req, res) => {
    User.findOne({
        where:{
            id:req.body.submit
        }
    })
    .then(User =>{
        res.locals.User = User
        res.render('editprofileDriver');
    })
   
});

app.get('/dashboard', (req, res) => {
    User
    .findAll({})
    .then(user=>{
        res.locals.user = user;
    })
    DatXe
    .findAll({
    })
    .then(datxe=>{
        res.locals.datxe = datxe;
        res.render('manage');
    })
    
});

app.get('/datxe',(req,res)=>{
    res.render('datxe')
})
var temp=0;
var temp1 =0;
var result;
app.post('/xacnhan',(req,res)=>{
    temp ={
        ten: req.body.ten,
        sdt: req.body.sdt
    };
    result = Object.assign(temp,temp1);
    res.redirect('/');
})

app.post('/themdatabase',(req,res)=>{
    console.log(req.body.TenTX);
    DatXe
    .create({
        TenKH: req.body.TenKH,
        To: req.body.To,
        From: req.body.From,
        Price: req.body.Price,
        TenTX: req.body.TenTX
    })
    .then(()=>{
        res.render('datxe');
    })
})


server.listen(5000,console.log("Đã khởi tạo server 5000"));   

var arr_pos =[];
io.on('connection',(socket)=>{
    console.log(socket.id+"đã kết nối");
    io.sockets.on('disconnect',function(){
        console.log(socket.id + "đã ngắt kết nối");
    })
    io.sockets.emit('temp',temp);
    socket.on('client_send',(data)=>{
        arr_pos.push(data);
        console.log(arr_pos);
        io.sockets.emit('server_send',arr_pos);
    })
    socket.on('infor',(infor)=>{
        temp1 = infor;
        console.log(temp1);
    })
    io.sockets.emit('send_data',result);
    console.log(result);
    socket.on('xacnhan',(bool)=>{
        if(bool == 1){
            io.sockets.emit('traloi',1);

        }else io.sockets.emit('traloi',0);
    })
    socket.on('client_clear',(data)=>{
        arr_pos = [];
        io.sockets.emit('server_clear',arr_pos);
    })
})