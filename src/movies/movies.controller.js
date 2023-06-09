const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//GET /movies
async function list(req, res) {
    let movies;
    if(req.query.is_showing) {
        movies = await service.listMoviesShowing();
    } else {
        movies = await service.list();
    }
    res.json({ data: movies });
}

//for /:movieId/reviews & /:movideId/theaters
async function movieExists(req, res, next) {
    const { movieId } = req.params;
    const movie = await service.read(movieId);
    if( movie ) {
        res.locals.movie = movie;
        return next();
    } else {
        next({ status: 404, message: "Movie cannot be found." });
    }
}

//GET for /movies/:movieId
function read(req, res, next) {
    res.json({ data: res.locals.movie });
}

module.exports = {
    list: asyncErrorBoundary(list),
    movieExists: asyncErrorBoundary(movieExists),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
}