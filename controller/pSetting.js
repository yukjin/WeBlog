/**
 * Created by luzhen on 14-11-28.
 */
var conf=require('../conf/conf');
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
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype){
        client.upload(file, {filename: filename},function(err,result){

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
    req.pipe(req.busboy);
}