const express=require("express");
const app=express();
const dotenv=require("dotenv");
dotenv.config({path:".env"});
console.log("your file",process.env.PORT)
const bodyParser=require("body-parser")
const cookieParser =require("cookie-parser");
const cors=require("cors")
const allowedOrigins = ["http://localhost:3000", "https://vega-shakir-ansaris-projects.vercel.app"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));//Handling binary Data in server
app.use(express.json());//handling the json Data on Server
app.use(cookieParser());// handling the cookie
const errormiddleware=require("./backend/middleware/error")
app.get('/',(req,res,next)=>{
  res.send("<h1>Yahooo  serverUp and running VEGA6<h1/>")
})

app.use("/api/v1/",require("./backend/Route/userRoute"));// directing route to user Route
app.use("/api/v1/",require("./backend/Route/blogRoute"));// directing  route to surveyRoute
//middleware for the Error
app.use(errormiddleware);
module.exports=app;

