module.exports = (err, req, res, next) => {
  if (err.name === 'JsonSchemaValidation') {
    res.status(400);
    res.json({
      status: 400,
      error: 'Bad Request',
      message: err.validations, //formalize this
    });
  } else {
    next(err);
  }
}