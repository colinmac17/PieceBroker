

module.exports = function(passport, users){
    var Users = users;
    var localStrategy = require('passport-local').Strategy;

    passport.serializeUser(function(users, done){
        done(null, users.id);
    });

    passport.deserializeUser(function(id, done){
        Users.findById(id).then(function(users){
            if(users){
                done(null, users.get());
            } else {
                done(users.errors, null);
            }
        });
    });

    passport.use('local-signup', new localStrategy({

    }, function(req, email, password, done) {
        Users.findOne({where: {email: email}}).then(function(users){
            if(users){
                return done(null, false, {});
            } else {
                var data = {
                    email: email,
                    password: password,
                    name: req.body.name
                };
            }
        });
    })
};