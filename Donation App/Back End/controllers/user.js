let User = require('../models/user');
let Org = require('../models/org');
let Donation = require('../models/donation');
let DownloadUrl = require('../models/downloadUrl');

let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
dotenv.config();
let token;

let cors = require('cors');

let express = require('express');
let app = express();
app.use(cors());

let AWS = require('aws-sdk');
const { SendReport } = require('sib-api-v3-sdk');

const hashrounds = 10;

exports.postSIgnUpUser = (req,res,next) =>{
    try{
        //console.log(req.body);
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        //console.log(name,email,password);

        bcrypt.hash(password, hashrounds, async (err, hash) =>{
            console.log(err);
            await User.create({
                name: name,
                email: email,
                password: hash,
            })
            .then((data)=>{
                res.status(200).json({data: data});
            })
            .catch(err=>res.status(400).json({message: "user or email not unique"}));
        })
    }catch{
        (err=>res.send(err))
    }
}



function generateToken(id){
    token = jwt.sign({userId: id}, process.env.JWT_TOKEN_KEY);
    return token;
}

exports.postLogInUser = (req,res,next) =>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        User.findAll({where: {email: email}})
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


exports.getUserHome = (req,res,next) =>{
    Org.findAll({where: {isRegistered : 1}})
    .then((data)=>{
        res.status(200).json({data: data})
    })
    .catch((err)=>console.log(err))
}


exports.getDonation = async (req,res,next) =>{
    let donations = await req.user.getDonations();
    //console.log(donations);
    res.status(200).json({donations: donations});
}



function generateToken(id){
    token = jwt.sign({userId: id}, process.env.JWT_TOKEN_KEY);
    return token;
}

exports.getCharityInfo = async (req,res,next)=>{
    let name = req.query.name;
    console.log(name);
    Org.findAll({where: {name: name}})
    .then((data)=>res.status(200).json({token: generateToken(data[0].id)}))
    .catch((err)=>{
        console.log(err)
    })
}




async function uploadToS3 (data, fileName){
    let AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
    let AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    let AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

    let s3bucket = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
    })

    
    var params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise ((resolve, reject) =>{
        s3bucket.upload(params, (err, s3response) =>{
            if(err){
                reject(err);
            }
            else{
                console.log("success");
                resolve(s3response.Location);
            }
        })
    
    }) 
}




exports.downloadDonations = async (req,res,next) =>{
    try{
        
        const userId = req.user.id;
        const donations = await req.user.getDonations();
        const stringifiedDonations = JSON.stringify(donations);
        const fileName = `Donations${userId}/${new Date}.txt`;
        const fileNameSplit = fileName.split('/');
        const dataName = fileNameSplit[1];
        const fileUrl = await uploadToS3(stringifiedDonations,fileName);
        console.log(fileUrl);
        await req.user.createDownloadUrl({
            url: fileUrl,
            filename: dataName
        })
        let previouslyDownloaded = await req.user.getDownloadUrls();
        res.status(200).json({url: fileUrl, previouslyDownloaded, message: "success"})
        
    }
    catch(err){
        res.status(401).json({message: "Server Error!"})
    }
    
}


exports.editDetails = async (req,res,next) =>{
    let name = req.user.name;
    let email = req.user.email;
    await res.status(200).json({name, email});
}


exports.saveEdits = (req,res,next) =>{
    try{
        
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        //console.log(name,email,password);

        bcrypt.hash(password, hashrounds, async (err, hash) =>{
            console.log(err);
            await req.user.update({
                name: name,
                email: email,
                password: hash,
            })
            .then((data)=>{
                res.status(200).json({data: data});
            })
            .catch(err=>res.status(400).json({message: "user or email not unique"}));
        })
    }catch{
        (err=>res.send(err))
    }
}