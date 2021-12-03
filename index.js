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
import express, { response } from "express"; //"type":"module",
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";  
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config(); // all keys it will put in process.env

const app = express();
const PORT = process.env.PORT; //heroku will auto assign available port


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

const auth = (request, response, next) => {
	try{
		const token = request.header("x-auth-token");
		console.log("token", token);
		jwt.verify(token, process.env.SECRET_KEY);
		next();
	}catch (err) {
response.status(401).send({error: err.meassage});
	}
};




app.get("/",(request,response)=>{
    response.send("hello happy world");
});

app.get("/movies", auth, async (request,response)=>{
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

app.post("/movies",  auth, async (request,response)=>{
const data = request.body;
// create movies - db.movies.insertMany(data)
const result = await createMovies(data);
response.send(result);
});

// this is creating query and the data we getting from mongodb(database) in postman
app.get("/movies/:id",  auth, async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	//db.movies.findOne({id:"102"})
	const movie = await getMoviesById(id)
    // const movie = movies.find((mv)=>mv.id === id);
    console.log(movie);

    movie? response.send(movie) : response.status(404).send({message:"no matching movie found"});
});

app.delete("/movies/:id",  auth, async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const result = await deleteMoviesById(id)
    console.log(result);

    result.deletedCount>0? response.send(result) : response.status(404).send({message:"no matching movie found"});
});

app.put("/movies/:id",  auth, async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const data = request.body;
	//db.movies.updateOne({id:id},{$set:data})
	const result = await editMoviesById(id, data);
	const movie = await getMoviesById(id);
    console.log(result);
	response.send(movie);
});

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
 // for database code
async function createUser(data) {
	return await client.db("b28wd").collection("users").insertOne(data);
}

async function getUserByName(username) {
	return await client
		.db("b28wd")
		.collection("users")
		.findOne({ username: username });
}



async function genPassword(password){
	const NO_OF_ROUNDS = 10;
	const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
	console.log(salt);
	const hashedPassword = await bcrypt.hash(password, salt);
	console.log(hashedPassword);
	return hashedPassword;
}

// genPassword("password@123");

app.post("/signup", async (request,response)=>{
	// const data = request.body;
	// create movies - db.movies.insertMany(data)
	// const result = await createMovies(data);
	// console.log(data);
	// response.send(data); let's see in console and postman username and password
	// response.send({ username, password:hashedPassword });  //using this comment we can see hash password
	const {username, password} = request.body;
	const userFromDB = await getUserByName(username);
console.log(userFromDB);

//check for user exist in db
if(userFromDB){
	response.status(400).send({message: "username already exists"});
	return;
}

if(password.length < 8){
	response.status(400).send({message: "password must be longer"});
	return;
}
//pattern
// if(!/^(?+.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g.test(password)){
// 	response.status(400).send({message: "password pattern does not match"});
// 	return;
// }

	const hashedPassword = await genPassword(password); // genpassword is async so we need to await it
	const result = await createUser({ username, password:hashedPassword });
	response.send(result);   // it's creating username and password but again it's creating same username but it should not create (post)
	});

app.post("/login", async (request,response)=>{
	const {username, password} = request.body;
	const userFromDB = await getUserByName(username);

// check for username
	if(!userFromDB){
		response.status(401).send({message: "Invalid Credentials"});
		return;
	}

	// if password is match then
	// if we code like this hacker didn't know whether the password wrong or username wrong it's only give the {message: "Invalid Credentials"}
	const storedPassword = userFromDB.password;
	console.log(storedPassword);

	const isPasswordMatch = await bcrypt.compare(password, storedPassword);

	console.log(isPasswordMatch);
	console.log(userFromDB);

	if (isPasswordMatch) {
		const token = jwt.sign({id: userFromDB._id}, process.env.SECRET_KEY); // hide secret key
		response.send({message: "sucessful login", token: token});
	}else{
		response.status(401).send({message: "Invalid Credentials"});
	}

	// response.send(userFromDB);
});




app.listen(PORT,()=>console.log("app is started in",PORT));