const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const User = require('../models/user');

router.post('/register', async (req,res) => {

    let newUser = await new User({
        userName: req.body.userName,
        password: req.body.password,
        usertype: req.body.usertype,
        mobileno: req.body.mobileno
    });

    try {
        await User.addUser(newUser);
        return res.json({success: true, msg: "User registered"});
    } catch (error) {
        return res.json({success: false, msg: "failed to register user"});
    }

});

router.post('/authenticate', async (req,res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    try {
        const user = await User.getUserByUserName(userName);

        if(!user) {
            return res.json({success : false, msg: 'User not found!'});
        }
        const isMatch = await User.comparePassword(password, user.password);
        if(isMatch) {
            const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {expiresIn:"7 days"});
            return res.json({
                success: true,
                token: token,
                user : {
                    id: user._id,
                    userName : user.userName
                }
            });
        } else {
            return res.json({success: false, msg: 'Wrong password'});
        }
    } catch (error) {
        return res.json({success: false, msg: 'System error: ' + error});
    }
});

// router.get('/profile', passport.authenticate('jwt',{session:false}), async (req,res) => await res.json( {"user": req.user} ));
router.get('/profile', passport.authenticate('jwt',{session:false}), async (req,res) => {
            return await res.json( { user : req.user } )
        });


// nilagay lang galing sa ng azure
async function isLoggedIn(req, res, next) {
    // If user is authenticated in the session
    // carry on to the next middleware function
    if (await req.isAuthenticated() && await isValidAdmin(req.user)) {
      return next();
    } else {
      return res.status(401).send({ message: 'unauthorized. please log in and try again' });
    }
  }

  async function isValidAdmin(requestUser) {
    const validUsers = ['eprel', 'superhuman'];
    return await validUsers.find(async user => await requestUser.userName.toLowerCase() === user.toLowerCase());
  }
// end nilagay lang galing sa ng azure

module.exports = router;
