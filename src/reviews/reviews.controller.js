const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//DELETE /reviews/:reviewId
function destroy(req, res, next) {
    service.delete(res.locals.review.review_id)
        .then(() => res.sendStatus(204))
        .catch(next); 
}

//GET /reviews
async function list(req, res) {
    const { movieId } = req.params;
    const reviews = await service.listByMovieId(movieId);

    res.json({ data: reviews });
}

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const review = await service.readByReviewId(reviewId);

    if(review) {
        res.locals.review = review;
        return next();
    } else {
        next({
            status: 404,
            message: "Review cannot be found."
        });
    }
}

const requiredProperties = ["score", "content"];

function hasRequiredProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter(
        field => !requiredProperties.includes(field)
    );
    if(invalidFields.length) {
        return next({ status: 400, message: `Invalid field(s): ${invalidFields.join(", ")}` });
    }
    next();
}

//PUT /reviews/:reviewId
async function update(req, res, next) {
    const updatedReview = {
        score: req.body.data.score ? req.body.data.score : res.locals.review.score,
        content: req.body.data.content ? req.body.data.content : res.locals.review.content,
        review_id: res.locals.review.review_id,
        movie_id: res.locals.review.movie_id,
        critic_id: res.locals.review.critic_id,
        created_at: res.locals.review.created_at,
        updated_at: res.locals.review.updated_at,
    }

    service.update(updatedReview)
        .then(data => service.addCritic(updatedReview, updatedReview.critic_id))
        .then(data => res.json({ data }))
        .catch(next);
}

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), destroy],
    list: [asyncErrorBoundary(list)],
    update: [
        asyncErrorBoundary(reviewExists),
        hasRequiredProperties,
        asyncErrorBoundary(update)
    ]
}