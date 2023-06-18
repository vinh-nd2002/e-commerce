const notFound = (req, res, next) => {
  const error = new Error(`Đường dẫn ${req.originalUrl} không tìm thấy`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  return res.status(statusCode).json({
    success: false,
    mes: error?.message,
  });
};

module.exports = { errorHandler, notFound };
