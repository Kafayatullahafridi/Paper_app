export function notFoundHandler(_req, res) {
  res.status(404).json({
    error: {
      message: 'Route not found',
    },
  });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  res.status(error.statusCode || 500).json({
    error: {
      message: error.statusCode ? error.message : 'Internal server error',
    },
  });
}
