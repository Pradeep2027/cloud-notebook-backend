const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');

router.post('/',[
    body('name', "Name should be atleast 3 letters").isLength({min : 3}),
    body('email', "Please Enter a valid email" ).isEmail(),
    body('password', "Name should be atleast 5 characters").isLength({min : 5})
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())  {
        return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(user => res.json(user))
    .catch(err => {console.log(err)
    res.json({error: "The email id is already registered", message: err.message})});
})

module.exports = router;