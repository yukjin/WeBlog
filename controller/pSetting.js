/**
 * Created by luzhen on 14-11-28.
 */
var formidable = require('formidable');
var conf=require('../conf/conf');
var fs=require('fs');
var qn=require('qn');
var User=require('../lib/User');

var client = qn.create({
    accessKey: conf.AccessKey,
    secretKey: conf.SecretKey,
    bucket: conf.bucket,
    domain: conf.domain
});
exports.userInfoSet= function (req,res,next) {
    var user=req.session.user||'';
    User.updateSignature({content:req.body.signature,user_name:user.user_name},function(err,result){
        user.signature=req.body.signature;
        res.redirect('/'+user.user_name+'/home');
    });
}
exports.headImgSet=function(req,res,next){
    var user=req.session.user||'';
    var form = new formidable.IncomingForm();
    form.uploadDir ="tmp";
    form.on('file',function(name,file){
        if(file.name===''){
            res.redirect('/pSettings');
            return;
        }

        client.upload(fs.createReadStream(file.path),function(err,result){

            fs.unlink(file.path,function(err,result){
                if(err){
                    next(err);
                }
            });
            var qnUrl=result.url;
            User.updateHeadPhoto({'user_name':user.user_name,'portrait_url':qnUrl},function(err,result){
                if(err){
                    next(err);
                }else{

                    user.portrait_url=qnUrl;
                    //res.redirect('/'+user.user_name+'/home');
                    res.send(qnUrl);
                }
            });

        });
    });
    form.parse(req);
}