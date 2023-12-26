require("dotenv").config()
const express = require('express')
const app = express()
const formidable = require('express-formidable')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
let verifyToken = require('./middleware/authentication');
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuidv4');
const PORT = process.env.API_PORT


require('./config/database').connect()


const bodyParser = require('body-parser');
const Student = require('./model/user')
const user = require("./model/user")
const product = require('./model/product')
const Cart = require('./model/cart')
const Order = require('./model/order')
const resetPassword = require('./model/passwordReset')
const passwordReset = require("./model/passwordReset");
//const Student = require('./model/product')

app.use(bodyParser.json());

// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.AUTH_EMAIL,
//         pass:process.env.AUTH_PASS
//     },
// })


app.post('/register', formidable(), async function (req, res){
    let {firstName, lastName, email, password} = req.fields
    if (! (firstName && lastName && email && password)){
        res.status(400).send('Provide all the inputs')
    }
    else{
        if (await Student.findOne({email})){
            res.send("user already exist")
        }
        else{

            let enc_password = await bcrypt.hash(password, 10)

            let user = await Student.create({
                        firstName:firstName,
                        lastName:lastName,  
                        email:email,
                        password:enc_password});

            let token = jwt.sign({ user_id:user._id, email},
                process.env.TOKEN_KEY,
                 { expiresIn: "5h" });

            user.token = token

            res.json(user)
        }        
    }
})



app.post('/login', formidable(), async function (req, res){
    let { email, password} = req.fields
    if (! (email && password)){
        res.status(400).send('Provide all the inputs')
    }
    else{
        let user = await Student.findOne({email})

        if (user && (await bcrypt.compare(password, user.password)))
        {
            let token = jwt.sign({ user_id:user._id, email},
                process.env.TOKEN_KEY,
                 { expiresIn: "5h" });

                 
            user.token = token

            res.json(user)
        }
        else{
            res.status(403).send('Incorrect username or password!!')
        }
    }
})


app.get('/profile', verifyToken ,function (req, res){

    res.send('Hello welcome to ITD')

});

//get users
app.get("/getUser",(req, res)=>{
    Student.find({}).then(function(user){
        res.json(user)

        
    }).catch(function(err){
        console.log(err)
    })

    
})

// Update a user by ID
app.put('/updateuser/:id', async (req, res) => {
    try {
      const updateduser = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updateduser) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updateduser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Delete a uders by ID
app.delete('/deleteuser/:id', async (req, res) => {
    try {
      const deleteduser = await Student.findByIdAndDelete(req.params.id);
      if (!deleteduser) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(deleteduser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

app.post('/product', formidable(), async function (req, res){
      const {productid, title, price, description, category, quantity} = req.fields
      if (! (productid && title && price && description && category && quantity)){
          res.status(400).send('Provide all the inputs of product')
      }
      else{
          if (await product.findOne({productid})){
              res.send("product already exist")
          }
          else{
  
              let data = await product.create({
                productid: req.fields.productid,
                  title:  req.fields.title,
                  price:  req.fields.price,
                  description:  req.fields.description,
                  category: req.fields.category,
                  
              }); 
                          
  
              
             res.json(data)
             
          }        
      }
  })



app.get("/getproduct",(req, res)=>{
    product.find({}).then(function(product){
        res.json(product)

        
    }).catch(function(err){
        console.log(err)
    })

    
})





// Update a product by ID
app.put('/updateproduct/:id', async (req, res) => {
    try {
      const updatedProduct = await product.findByIdAndUpdate(
        req.params.id,
        req.body,

        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


  // Delete a product by ID
app.delete('/deleteproduct/:id', async (req, res) => {
    try {
      const deletedProduct = await product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(deletedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });




//   const express = require('express');
// const router = express.Router();
// const Order = require('../models/orderModel');



// Create a new order
app.post('/order', async (req, res) => {
  try {
    const { userid, products, totalprice, fullAdderss } = req.body;
    const order = new Order({ userid, products, totalprice, fullAdderss });
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all orders
app.get('/getorder', async (req, res) => {
  try {
    const order = await Order.find();
    res.json(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update order status
app.put('/updateorder/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updateorder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Returns the modified document
    );

    if (!updateorder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updateorder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

 // Delete a order by ID
 app.delete('/deleteorder/:id', async (req, res) => {
  try {
    const deleteorder = await Order.findByIdAndDelete(req.params.id);
    if (!deleteorder) {
      return res.status(404).json({ error: 'order not found' });
    }
    res.json(deleteorder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});






// Create a new cart
app.post('/cart', async (req, res) => {
  try {
    const { userid, products,  } = req.body;
    const carts = new Cart({ userid, products});
    await carts.save();
    res.json(carts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all orders
app.get('/cart', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update cart status
app.put('/cart/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const { status } = req.body;

    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { status },
      { new: true } // Returns the modified document
    );

    if (!cart) {
      return res.status(404).json({ message: 'order not found in cart' });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


 // Delete a product by ID
 app.delete('/deleteCart/:id', async (req, res) => {
  try {
    const deletedCart = await product.findByIdAndDelete(req.params.id);
    if (!deletedCart) {
      return res.status(404).json({ error: 'order not found in cart ' });
    }
    res.json(deletedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});








app.listen(PORT, ()=> console.log(`Project is running at ${PORT} port`))











// const express = require('express');
// const router = express.Router();
// const Order = require('../models/orderModel');































// app.post("/requestPassworReset",(req, res)=> {
//     const {email, redirectUrl} = req.body;


//     user
//     .find({email})
//     .then((data)=>{
//         if (data.length){
//             // user exists


//         // check if user is verified
//         if(!data[0].verified){
//             res.json({
//                 status:"FAILED",
//                 message:"An error occurred while checking for existing user",
//             });

//         }else{
//             // proceed with email to reset passsword
//             sendResetEmail(data[0], redirectUrl, res);
//         }

//         }else{
//             res.json({
//                 status:"FAILED",
//                 message:"An error occurred while checking for existing user",
//             });

//         }
//     })
//     .catch(error =>{
//         console.log(error);
//         res.json({
//             status:"FAILED",
//             message:"An error occurred while checking for existing user",
//         });
//     })

// })

// // send password reset email

// const  sendResetEmail =({_id, email}, redirectUrl, res)=>{
// const resetString = uuidv4 + _id;
// // First, we clear all existing reset records
// passwordReset
// .deleteMany({ userId: _id})
// .then(result =>{
//     // Reset records deleted successfully
//     // Now we send the email
//     const mailOptions ={
//         from: process.env.AUTH_EMAIL,
//         to: email,
//         subject: "Verify your Email",
//         html: `<p>Verify your Email address to complet the signup and login into your account.</p>
//         <p>this link <b>expires in 6 hours</b>.</p><p>Press <a href=${redirectUrl+"/" +_id+ "/" + resetString}>here</a> to proceed.</p>`
//     };
//     const saltRounds=10;
//     bcrypt
//     .hash(resetString, saltRounds)
//     .then(hashedResetString=>{
//         // set values in password reset collection
//          const newPasswordReset = new passwordReset({
//             userId: { type: String, default: '' },
//             resetString: hashedResetString,
//             createdAt: Date.now(),
//             expiresAt: Date.now() + 3600000
//          });
//          newPasswordReset
//          .save()
//          .then(()=>{
//             transporter.sendMail(mailOptions)
//             .then(()=>{
//                 // reset email sent and password reset record saved
//                 res.json({
//                     status: "PENDING",
//                     message: "Password reset email sent",
//                 })
//             })
//             .catch(error=>{
//                 console.log(error);
//                 res.json({
//                 status:"FAILED",
//                 message:"An error password set mail failed",
//             });

//             })
//          })
//          .catch(error=>{
//             console.log(error);
//             res.json({
//                 status:"FAILED",
//                 message:"An error occurred while reset password error at database",
//             });

//          })
//     })
//     .catch(error=>{
//         console.log(error);
//         res.json({
//             status:"FAILED",
//             message:"An error occurred while reset password error at database",
//         });

//     })
// })
// .catch(error =>{
//     // error while clearing existing records
//     console.log(error);
//     res.json({
//         status:"FAILED",
//         message:"An error occurred while checking for existing user",
//     });
    
// });
// }







