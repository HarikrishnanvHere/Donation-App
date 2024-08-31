let Org = require('../models/org');

let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
dotenv.config();
let token;

let cors = require('cors');

let express = require('express');
let app = express();
app.use(cors());

const hashrounds = 10;

exports.postSignUpOrg = (req,res,next) =>{
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = req.body.password;
    let goal = req.body.goal;
    let mission = req.body.mission;
    let target = req.body.target;

    console.log(password);

    bcrypt.hash(password, hashrounds, async (err, hash)=>{
        await Org.create({
            name: name,
            email: email, 
            password: hash,
            isRegistered: false,
            goal: goal,
            mission: mission,
            target: target,
            total:0
        })
        .then((data)=>{
            res.status(200).json({data: data})
        })
        .catch((err)=>{
            console.log(err);
        })
    })
}




function generateToken(id){
    token = jwt.sign({userId: id}, process.env.JWT_TOKEN_KEY);
    return token;
}

exports.postLogInOrg = (req,res,next) =>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        Org.findAll({where: {email: email}})
        .then((data)=>{
            //console.log(data);
            bcrypt.compare(password, data[0].password, (err, result)=>{
                if(err){
                    console.log(err);
                }
                else if(result === true){
                    res.status(200).json({token: generateToken(data[0].id), message: "login successful!"});
                }
                else if(result === false){
                    return res.status(400).json({message: "Error Code 400 - User Not Authorized!"});
                }
            })
        })
        .catch(err=>{
            console.log("not found");
            return res.status(404).json({success: false, message: "Error Code 401 - User not Found!"});
         })
    }catch{
        (err=>console.log(err));
    }
}

exports.getOrgHome = async (req,res,next)=>{
    //console.log(req.org);
    let name = req.org.name;
    let goal = req.org.goal;
    let target = req.org.target;
    let total = req.org.total;
    let registered = req.org.isRegistered;
    let mission = req.org.mission;
    let obj = {name, goal, target, total, registered, mission};
    await res.status(200).json({obj: obj});
}