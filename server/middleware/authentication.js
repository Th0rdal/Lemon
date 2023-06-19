require('dotenv').config();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;

const {pw} = require('../database/database')
const pwDB = new pw();

let authenticationStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //method to get the payload from the jwt token
    secretOrKey: process.env.JWT_KEY,
}

const authenticationStrategy = new JwtStrategy(authenticationStrategyOptions, function(jwt_payload, done) {
    /*
    return: authentication if an authentication was found
    return: err if there was an error
    return: false if no authentication was found
     */
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

const createIsAuthenticated = (req, res, next) => {
    req.isAuthenticated = () => {
        if (req.get("Authorization") !== undefined) {
            return req.get("Authorization").startsWith("Bearer");
        }
        return false;
    }
    next();
}

function notAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
        return;
    }
    res.redirect("/");
}
//this middleware handles the authorization of a jwt token
passport.use('authentication', authenticationStrategy);

module.exports = {createIsAuthenticated, notAuthenticated};