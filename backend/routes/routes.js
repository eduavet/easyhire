const Router = require('express').Router;
const handlers = require('../handlers/handlers');
const gapiHandler = require('../handlers/gapi.handler');
const passport  = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const router = Router();

module.exports = router;

router.post('/api/addUser', handlers.apiAddUser);
router.post('/', gapiHandler.getEmails);
router.get( '/auth/google',passport.authenticate( 'google',
    { scope:
        ['https://mail.google.com/',
            // 'https://www.googleapis.com/auth/gmail.modify',
            // 'https://www.googleapis.com/auth/gmail.readonly',
            // 'https://www.googleapis.com/auth/gmail.metadata',
            'profile', 'email', 'openid'] ,
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure',
    })
);
router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    }));
router.get( '/auth/google/success',function (req, res) {
    console.log('/auth/google/success');
    // console.log(req.profile);

    res.send('/auth/google/success')
});

router.get( '/auth/google/failure',function(req, res){
    console.log('/auth/google/failure');
    res.send('/auth/google/failure')
});
router.get( '/auth/google/test',function(req, res){
    console.log('/auth/google/test');
    res.send('/auth/google/test')
});
