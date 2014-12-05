var should = require('should');
var User=require('../lib/User');
var newUser=new User({username:'luzhen',
    password:'1',
    email:'1'});
describe('test/user.test.js',function(){
    it('User.get()',function(){
        User.get('yukjin',function(err,result){
            (err === null).should.be.true;
        });
    });
});

