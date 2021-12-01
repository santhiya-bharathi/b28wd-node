// console.log("hello");

// const sum = (a,b) => a+b;
// console.log(sum(4,5));

// const num1 = process.argv[2];
// const num2 = process.argv[3];

// console.log(process.argv);
// console.log(sum(+num1, +num2));
//sum the value in terminal (code)


// we can destructure the process.argv 
// const [,,num1,num2]= process.argv;
// console.log(sum(+num1, +num2));



// const express = require("express"); "type":"common.js",
import express from "express"; //"type":"module",
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { getMovies, createMovies, getMoviesById, deleteMoviesById, editMoviesById } from "./helper.js";
import {moviesRouter} from "./routes/movies.js";

dotenv.config(); // all keys it will put in process.env

const app = express();
const PORT = process.env.PORT;

app.use("/movies",moviesRouter);

//middleware
app.use(express.json()); // every request in the app body is parsed as json
//express.json() - inbuilt middleware

//below code for making connection

// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

// mongodb+srv://santhiya:<password>@cluster0.oxb2g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// here we are going to make connection between node and mongodb
 async function createConnection(){
	 const client =  new MongoClient(MONGO_URL) // this new for avoid (some time) because conection takes some time
	 client.connect();  // it returns promise (this step takes some time to connect the database so we can do either async await or .then)
	 console.log("Mongodb Connected");
	 return client;
 }
 //call the function
 //this is for got the client
 export const client = await createConnection();

app.get("/",(request,response)=>{
    response.send("hello happy world");
});



app.listen(PORT,()=>console.log("app is started in",PORT));


