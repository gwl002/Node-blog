var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var md5=require("md5");

var UserSchema = new Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String,required:true},
  created:{type:Date}
});

UserSchema.methods.verifyPassword=function(password){
	var isMatched=md5(password) === this.password;
	console.log("UserSchema.methods.verifyPassword:",password,this.password,isMatched)
	return isMatched;
}

mongoose.model('User', UserSchema);