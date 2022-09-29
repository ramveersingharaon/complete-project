const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{
    console.log("The connection is successfully")
}).catch(()=>{
    console.log("The connection is not successfully")
});
