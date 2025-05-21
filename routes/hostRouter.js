//External
const express=require('express')

//local
const hostRouter=express.Router()
const productController=require('../controllers/products')

hostRouter.get('/add-products',productController.getAddProducts)

hostRouter.get('/host-products',productController.getHostProducts)

hostRouter.post('/host-products',productController.postHostProduct)

hostRouter.get('/edit-products/:homeId',productController.getEditProducts)

hostRouter.post('/edit-products',productController.postEditProducts)

hostRouter.post('/delete-product/:productId',productController.postDelete)

module.exports=hostRouter
