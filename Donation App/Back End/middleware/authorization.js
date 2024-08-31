let jwt = require('jsonwebtoken');
let Org = require('../models/org');

exports.getToken = (req,res,next) =>{
    let token = req.headers.authorization;
    //console.log(token);
    let id = jwt.verify(token,'harikrishnanv').userId;
    //console.log(id);
    //console.log(id);
    
    Org.findByPk(id)
    .then((org)=>{
        req.org = org;
        //console.log(user);
        next();
    })
    .catch((err)=>{
        res.status(404).json({message: "user not found"});
    })
}