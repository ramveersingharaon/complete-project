const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    mobile:{
        type:Number,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    confirmpassword:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

                // geterating tokens 
        // Here we can not use arrow(faat) function because (laxical this )
UserSchema.methods.generateAuthToken= async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();

        return token;
    } catch (error) {
        res.send("The error part" + error);
        console.log("The error part" + error);
    }
}

//=============converting password into the hash=========
// Here we can not use arrow(faat) function because (laxical this )
UserSchema.pre("save", async function(next){

    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.password, 10);


    }
   
    next();
})



// create Collection
const Register = new mongoose.model("Register",UserSchema);

module.exports = Register;