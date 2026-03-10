/**
 * Ek wrapper function jo errors ko catch karke next() ko bhejta hai
 * Isse controllers mein baar baar try-catch nahi likhna parta.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

export { asyncHandler };