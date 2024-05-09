module.exports = (req, res, next) => {
  if (req.session.user.role === "admin") {
    next();
  } else return res.status(401).send("Unauthorized!");
};
