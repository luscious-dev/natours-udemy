const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    // validate: {
    //     validator: function(email){
    //         return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)
    //     },
    //     message: "Not a valid email address"
    // }
    validate: {
      validator: email => validator.isEmail(email),
      message: 'Please provide a valid email'
    }
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'lead-guide', 'guide'],
      message: 'Not a valid user role'
    },
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // Validator only works on CREATE and SAVE!
      validator: function(val) {
        return this.password == val;
      },
      message: 'Your passwords do not match!'
    }
  },

  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
  // Only run function if password modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  // if(this.isModified("password") && !this.isNew ){
  //     this.passwordChangedAt = Date.now()
  // }
  // next()

  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
  return isCorrect;
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > JWTTimestamp;
  }

  // False mean not changed
  return false;
};

userSchema.methods.createResetToken = function() {
  // Hash token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Not safe to save token directly in database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
