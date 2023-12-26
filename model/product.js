const mongoose = require('mongoose');


// const productSchema = new mongoose.Schema({
//   id:  { type: String },//{ type: Number, },
//     title: { type: String },
//     price: { type: String },
//     description:{ type: String },//{type: Number,required: true,min: 0,},
//     category:{ type: String },
//     image:{type: String},
//     //token: { type: String  }
//   });  

//   module.exports = mongoose.model("product", productSchema)


  // const mongoose = require("mongoose");

  const productSchema = new mongoose.Schema({
    productid: {
      type: String,
      required: true,
      unique: true
      
    },
    
    title: {
      type: String,
      required: true,
    },
    price:{
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    }
    
  });
  module.exports=mongoose.model("product",productSchema)





  // pp.post('/products', async (req, res) => {
  //   try {
  //     const { name, description, price, quantity } = req.body;
  //     const product = new Product({ name, description, price, quantity });
  //     const savedProduct = await product.save();
  //     res.json(savedProduct);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });