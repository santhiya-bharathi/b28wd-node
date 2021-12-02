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
import cors from "cors";  
import { ObjectId } from "mongodb";
dotenv.config(); // all keys it will put in process.env

const app = express();
const PORT = 9000;


app.use(cors());
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
 const client = await createConnection();

app.get("/",(request,response)=>{
    response.send("hello happy world");
});

app.get("/movies", async (request,response)=>{
    //request->query params
    console.log(request.query);
	// const {language,rating} = request.query;
	const filter = request.query;
	console.log(filter);
	if(filter.rating){
		filter.rating = +filter.rating;
	}
	//db.movies.find({language:"tamil",rating:8})
	//all the movies comment db.movies.find({})
	// .find({})
	const filterMovies = await getMovies(filter); 
	// cursor to array
	// console.log(filterMovies);
	//cursor means nothing but pagination 1 2 3 4 5 next->
	// console.log(language,rating);

	// let filterMovies = movies;

	// if(language){
	//  filterMovies = filterMovies.filter((mv)=>mv.language === language);
	// }
	// if(rating){
	// 	filterMovies = filterMovies.filter((mv)=>mv.rating === +rating);
	//    }
	   response.send(filterMovies);
});

app.post("/movies", async (request,response)=>{
const data = request.body;
// create movies - db.movies.insertMany(data)
const result = await createMovies(data);
response.send(result);
});

// this is creating query and the data we getting from mongodb(database) in postman
app.get("/movies/:id", async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	//db.movies.findOne({id:"102"})
	const movie = await getMoviesById(id)
    // const movie = movies.find((mv)=>mv.id === id);
    console.log(movie);

    movie? response.send(movie) : response.status(404).send({message:"no matching movie found"});
});

app.delete("/movies/:id", async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const result = await deleteMoviesById(id)
    console.log(result);

    result.deletedCount>0? response.send(result) : response.status(404).send({message:"no matching movie found"});
});

app.put("/movies/:id", async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const data = request.body;
	//db.movies.updateOne({id:id},{$set:data})
	const result = await editMoviesById(id, data);
	const movie = await getMoviesById(id);
    console.log(result);
	response.send(movie);
});

app.listen(PORT,()=>console.log("app is started in",PORT));

async function editMoviesById(id, data) {
	return await client
		.db("b28wd")
		.collection("movies")
		.updateOne({ _id: ObjectId(id) }, { $set: data });
}

async function deleteMoviesById(id) {
	return await client
		.db("b28wd")
		.collection("movies")
		.deleteOne({ _id: ObjectId(id) });
}

async function createMovies(data) {
	return await client.db("b28wd").collection("movies").insertMany(data);
}

async function getMoviesById(id) {
	return await client
		.db("b28wd")
		.collection("movies")
		.findOne({ _id: ObjectId(id) });
}

async function getMovies(filter) {
	return await client
		.db("b28wd")
		.collection("movies")
		.find(filter)
		.toArray();
}
