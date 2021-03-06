const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const config = require('../config/config');
const User = require('./../models/user');


// Create a local strategy
// Used when signing in
// To verify email/password
const localOptions = {usernameField: 'email'};
const localLogin =  new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this username and password, call done with the user

  // if it is the correct username and password
  // otherwise, call done with false
  User.findOne({email:email}, function(err,user) {
    if(err) {return done(err); }
    if(!user) { return done(null,false) }

    //compare password
    user.comparePassword(password,function(err,isMatch) {
      if(err) {return done(err)}
      if(!isMatch) { return done(null, false);}
    });

  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
// used when requesting athenticated requests

// payload is the decoded jwt
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if(err) { return done(err,false); }

    if (user) {
      done(null, user);
    }else {
      done(null, false);
    }

  });

});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);