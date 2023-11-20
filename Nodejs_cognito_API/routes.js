const express = require('express');
const router = express.Router();

const cognito = require('./cognito.js');

router.post('/signup', async (req,res)=>{

    const {body} = req;

    if (body.email&&body.user&&body.password){
        let {email,user,password} = body;

        try{
            let result = await cognito.signup(user, email, password);

            let response = {
                username: result.user.username,
                id: result.userSub,
                success: true
            }

            res.status(200).json({"result":response})
        }catch(err){
            res.status(400).json({"error":err})
        }
    } else{
        res.status(400).json({"error": "bad format"});
    }

    
});


router.post("/login", async(req, res) =>{
    const {body} = req;

    if (body.email && body.password){
        let {email, password} = body;

        try{
            let result = await cognito.login(email, password);

            res.status(200).json({result: result});
        }catch(err){
            res.status(400).json({ error: err.message });
        }
    }
});


module.exports = router;