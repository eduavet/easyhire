const fetch = require('node-fetch');
const passport  = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const util =  require('util');
const emailsModel = require('../models/emailsModel.js');

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
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback   : true
    },
    function (request, accessToken, refreshToken, profile, done) {
     /* Emails --*/
     console.log('function is working !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
     console.log(accessToken, 'accessToken function is working !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
     request.session.userID = profile.id;
     request.session.accessToken = accessToken;
     request.session.name = profile.displayName;
     request.session.save();

        done(null, profile);

        // console.log(profile.emails, 'emails');//[ { value: 'simplyeasyhire@gmail.com', type: 'account' } ] 'emails'
        // console.log(accessToken, 'accessToken'); //ya29.GltNBR0... accessToken
        // console.log(refreshToken, 'refreshToken'); //undefined 'refreshToken'
        // console.log(profile.displayName, 'profile displayName');
        // console.log(profile.id, 'id');// 101815959642399011142 id
        // console.log(profile, 'profile');
        // const userId = profile.id;
        // fetch('https://www.googleapis.com/gmail/v1/users/'+profile.id+'/messages?access_token='+accessToken)
        //     .then(res => res.json()).then(res => {
        //     const id = res.messages[1].id;
        //     return fetch('https://www.googleapis.com/gmail/v1/users/'+profile.id+'/messages/'+id+'?access_token='+accessToken)
        //         .then(res=> res.json())
        //         .then(res => {
        //             console.log('email');
        //             emailsModel.find({"userId":userId})
        //                 .then(res => {
        //                     if(res.length<1) {
        //                         console.log('user not found');
        //                         const newEmail = new emailsModel({
        //                             userId: userId,
        //                             allEmails : [
        //                                 {
        //                                     status: 'Not reviewed',
        //                                     emails: [{ emailId: id, isRead: false }]
        //                                 }
        //                             ]
        //                         });
        //                         newEmail.save();
        //                     } else {
        //                         console.log('user found');
        //                         return emailsModel.find({userId:userId, "allEmails.emails.emailId": id})
        //                             .then(res => {
        //                                 console.log(' after email search');
        //                                 console.log(' id', id);
        //                                 if(res.length<1) {
        //                                     console.log('email not found');
        //                                     return emailsModel.update({userId:userId, "allEmails.status": "Not reviewed"},{ $push: { "allEmails.$.emails": { emailId: id, isRead: false }}})
        //                                         .then(res => {
        //                                             console.log(res);
        //                                         })
        //                                 } else {
        //                                     console.log('email found')
        //                                 }
        //                                 console.log(res);
        //                             })
        //                     }
        //                     console.log(res);
        //                 })
        //             // console.log(util.inspect(res, { depth: 8 }));
        //             // console.log(res)
        //             // // console.log(res.payload.parts[0].parts, 'payload parts')
        //             // console.log(res.payload.parts, 'payload parts')
        //             // console.log(Buffer.from(res.payload.parts[0].body.data, 'base64').toString()) //actual email text
        //         })
        // }).catch(err => {
        //     console.log('err')
        //     console.log(err, 'err')
        // });
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
