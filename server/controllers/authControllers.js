const generateToken = require("../utils/generateToken"); // Import the generateToken function

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin"; // Ensure this is stored securely in production

// Admin login controller
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  // Check if the provided username and password match the hardcoded admin credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // const token = generateToken(res, { username: ADMIN_USERNAME });

    // Respond with the token
    return res.status(200).json({
      message: "Login successful",
    });
  } else {
    // Invalid credentials
    return res.status(401).json({ message: "Invalid username or password" });
  }
};

// Admin logout controller
exports.adminLogout = (req, res) => {
  res.clearCookie("access_token"); // Replace "access_token" with your actual cookie name if different

  // Respond to the client with a successful logout message
  res.status(200).json({
    message: "Logout successful",
  });
};
