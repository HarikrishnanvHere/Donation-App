let Org = require('../models/org');

let cors = require('cors');
let express = require('express');
let app = express();
app.use(cors());

let dotenv = require('dotenv');
dotenv.config();
const Sib = require('sib-api-v3-sdk');





exports.getInfo = async (req,res,next) =>{
    let data = await Org.findAll();
    res.status(200).json({data:data});
}

exports.deleteInfo = async (req,res,next) =>{
    let id = req.headers.id;
    let data = await Org.destroy({where: {id: id}})
    res.status(200).json({data: data});
}

exports.approveInfo = async (req,res,next) =>{
    let id = req.headers.id;
    let data = await Org.findAll({where: {id : id}});
    let element = data[0];
    await element.update({isRegistered: 1});
    res.json({message: "success"});
}


exports.sendmail = async (req, res, next) =>{
    try{

        let id = req.headers.id;
        let textToSend = req.headers.text;
        let data = await Org.findAll({where: {id : id}});
        let mailId = data[0].email;
        
        if(!data){
            throw new Error("Invalid email id");
        }
            
            
        let BREVO_API_KEY = process.env.BREVO_API_KEY;
        console.log(BREVO_API_KEY);

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
            //console.log(apiKey);
        apiKey.apiKey = BREVO_API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi()

        const sender = {
            email : 'itsmeharikrishnanv@gmail.com'
        }

        const receivers = [
            {
                email : mailId
            }
        ]

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Registration Confirmation",
            textContent : textToSend
        })
        .then(data=>{
            console.log(data);
            res.status(201).json({message: "e-mail successfully sent!!"})
        } )
        .catch(err=>console.log(err));
    //BREVO_API_KEY='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'
    }catch(err){
        console.log(err);
        res.status(401).json({message: err});
    }
    
}





