const jwt = require('jwt-simple');
const config = require('./../config/config');

const User = require('./../models/user');


function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret, null, null);
}

exports.signin = function(req,res,next) {
  // User has already had their email and password authenticated
  // We just need to give them a token

  res.send({token: tokenForUser(req.user)});
};

exports.signup = function(req,res,next){
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({error:'password or email missing'});
  }

  //See if a user with a given email exists
  User.findOne({email:email}, function(err,existingUser) {
    if(err) {
      return next(err);
    }

    // if a user with email does exist, return an error
    if(existingUser){
      return res.status(422).send({error:'User already exist'}); //422 Unprocessable Entity
    }


    // if a user with email does not exist, create ans save user record
    const user = new User({
      email:email,
      password:password
    });

    user.save(function(err){
      if(err) { return next(err); }
    });

    // respond to request indication the user was created
    res.json({token:tokenForUser(user)});

  });



};
