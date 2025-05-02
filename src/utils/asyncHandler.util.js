const asyncHandler = (fun) => async (req, res, next) => await Promise.resolve(fun(req, res, next)).catch((error) => error(next));

export { asyncHandler };