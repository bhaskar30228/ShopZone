const fs=require('fs')
const Product = require("../models/product");
const Home = require("../models/product");
const User=require('../models/userModel')
exports.getAddProducts=(req,res,next)=>{
    res.render('host/editProducts',
        {title:"Add products",
        editing:false,
        isLoggedIn:req.session.isLoggedIn,
        user:req.session.user
    })
}

exports.postHostProduct=(req,res,next)=>{
    const { productName,price,sellerName}=req.body;
    console.log();
    console.log(req.file);
    if(!req.file){
        return res.status(422).send("No image provided")
    }
    const photo=req.file.path
    const product=new Product({productName,price,sellerName,photo})
    product.save().then(()=>{
        console.log("home saved successfully");  
    })
    res.redirect('/host/host-products')
}

exports.getHostProducts=(req,res,next)=>{
    Home.find().then(registeredProducts=>
        res.render('host/hostProduct',{registeredProducts:registeredProducts,title:"Host products page",isLoggedIn:req.session.isLoggedIn,user:req.session.user})
    );
}
exports.getHomePage=(req,res,next)=>{
    console.log("Session value",req.session);
    
    Home.find().then(registeredProducts=>
        res.render('store/home',{registeredProducts:registeredProducts,title:"Home page",isLoggedIn:req.session.isLoggedIn,user:req.session.user})
    );
}

exports.getBooking=(req,res,next)=>{
    Home.find().then(registeredProducts=>{
        res.render('store/order',{
            registeredProducts:registeredProducts,
            title:"Booking",
            isLoggedIn:req.session.isLoggedIn,
            user:req.session.user
        })
    })
    
}
exports.getHomes=(req,res,next)=>{
    Home.find().then(registeredProducts=>{
        res.render('store/homes',{
            registeredProducts:registeredProducts,
            title:"Homes page",
            isLoggedIn:req.session.isLoggedIn,
            user:req.session.user
        })
    })
}

exports.useError=(req,res,next)=>{
    res.render('error',{title:'error page',isLoggedIn:req.session.isLoggedIn,user:req.session.user}  
    )
}

exports.getProductDetails=(req,res,next)=>{
    const productID=req.params.productId;
    console.log("At product detail page",productID)
    Home.findById(productID).then(product=>{
        if(!product){
            console.log("Product not found");          
            res.redirect("/homes")
        }else{       
            res.render("store/product-details",{
                product:product,
                title:"Product details",
                isLoggedIn:req.session.isLoggedIn,
                user:req.session.user
            })
        }
    })
}

exports.getFav=async (req,res,next)=>{
    const userId=req.session.user._id;
    const user=await User.findById(userId).populate('favorite')
         res.render('store/favorite',
             {favProducts:user.favorite,title:"favProduct",isLoggedIn:req.session.isLoggedIn,user:req.session.user}
         )
}
exports.postFav=async (req,res,next)=>{
    const productId=req.body.id
    const userId=req.session.user._id
    const user=await User.findById(userId)
    if(!user.favorite.includes(productId)){
        user.favorite.push(productId)
        await user.save()
    }
        res.redirect('/favourites')
}

exports.getEditProducts=(req,res,next)=>{
    const productId=req.params.homeId;
    const editing=req.query.editing==='true';
    Home.findById(productId).then(product =>{
        if(!product){
        console.log("Home not found for ed iting");
        return res.redirect('/host/hostProduct')
        }
        console.log(productId,editing,product); 
        res.render('host/editProducts',{title:"Edit products",
        product:product,
        editing:editing,
        isLoggedIn:req.session.isLoggedIn,
        user:req.session.user
    })
    })
}

exports.postEditProducts=(req,res,next)=>{
    const {id,productName,price,sellerName}=req.body;
    Product.findById(id).then((product)=>{
        product.productName=productName;
        product.price=price;
        product.sellerName=sellerName;
        if(req.file){
            fs.unlink(product.photo,(err)=>{
                if(err){
                    console.log("Erroe while deleting file",err);     
                }
            })
            product.photo=req.file.path       
        }
        product.save().then(result=>{
            console.log('Home updaated',result);  
        }).catch(err=>{
            console.log("Error while updating",err);
        })
        res.redirect('/host/host-products')
    }).catch(err=>{
        console.log("Error while finding home",err);
        
    })
}


exports.postDelete=(req,res,next)=>{
    const productId=req.params.productId;
    console.log("Came to delete");
    Product.findByIdAndDelete(productId).then(()=>{
        res.redirect('/host/host-products') 
    }).catch(error=>{
        console.log('Error while deleting',error);       
    })
}
exports.postRemoveFromFav=async (req,res,next)=>{
 const productId=req.params.productId
 const userId=req.session.user._id
 const user=await User.findById(userId)
 if(user.favorite.includes(productId)){
    user.favorite=user.favorite.filter(fav=>fav!=productId)
    await user.save()
 }res.redirect('/favourites')
}

