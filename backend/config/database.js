const mongoose=require("mongoose")



const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI,{   // connecting the express with mongodb db database using mongoose
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    }).then((data)=>{
        console.log("connected to the database",data.connection.host);
    })
}

module.exports=connectDatabase;