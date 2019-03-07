const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const config = require("../config/database");

const UserSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        usertype: {
          type: String,
          required: true
        },
        mobileno: {
          type: String,
          required: true
        },
        useroffice: {
          type: String,
          default: 'NONE'
        }
    },
    {
        collection: 'users',
        read: 'nearest'
    }
);

// Mongoose pluralizes the name of the model as it considers this good practice for a "collection" of things to be a pluralized name. This means that what you are currently looking for in code it a collection called "users" and not "user" as you might expect.

// You can override this default behavior by specifying the specific name for the collection you want in the model definition:

// var userModel = mongoose.model('user', userSchema, 'user');
// The third argument there is the collection name to be used rather than what will be determined based on the model name.

// comments

// OK I tried this and I'm still getting null in my user variable. Is there anything other than stepping through the code line by line that I can do to debug what is going wrong? – Beehive Inc Feb 28 '15 at 4:08
// @CodeMonkey What exactly are you doing in the "MongoDB shell"? The obvious call here was if you were not aware then the collection is pluralized by mongoose. The only other thing is that you are clearly not doing "the same thing" as you say. – Neil Lunn Feb 28 '15 at 4:13
// The command I'm issuing through the Mongo shell is db.User.findOne({email: 'test@test.com'}); is this not the same command that mongoose is sending? – Beehive Inc Feb 28 '15 at 4:18
// I got it to work...I needed to capitalize 'user'; after I did that it returned the results. Thanks for all of your help @Neil – Beehive Inc Feb 28 '15 at 4:29

const User = mongoose.model("User", UserSchema);

module.exports = User;

module.exports.getUserById = async id => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        return error;
    }
}

module.exports.getUserByUserName = async userName => {
    try {
        const query = { userName : userName };
        const user = await User.findOne( query );
        return user;
    } catch (error) {
       return error;
    }
}

module.exports.addUser = async newUser => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = await hash;
        await newUser.save();
        return "success";
    } catch (error) {
        return "error saving";
    }
}

module.exports.comparePassword = async (candidatePassword, hash) => {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, hash);
        return isMatch;
    } catch (error) {
        console.error(error);
    }
}
