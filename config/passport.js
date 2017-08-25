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
            passReqToCallback: true //allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            Users.findOne({where: {email:email}}).then(function(users){
                if (users) {
                    return done(null, false, {message: 'that email is already taken'});
                } else {
                    var data = {
                        email: email,
                        password: password,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name
                    };

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