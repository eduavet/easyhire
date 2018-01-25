const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const cors = require('cors');
const passport  = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
const GOOGLE_CLIENT_ID      = "483858413857-ku2lhjms1a70a0jqoocpqcucbon9ms4c.apps.googleusercontent.com"
    , GOOGLE_CLIENT_SECRET  = "PV9sFq6lH2ZzfQKemaWM83Te";
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
passport.use(new GoogleStrategy({
        clientID:     GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        //NOTE :
        //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
        //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/
        //then edit your /etc/hosts local file to point on your private IP.
        //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
        //if you use it.
        callbackURL: "http://localhost:3000/auth/google/success",
        passReqToCallback   : true
    },
    function goofleInfo(request, accessToken, refreshToken, profile, done) {
    console.log('reqq');
    console.log(request);
        console.log(profile.emails[0].value);
        // asynchronous verification, for effect...
        process.nextTick(function () {
console.log('nextTicck')
            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

app.use( passport.initialize());
app.use( passport.session());

app.get( '/auth/google',passport.authenticate( 'google',
    { scope:
            ['profile', 'email'] ,
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure',
    })
   );
app.get( '/auth/google/success',function (req, res) {
    console.log('/auth/google/success');
    console.log(req.profile);

    res.send('/auth/google/success')
})

app.get( '/auth/google/failure',function(req, res){
    console.log('/auth/google/failure');
    res.send('/auth/google/failure')
})
app.get( '/auth/google/test',function(req, res){
    console.log('/auth/google/test');
    res.send('/auth/google/test')
})
const myRouter = require('./routes/routes');



app.listen(3000, () => {
  console.log('Listening to port 3000');
});



app.use('/', myRouter);
