const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
// TODO - keep user info in DB, from this file
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
