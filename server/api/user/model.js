import mongoose     from 'mongoose';
import bcrypt       from 'bcryptjs';
import randomstring from 'randomstring';

const Schema   = mongoose.Schema;

const schema = new Schema({
  email:       {type:String, required: true, unique: true},
  firstName:   String,
  lastName:    String,
  active:      {type: Boolean, default: false},
  subscribed:  {type: Boolean, default: false},
  created:     {type: Date, default: Date.now},
  password:    String,
  role:        {type: String, default: 'user'},
  token:       String,
  tokenExpires: String
});

schema.methods.hashPassword = function({ password = randomstring.generate(7) }){
  return this.password = bcrypt.hashSync(password, 8);
};

schema.methods.validPassword = function(password) {
  //password is not set
  if(!this.password) return false;

  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('user', schema);

export default User;
