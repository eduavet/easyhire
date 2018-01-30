const fetch = require('node-fetch');
const passport  = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const util =  require('util');
const emailsModel = require('../models/emailsModel.js');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log('Deserialize');
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //NOTE :
        //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
        //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/
        //then edit your /etc/hosts local file to point on your private IP.
        //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
        //if you use it.
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback   : true
    },
    function (request, accessToken, refreshToken, profile, done) {
     /* Emails --*/
     request.session.userID = profile.id;
     request.session.accessToken = accessToken;
     request.session.name = profile.displayName;
     request.session.save()
         // .then(() => done(null, profile));
     done(null, profile);

        // console.log(profile.emails, 'emails');//[ { value: 'simplyeasyhire@gmail.com', type: 'account' } ] 'emails'
        // console.log(accessToken, 'accessToken'); //ya29.GltNBR0... accessToken
        // console.log(refreshToken, 'refreshToken'); //undefined 'refreshToken'
        // console.log(profile.displayName, 'profile displayName');
        // console.log(profile.id, 'id');// 101815959642399011142 id
        // console.log(profile, 'profile');
        // const userId = profile.id;

        // // asynchronous verification, for effect...
        // process.nextTick(function () {
        //
        //     console.log('nextTicck');
        //     // To keep the example simple, the user's Google profile is returned to
        //     // represent the logged-in user.  In a typical application, you would want
        //     // to associate the Google account with a user record in your database,
        //     // and return that user instead.
        //     return done(null, profile);
        // });
    }
));
