import express,{Express} from 'express';
const app = express();
import dotenv from 'dotenv' 
dotenv.config();
import mongoose from "mongoose";
import postRouter from "./routes/post_routes" 
import commentRouter from "./routes/comment_routes"
import userRouter from "./routes/user_routes" 
import authRouter from "./routes/auth_routes"
import bodyParser from "body-parser";
import swaggerJsDoc from 'swagger-jsdoc';   
import swaggerUI from 'swagger-ui-express';
import fileRoute from "./routes/file_route";
import groqRouter from "./routes/groq_routes";
import path from "path";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use('/posts',postRouter)
app.use('/comments',commentRouter)
app.use('/users',userRouter)
app.use('/auth',authRouter)
app.use("/file", fileRoute);
app.use("/ai", groqRouter);
app.use("/public", express.static("public"));
app.use("/storage", express.static("storage"));
app.use(express.static("front"));

app.use(express.static(path.join(__dirname, '../front')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front', 'index.html'), (err) => {
      if (err) {
          res.status(500).send(err);
      }
  });
});

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error:"));
db.once("open",function(){
    console.log("connected to the database");
})

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Dev 2025 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
      },
      servers: [{ url: "https://node80.cs.colman.ac.il" },{ url: "http://localhost:3060" }],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  
const initApp = () => {
    return new Promise<Express>( (resolve,reject) =>{
        if(process.env.DB_CONNECT == undefined) {
        console.log("DB_CONNECT IS IS UNDEFINED")
        reject("DB_CONNECT is not defined in .env file");
    } else {
        mongoose.connect(process.env.DB_CONNECT).then(()=>{
            resolve(app)
        }).catch((error) => {
            reject(error);
          });
       }
    })
}

export default initApp

