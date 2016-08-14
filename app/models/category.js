var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  title:{type:String,required:true},
  slug:{type:String,required:true},
  created:{type:Date}
});

CategorySchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Category', CategorySchema);