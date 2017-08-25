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

    //Local Signup
    passport.use('local-signup', new localStrategy(
        
        {
            emailField: 'email',
            passwordField: 'password',
            passReqCallback: true //allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            Users.findOne({where: {email:email}}).then(function(users){
                if (users) {
                    return done(null, false, {message: 'that email is already taken'});
                } else {
                    var data = {};
                    data.email = email;
                    data.password = password;
                    data.name = req.body.name;

                Users.create(data).then(function(newUser, created){
                    if(!newUser){
                        return done(null, false);
                    }

                    if(newUser) {
                        return done(null, newUser)
                    }
                });
            }
            });
        }
    ));

    //Local Signin

};