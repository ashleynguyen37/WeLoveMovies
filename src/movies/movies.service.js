const knex = require("../db/connection");

function list() {
    return knex("movies").select("*");
}

function listMoviesShowing() {
    return knex("movies")
        .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
        .select("movies.*", "movies_theaters.is_showing")
        .groupBy("movies.movie_id")
        .where({ is_showing: true });
}

function read(movieId) {
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId })
        .first();
}

module.exports = {
    list,
    listMoviesShowing,
    read,
}