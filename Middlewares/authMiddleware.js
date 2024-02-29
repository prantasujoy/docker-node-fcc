const protect = (req, res, next) => {
  const { user } = req.session;

  console.log({ user });

  if (!user) {
    return res.status(401).json({ status: "failed", message: "Unauthorized" });
  }

  req.user = user;
  next();
};

module.exports = protect;
