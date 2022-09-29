require('dotenv').config()
const express = require('express');
const app = express();
require("./db/conn");
const Register = require("./models/register")
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt")
const cookie_parser = require("cookie-parser");
const auth = require("./middleware/auth")



const port = process.env.PROT | 3000;

app.use(express.json());
app.use(cookie_parser());
app.use(express.urlencoded({ extended: false }))

// serving static file 
const static_path = path.join(__dirname, "../public")
app.use(express.static(static_path));

// serving views file 
const views_path = path.join(__dirname, "../templates/views")
app.set("view engine", "hbs")
app.set("views", views_path)

// serving partials file
const partials_path = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partials_path);


// get methode request 
app.get("/", (req, res) => {
    res.render("index");
})
app.get("/register", (req, res) => {
    res.render("register");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/secret",auth ,(req, res) => {
    // console.log(` this is cookies awesome ${req.cookies.jwt}`)
    res.render("secret");
})


app.get("/logout",auth, async (req, res) => {
    try {
        console.log(req.user);

        // Logout single device 
        //Here we will use filter method
        req.user.tokens = req.user.tokens.filter((currentElement)=>{
            return currentElement.token !== req.token // IN HINDI (ONE BISMAY SUCHAK AND TWO BARABR)
        })

        // Logout from All Device 
        req.user.tokens= [];



        res.clearCookie("jwt");
        console.log("logout Succcessfully");

        await req.user.save();  //This user get we auth.js user= res.user
        res.render("login");
        
    } catch (error) {
        res.status(500).send(error);
    }
})


app.get("/about", (req, res) => {
    res.render("about");
})
app.get("/contact", (req, res) => {
    res.render("contact");
})
app.get("/account", (req, res) => {
    res.render("account");
})
//===================post methode request ==================\\
// =============================here userdata is a  instance of Register===========
//From Registration
app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const userdata = new Register({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            });
                console.log("the sucess part"+ userdata)

            const token = await userdata.generateAuthToken();
            console.log("the token part"+ token)
            //The res.cookie() Take to parameter first cookies and second cookies value.
            //The value perameter may be a string or object converted to JSON.
            res.cookie("jwt",token, {
                expires:new Date(Date.now() + 60000),
                httpOnly:true
            // secure:true (use https production version)

            });



            const savedata = await userdata.save();
            console.log("the page part"+ token)
            res.status(201).render("index")
        } else {
            res.status(400).send("password are not matching")
        }

    } catch (error) {
        res.status(400).send("invalid Detail")
    }
});


// =============================here userdata is a  instance of Register===========
//From Login
app.post("/login", async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;

        const userdata = await Register.findOne({ email: email });
        const token = await userdata.generateAuthToken();
        console.log("This is login token" + token)
        
        const isMatch = await bcrypt.compare(password, userdata.password);

        res.cookie("jwt",token, {
            expires:new Date(Date.now() + 60000),
            httpOnly:true
            // secure:true (use https production version)
        });


        
        if (isMatch){
            res.status(201).render("index")
        }else{
            res.send("invalid Password Details")
        }


    } catch (error) {
        res.status(400).send("Invalid login detail")
    }

});

app.listen(port, () => {
    console.log(`The server is running no ${port}`);
})