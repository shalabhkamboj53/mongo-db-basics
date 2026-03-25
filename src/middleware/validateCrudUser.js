function validateCrudUser(req, res, next) {
  const { name } = req.body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      message: '"name" is required and must be a non-empty string',
      requestId: req.requestId,
    });
  }

  req.body.name = name.trim();
  next();
}

module.exports = validateCrudUser;