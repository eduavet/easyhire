const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const UsersModel = require('../models/UsersModel.js');

passport.serializeUser((user, done) => {
  UsersModel.findOne({ googleID: user.id }, (err, exists) => {
    if (exists) return;
    const newUser = new UsersModel({
      googleID: user.id,
      name: user.displayName,
      image: user.photos[0].value,
      email: user.email,
    });
    newUser.save();
  });
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true,
  },
  ((request, accessToken, refreshToken, profile, done) => {
  /* Emails --*/
    request.session.userID = profile.id;
    request.session.accessToken = accessToken;
    request.session.name = profile.displayName;
    request.session.save();
    done(null, profile);
  }),
));
