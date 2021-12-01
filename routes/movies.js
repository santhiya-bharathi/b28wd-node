
import express from "express"; 
const router = express.Router();
import { getMovies, createMovies, getMoviesById, deleteMoviesById, editMoviesById } from "../helper.js";



router
    .route("/")
    .get(async (request,response)=>{
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
      })
    .post(async (request,response)=>{
const data = request.body;
// create movies - db.movies.insertMany(data)
const result = await createMovies(data);
response.send(result);
      });

// this is creating query and the data we getting from mongodb(database) in postman
router
    .route("/:id")
    .get(async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	//db.movies.findOne({id:"102"})
	const movie = await getMoviesById(id)
    // const movie = movies.find((mv)=>mv.id === id);
    console.log(movie);

    movie? response.send(movie) : response.status(404).send({message:"no matching movie found"});
     })
    .delete(async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const result = await deleteMoviesById(id)
    console.log(result);

    result.deletedCount>0? response.send(result) : response.status(404).send({message:"no matching movie found"});
     })
    .put(async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const data = request.body;
	//db.movies.updateOne({id:id},{$set:data})
	const result = await editMoviesById(id, data);
	const movie = await getMoviesById(id);
    console.log(result);
	response.send(movie);
    });

export const moviesRouter = router;