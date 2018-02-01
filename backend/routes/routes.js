const Router = require('express').Router;
const emailHandlers = require('../handlers/email');
const folderHandlers = require('../handlers/folder');
const authHandlers = require('../handlers/auth');
const passport  = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const router = Router();

module.exports = router;

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

router.post('/api/addUser', authHandlers.apiAddUser);
router.get('/api/username', authHandlers.username);
router.get('/auth/logout', authHandlers.logout);

router.get('/api/emails', emailHandlers.emails);
router.delete('/api/emails/:ID', emailHandlers.deleteEmails);
router.post('/api/emails/move', emailHandlers.emailsMoveToFolder);
router.post('/api/emails/mark', emailHandlers.mark);

router.post('/api/folders', folderHandlers.createFolder);
router.put('/api/folders/:ID', folderHandlers.updateFolder);
router.delete('/api/folders/:ID', folderHandlers.deleteFolder);
