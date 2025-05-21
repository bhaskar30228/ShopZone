const mongoose=require('mongoose')
const userModelSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"first name is required"],
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:[true,"email is required"],
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    userType:{
        type:String,
        enum:['Guest','Host'],
        default:"Guest"
    },
    favorite:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]
})

module.exports=mongoose.model('User',userModelSchema)