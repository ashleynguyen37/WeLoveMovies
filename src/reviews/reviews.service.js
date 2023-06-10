const knex = require("../db/connection");

async function addCritic(review, criticId) {
    review.critic = await knex("critics")
        .select("*")
        .where({ "critics.critic_id": criticId })
        .first();
    return review;
}

function destroy(reviewId) {
    return knex("reviews")
        .where({ review_id: reviewId })
        .del();
}

function listByMovieId(movieId) {
    return knex("reviews")
        .select("*")
        .where({ movie_id: movieId })
        .then(reviews => {
            return Promise.all(
                reviews.map(review => {
                    return addCritic(review, review.critic_id);
                })
            )
        });
}

function readByReviewId(reviewId) {
    return knex("reviews")
        .select("*")
        .where({ review_id: reviewId })
        .first();
}

function update(updatedReview) {
    return knex("reviews")
        .join("critics", "reviews.critic_id", "critics.critic_id")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview, "*");
}

module.exports = {
    addCritic,
    delete: destroy,
    listByMovieId,
    readByReviewId,
    update,
}