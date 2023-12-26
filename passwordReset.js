const mongoose = require('mongoose');


const passwordResetSchema = new mongoose.Schema({
    userId: { type: String, default: '' },
    resetString: { type: String, default: '' },
    createdAt: Date,
    expiresAt: Date
    
    
  });  

  module.exports = mongoose.model("passwordReset", passwordResetSchema)
