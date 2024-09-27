const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path')  // for path connection
const session = require('express-session')
const flash=require('connect-flash')
const passport=require('passport');
const passportLocal=require('passport-local')
const User=require('./models/user');
const {isLoggedIn}=require('./middleware/middleware');
const Employee=require('./models/employee');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate=require('ejs-mate');
const { log } = require('console');


app.set('view engine','ejs'); // setting up ejs as template
app.set('views', path.join(__dirname,'views')) // joining directory to views
app.use(express.static(path.join(__dirname,'public'))); // for static file
app.use(express.urlencoded({extended:true})); //to parse post request  html/url encoded data
app.use(express.json()); //parse post request json data
app.engine('ejs',ejsMate);

// -----------------xxx---------------xxx--------------------------xxx--------------------
const mongo_URL="mongodb://127.0.0.1:27017/dealsdray";


main().then(()=>{
    console.log('conected to db');
    
})
.catch((err)=>{
    console.log(err);
    
})

async function main() {
   await mongoose.connect(mongo_URL)
    
}

// --------------------xx-----------------------xx----------------------------
const sessionoption={
    // store,
    secret:'superSecretcode',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000
    },
    httpOnly:true
}

app.use(session(sessionoption));
app.use(flash());
// -----------------------------------------------------------xxxxx-------------------------

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    res.locals.successMsg=req.flash('success');
    res.locals.errorMsg=req.flash('error');
    res.locals.currentUser=req.user;
    // console.log(res.locals.currentUser);
    
    next();
})


app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// ------------------------xxxxx-------------------------------
// home route

app.get('/',(req , res)=>{
    
    res.redirect('/home')
})
app.get('/home',async (req,res)=>{
    
    let employees=await Employee.find();
    res.render('./body/index.ejs', {employees})
})
app.get('/edit/:id',async(req,res)=>{

    let {id}=req.params;
    let employee=await Employee.findById(id);
    if(!employee){
        req.flash('error',"Employee doesn't exist!")
        return res.redirect('/home');
    }
        res.render('./body/edit.ejs',{employee})
})
app.patch('/home/:id',async(req,res)=>{
    let {id}=req.params;
    let employee= req.body.employee;
    // console.log(listing.title);
    await Employee.findByIdAndUpdate(id, {$set:{name:employee.name,email:employee.email,contact:employee.contact,designation:employee.designation,gender:employee.gender,course:employee.course}})
    req.flash("success","Successfully! employee details updated");
    res.redirect('/home');
})
app.delete('/home/:id',async(req,res)=>{
    let {id}=req.params;
    await Employee.findByIdAndDelete(id);
    req.flash("success","Successfully! employee deleted");
    res.redirect('/home');
})


// .............................search.......................

app.post('/search',async(req,res)=>{
let searchQuery=req.body.q;
    // console.log(searchQuery);
    
    // let employee=await Employee.findOne({email});
    const employees = await Employee.find({ $or: [
        { course: searchQuery },
        { name: searchQuery },
        { gender: searchQuery },
        { email: searchQuery },
        { designation: searchQuery }
      ]});
    // console.log(employees);
    if(!employees){
        req.flash('error',"Employee doesn't exist!")
        return res.redirect('/home');
    }
    res.render('./body/index.ejs',{employees})
    
})
// -------------------------xxx-------------------------xx

// for login route
app.get('/login',(req,res)=>{
    res.render('./body/login.ejs')
})

app.post('/login', 
    passport.authenticate('local', 
        { failureRedirect: '/login',failureFlash:true }),
(req,res)=>{
    req.flash('success',"Welcome back! You logged in")
    res.redirect('/home');
})

app.get('/logout',isLoggedIn,(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }
        req.flash('success',"Successfully! logged Out");
        res.redirect('/home')
    })
})

// ----------------------------xx-------------------------------xx---------------------
// for sign Up route
app.get('/signup',(req,res)=>{
    res.render('./body/signup.ejs')
})

app.post('/signup',async (req,res)=>{
    try {
     let{username,email,password}=req.body
     let newUser=new User({username,email});
     // console.log(newUser);
     let resultUser=await User.register(newUser,password);
    //  console.log(resultUser);
     
    } catch (error) {
     req.flash('error',error.message)
    return  res.redirect('/signup');
    }
     req.flash('success',"registred Successfully!");
     res.redirect('/home');
 
 })

// ----------------------xxx----------------------------xxx-------------------
// for event registration
app.get('/registration',isLoggedIn,(req,res)=>{
    res.render('./body/createEmployee.ejs')
})
app.post('/registration',isLoggedIn,async(req,res)=>{
    try {
        let employee=req.body.employee;
        // console.log(listing);
        let  newEmployee= new Employee({
            name: employee.name,
            email:
            employee.email,
            contact:
            employee.contact,
            designation:
            employee.designation,
            gender:
            employee.gender,
            course:
            employee.course,
            // image: {
            //   filename: "employeeImage",
            //   url: employee.url,
            // },
            
        });
    // console.log(newEventUser);
    console.log(newEmployee);
    await newEmployee.save();
    req.flash('success',"Employee Created Successfully!")
    res.redirect('/home');
    } catch (error) {
       req.flash('error',error.message)
       res.redirect('/home');
    }
})




app.use((err,req,res,next)=>{
    console.log("-----------error------------------");
    let {status=500, message='some error occured'}=err;
    res.status(status).send(message);
    res.send(err);
    // next(err);
})


app.listen(8085,()=>{
    console.log('app is listening to port 8085');
    
})