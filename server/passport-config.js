const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;

const {pw} = require('./database/database')
const pwDB = new pw();

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret",
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
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
}))
