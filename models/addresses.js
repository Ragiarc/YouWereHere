const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
  address: String,
});
mongoose.model('Address', AddressSchema);

// CommentSchema.methods.upvote = function (cb) {
//     this.upvotes += 1;
//     this.save(cb);
//   };