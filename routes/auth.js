const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "RamIsaGoodBoy";
// Create a User using : POST "/api/auth/createuser". No login is required
router.post("/createuser", [
    body("name", "Name should be atleast 3 letters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({ min: 5 })
  ], async (req, res) => {
    // If there are any errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const encryptPassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: encryptPassword
      });
      const data = {
        user: {id: user.id}
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  },
);
module.exports = router;