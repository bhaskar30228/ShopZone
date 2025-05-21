
/*


this.productName=productName;
this.price=price;
this.sellerName=sellerName;
this.photo=photo;
if(_id){
    this._id=_id
}

 static fetchAll
 save
 fetchById
 deleteById
*/


const mongoose=require('mongoose')
const productSchema=mongoose.Schema({
    productName:{type:String,required:true},
    price:{type:String,required:true},
    sellerName:{type:String,requred:true},
    photo:{type:String,requred:true}
})

productSchema.pre('findOneAndDelete',async function(next){
    const productId=this.getQuery()._id;
    await favorite.deleteMany({productId:productId});
    next()
})

module.exports=mongoose.model('Product',productSchema)
