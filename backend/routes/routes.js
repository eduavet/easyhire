const Router = require('express').Router;
const handlers = require('../handlers/handlers');
const gapiHandler = require('../handlers/gapi.handler');
const passport  = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const router = Router();

module.exports = router;

router.post('/api/addUser', handlers.apiAddUser);
router.post('/', gapiHandler.getEmails);
router.get( '/auth/google', passport.authenticate( 'google',
    { scope:
        ['https://mail.google.com/',
            // 'https://www.googleapis.com/auth/gmail.modify',
            // 'https://www.googleapis.com/auth/gmail.readonly',
            // 'https://www.googleapis.com/auth/gmail.metadata',
            'profile', 'email', 'openid']
    })
);
router.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: 'http://localhost:8080',
        failureRedirect: '/auth/google'
    }));
// router.get('/auth/google/success',function (req, res) {
//     console.log('/auth/google/success');
//     // console.log(req.profile);
//     res.send({ hello: 'world' });
// });
router.get('/api/emails', handlers.emails);
router.get('/api/username', handlers.username);
router.get('/auth/logout', handlers.logout);
router.post('/api/folders', handlers.createFolder);
router.post('/api/emails/move', handlers.emailsMoveToFolder);
router.put('/api/folders/:ID', handlers.updateFolder);
router.delete('/api/folders/:ID', handlers.deleteFolder);
router.delete('/api/emails/:ID', handlers.deleteEmails);