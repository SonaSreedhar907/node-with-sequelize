const errorHandler = (statusCode, message, details) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details || null;  // Include additional details in the error object if provided
    return error;
};

module.exports = errorHandler;
