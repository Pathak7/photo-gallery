var mongoose=require("mongoose");
var completeUserSchema = new mongoose.Schema({
  username:String, 
  fname: String, 
  lname: String, 
  email: String, 
  gender: String, 
  profilepicture:String,
  createdAlbums: [String]
});
module.exports = mongoose.model("completeUser", completeUserSchema);
