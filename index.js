/**
 * Created by luzhen on 14-11-17.
 */
var express=require('express');
var session = require('express-session');
var router=require('./router');
var bodyParser=require('body-parser');
var flash = require('connect-flash');
var app=express();
app.set('views', __dirname + '/views');
app.set('tmp',__dirname+'/tmp');
app.set('view engine', 'ejs');
app.use(session({
    secret: 'blogjustgo', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000*30},
    resave:true,
    saveUninitialized:true
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(router);
app.use(function (req,res,next) {
    res.send('该页不存在');
});
app.listen(process.env.PORT||3000, function () {
    console.log('app is listening at port 3000');
});