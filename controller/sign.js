/**
 * Created by luzhen on 14-11-25.
 */
var User=require('../lib/User');
var Post=require('../lib/Post');
var eventproxy = require('eventproxy');
var tools=require('../lib/tools');


function showLogin(req,res,next){
    res.render('login');
}

function login(req,res,next) {
    var username=req.body.username;
    var password=tools.md5(req.body.password);
    var ep = new eventproxy();
    ep.on('login_err',function(tip){
        req.flash('error',tip);
        res.redirect('/login');
    });
    User.getByName(username,function(err,result){
        if(result.length>0){
            if(password!=result[0].password){
                ep.emit('login_err','用户或密码错误！');
            }else{
                req.session.user=result[0];
                res.redirect('/'+username+'/home');
            }
        }else{
            ep.emit('login_err','用户或密码错误！');
        }
    });
}

function logout(req,res,next){
    req.session.user=null;
    res.redirect('/');
}

function showRegister(req,res,next) {
    res.render('register');
}
function register(req,res,next){
    var username=req.body.username;

    var password=req.body.password;
    var email=req.body.email;
    var repeatPassword=req.body.repeatPassword;
    var ep = new eventproxy();

    ep.on('register_err',function(tip){
        req.flash('error',tip);
        res.redirect('/register');
    });
    if(/[^1-9a-zA-Z]/.test(username)){
        ep.emit('register_err','用户名只能为数字或字母');
        return;
    }
    if ([username,password,repeatPassword, email].some(function (item) { return item === ''; })) {
        ep.emit('register_err', '信息不完整!');
        return;
    }

    if(username.length<6){
        ep.emit('register_err','用户名不能少于6字符！');
        return;
    }

    if(req.body.password!=repeatPassword){
        ep.emit('register_err','两次输入密码不一致！');
        return;
    }

    var newUser=new User({
            'user_name':username,
            'password':tools.md5(password),
            'email':email,
            'portrait_url':'http://justgoblog.qiniudn.com/imagesdefault.png',
            'signature':''});

    User.getByName(newUser.user_name,function(err,result){
        if(err||result.length>0){
            ep.emit('register_err','该用户名已被占用！');
        }else{
            newUser.add(function(err,row){
                    if(err){
                        ep.emit('register_err',err.message);
                    }else{
                        Post.addCategory({'name':'默认','user_id':row.insertId},function (err, result) {
                            if(err){
                                next(err);
                            }
                        })
                        newUser.id=row.insertId;
                        req.session.user=newUser;
                        res.redirect('/'+newUser.user_name+'/home');
                    }
                });
            }
        });
}
exports.showLogin=showLogin;
exports.login=login;
exports.logout=logout;

exports.showRegister=showRegister;
exports.register=register;