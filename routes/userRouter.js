//External
const express=require('express')
const path=require('path')

//local
const rootDir=require('../util/pathUtil')
const productController=require('../controllers/products')

const userRouter=express.Router()


userRouter.get('/',productController.getHomePage)
userRouter.get('/favourites',productController.getFav)
userRouter.get('/bookings',productController.getBooking)
userRouter.get('/homes',productController.getHomes)
userRouter.get('/homes/:productId',productController.getProductDetails)
userRouter.post('/favourites',productController.postFav)
userRouter.post('/favourites/delete/:productId', productController.postRemoveFromFav)


module.exports=userRouter
