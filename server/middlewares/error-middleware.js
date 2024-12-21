import ApiError from "../exceptions/api-errors.js";

function errorMiddleware(error, req, res, next) {
  console.log('Error: ', error);

  if(res.headerSent) {
    return next(error);
  }
  if(error instanceof ApiError) {
    return res.status(error.status).json({message: error.message, errors: error.errors || []});
  }

  return res.status(500).json({message: 'Unexpected Error'});
}

export default errorMiddleware;