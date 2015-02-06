var LocalStrategy = require("passport-local").Strategy,
    db            = require("../models");

module.exports = function (passport) {

    passport.serializeUser( function (user, done) {
        done(null, user.id);
    });


    passport.deserializeUser( function (id, done) {
        db.User.find(id, {raw: true}).success(function (user) {
            return done(null, user);
        }).error(function (err) {
            return done(err, false);
        });
    });


    passport.use("local-login", new LocalStrategy({
        usernameField : "email",
        passwordField : "password"
    }, function (email, password, done) {
        process.nextTick(function () {
            db.User.find({
                where: {
                    email   : email,
                    deleted : false
                }
            }, {raw: true}).success(function (user) {
                console.log("USER: " + user);
                if (user && user.password && 
                        user.password === db.User.generateHash(password, user.email)){
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }).error(function (err) {
                return done(err, false);
            })
        });
    }));
}