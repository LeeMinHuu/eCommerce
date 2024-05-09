module.exports = (req, res, next) => {
  if (
    req.session.user.role === "admin" ||
    req.session.user.role === "advisor"
  ) {
    next();
  } else return res.status(401).send("Unauthorized!");
};
