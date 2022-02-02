const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Middleware
const bcrypt = require('bcrypt');

const loginSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty'],
        minlength: [8, 'Password cannot be less than 8 characters']
    }
});

//pre hook for hashing pwd
loginSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password , salt);
    next();
});

//login method
loginSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Invalid Username');
}

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;