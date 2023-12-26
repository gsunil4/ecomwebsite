const mongoose = require('mongoose');

// Cart schema
const cartSchema = new mongoose.Schema({
  userid: String,
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      fullAdderss: String,

    },
  ],
});
