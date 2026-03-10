// import { ApiError } from "../utils/apiError.js";

import ApiError from "../utils/apiErorr.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    // Agar error hamari ApiError class ka nahi hai, to use convert karein
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(error.statusCode).json(response);
};

export { errorHandler };