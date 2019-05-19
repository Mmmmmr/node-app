
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose')
const User = require('../db/model/User')
const keys = require('./keys')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrPrivateKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts,  (jwt_payload, done) => {
        User.findById(jwt_payload.id, (err, user)=>{
            if(user){
               return done(null, user)
            } else {
               return done(null. false)
            }
        })
    }));
}