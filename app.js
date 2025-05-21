const express=require('express')
const path=require('path')
const rootDir=require("./util/pathUtil")
const mongoose=require('mongoose')
const session=require('express-session')
const MongoDbStore=require('connect-mongodb-session')(session)
const Db_Path="mongodb+srv://Bhaskar:9mq2vhvm@cluster0.83acb5s.mongodb.net/shopZone"
const multer=require('multer')
//local

const hostRouter=require('./routes/hostRouter')
const userRouter=require('./routes/userRouter')
const authRouter=require('./routes/authRouter')
const app=express()
app.set('view engine', 'ejs');
app.set('views', 'views');
const store=new MongoDbStore({
    uri:Db_Path,
    collection:'sessions'
})

app.use(session({
    secret:"Bhaskar & Mansi forever",
    resave:false,
    saveUninitialized:true,
    store
}))
const productController=require('./controllers/products')

const randomString=(length)=>{
    const characters="abcdefghijklmnopqrstuvwxyz"
    let res=''
    for(let i=0;i<length;i++){
        res+=characters.charAt(Math.floor(Math.random()*characters.length))
    }
    return res
}
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null, randomString(10) + '-' + file.originalname)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==="image/png" ||file.mimetype==="image/jpg" ||file.mimetype==="image/jpeg"){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const multerOptions={
    storage,fileFilter
}

app.use(express.urlencoded())
app.use(multer(multerOptions).single('photo'))
app.use(express.static('public'));
app.use("/uploads",express.static(path.join(rootDir,"uploads")))
app.use("/host/uploads",express.static(path.join(rootDir,"uploads")))
app.use("/homes/uploads",express.static(path.join(rootDir,"uploads")))
app.use((req,res,next)=>{
    console.log("Cookie check middleware",req.get('Cookie'));
    req.isLoggedIn=req.session.isLoggedIn;
    next()
})
app.use(userRouter)

app.use('/host',(req,res,next)=>{
    if(req.session.isLoggedIn){
        next();
    }else{
        res.redirect('/login')
    }
})
app.use('/host',hostRouter)
app.use(authRouter)

app.use(productController.useError)

const PORT=3030
    
mongoose.connect(Db_Path).then(()=>{
    console.log("Connected to mongo");
    
    app.listen(PORT,()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
             })
        }).catch(err=>{
    console.log("Error while connecting to mongo",err);  
})