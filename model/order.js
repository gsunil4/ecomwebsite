const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userid: String, // Assuming a user is identified by a username (replace it with your actual user identification method)
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  totalprice: Number,
  fullAdderss: String,
});


module.exports=mongoose.model("order",orderSchema)





