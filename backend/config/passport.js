const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const UsersModel = require('../models/UsersModel.js');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Authorize, store user info in session, store user info in DB (if new user)
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

    UsersModel.findOne({ googleID: profile.id }, (err, exists) => {
      if (exists) return;
      const newUser = new UsersModel({
        googleID: profile.id,
        name: profile.displayName,
        image: profile.photos[0].value,
        email: profile.email,
      });
      newUser.save();
    });
    done(null, profile);
  }),
));
