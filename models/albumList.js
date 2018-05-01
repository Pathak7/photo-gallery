var mongoose=require("mongoose");
var albumSchema = new mongoose.Schema({
   name: String,
   likes: String,
   description: String,
   cover: String,
   creator: String,
   pictures: [[String,String,String,String]],
   visibilty: String,
   dt:String
});
module.exports = mongoose.model("ALBUM", albumSchema);