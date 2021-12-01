import { client } from "./index.js";

 async function editMoviesById(id, data) {
	return await client
		.db("b28wd")
		.collection("movies")
		.updateOne({ id: id }, { $set: data });
}
 async function deleteMoviesById(id) {
	return await client
		.db("b28wd")
		.collection("movies")
		.deleteOne({ id: id });
}
 async function createMovies(data) {
	return await client.db("b28wd").collection("movies").insertMany(data);
}
 async function getMoviesById(id) {
	return await client
		.db("b28wd")
		.collection("movies")
		.findOne({ id: id });
}
 async function getMovies(filter) {
	return await client
		.db("b28wd")
		.collection("movies")
		.find(filter)
		.toArray();
}

export { getMovies, createMovies, getMoviesById, deleteMoviesById, editMoviesById };