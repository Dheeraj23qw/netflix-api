const jwt = require("jsonwebtoken");


async function auth(req, res, next) {
  try {
    // Access authorized header to validate request
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Token missing." });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assuming decoded contains necessary user information
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(401)
      .json({ error: "Authentication failed. Invalid token." });
  }
}


module.exports = {
  auth,
};
