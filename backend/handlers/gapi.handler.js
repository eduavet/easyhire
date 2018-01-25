const emailsModel = require('../models/emailsModel.js')
const usersModel = require('../models/usersModel.js')
const gapiHandler = {};
module.exports = gapiHandler;

gapiHandler.apiAddUser = (req, res) => {

  //if user doesn't exist in DB, add user
  usersModel.find({googleID: req.body.googleID}, (err, docs) => {
    if(docs.length < 1){
      const newUser = new usersModel({
          googleID: req.body.googleID,
          name: req.body.name,
          image: req.body.imageURL,
          email: req.body.email,
          lastSync: ''
      })
      newUser.save()
      .catch(console.error)
      console.log('user added in DB');
    }
  })
};
gapiHandler.getEmails = (req, res) => {

};

