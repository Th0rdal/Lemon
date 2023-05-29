require('dotenv').config();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;

const {pw} = require('./database/database')
const pwDB = new pw();

let authenticationStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //method to get the payload from the jwt token
    secretOrKey: process.env.JWT_KEY,
}

const authenticationStrategy = new JwtStrategy(authenticationStrategyOptions, function(jwt_payload, done) {
    /*
    return: user if a user was found
    return: err if there was an error
    return: false if no user was found
     */
    console.log(jwt_payload);
    pwDB.findOne({
        "_id":jwt_payload.id,
        "username":jwt_payload.username,
        "email":jwt_payload.email
    }).then(resolve => {
        if (resolve) {
            return done(null, resolve);
        }
        return done(null, false)
    }).catch(err => {
        return done(err, false)
    })
})

//this middleware handles the authorization of a jwt token
passport.use('authentication', authenticationStrategy);
