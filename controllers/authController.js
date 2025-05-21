const { check, validationResult } = require('express-validator');
const User=require('../models/userModel')
const bcrypt=require('bcryptjs')
exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{
        title:"Login",
        isLoggedIn:false,
         errors: [],
        oldInput: { email: "" },
        user:{}
    })
}

exports.postLogin=async(req,res,next)=>{
    // res.cookie("isLoggedIn",true)
    const {email,password}=req.body
    const user=await User.findOne({email});
    if(!user){
        return res.status(422).render("auth/login",{
            title:"Login",
            isLoggedIn:false,
            errors:["User does not exist"],
            oldInput:{email},
            user:{}
        })
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(422).render("auth/login",{
            title:"Login",
            isLoggedIn:false,
            errors:["Incorrect passsword"],
            oldInput:{email},
            user:{}
        })
    }
    req.session.isLoggedIn=true
    req.session.user=user 
    await req.session.save()
    res.redirect('/')
}

exports.postLogout=(req,res,next)=>{
    req.session.destroy(()=>{     
        res.redirect('/login')
    })
}

exports.getSignup=(req,res,next)=>{
    res.render('auth/signUp',{
        title:"SignUp",
         isLoggedIn:false,
         errors:[],
         oldInput:{firstName:"",email:"",gender:""},
         user:{}
        })
    }

exports.postSignup=[check("firstName")
    .trim()
    .isLength({min:2})
    .withMessage("First name should be atleast 2 character long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name must contain only letters"),
    
    check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("First name must contain only letters"),

    check("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),
    
    check("password")
    .isLength({min:6})
    .withMessage("Please enter a long password atleast 6 character")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    .matches(/[!@#$%&]/)
    .withMessage("Password should contain atleast one speacial character")
    .trim(),

    check("confirmPassword")
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match"); 
    }
    return true;
  }),
    check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(['Guest','Host'])
    .withMessage("Invalid user type"),

    check("term")
    .notEmpty()
    .withMessage("Please accept the terms and condition")
    .custom((value,{req})=>{
        if(value!='on'){
            throw new Error("Please accept the terms and condition")
        }
        return true
    }),



    
    (req,res,next)=>{
        // res.cookie("isLoggedIn",true)
        // req.session.isLoggedIn=true
        const{firstName,lastName,email,password,userType}=req.body
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).render("auth/signUp",{
                title:"Signup",
                isLoggedIn:false,
                errors:errors.array().map(arr=>arr.msg),
                oldInput:{firstName,lastName,email,password,userType},
                user:{}
            })
        }
        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user=new User({firstName,lastName,password:hashedPassword ,email,userType})
            return user.save()
        })
        .then(()=>{
            res.redirect('/login')
        })
        .catch(err=>{
            console.log("Error while saving user",err);
            return res.status(422).render("auth/signUp",{
                title:"Signup",
                isLoggedIn:false,
                errors:[err.message],
                oldInput:{firstName,lastName,email,password,userType},
                user:{}
            })
        })    
    }]