const knex = require("../db/connection");

async function attachMovies(theater) {
    theater.movies = await knex("movies")
        .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
        .where({ "movies_theaters.theater_id": theater.theater_id });
    return theater;
}

function list() {
    return knex("theaters").then(theaters => {
        return Promise.all(
            theaters.map(theater => {
                return attachMovies(theater);
            })
        );
    });
}

function listByMovie(movieId) {
    return knex("theaters")
        .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
        .select("theaters.*", "movies_theaters.is_showing", "movies_theaters.movie_id")
        .where({ movie_id: movieId });
}

module.exports = {
    list,
    listByMovie,
};