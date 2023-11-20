const AmazonCognitoId = require("amazon-cognito-identity-js")
const AWS = require("aws-sdk");
const request  = require("request");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");

// global.fetch = require("node-fetch");

const poolData = {
    UserPoolId : "us-east-1_8r9aHJxHT",
    ClientId : "reqk646491s71irk87m2bs027"
};

const aws_region = "us-east-1";

const CognitoUserPool = AmazonCognitoId.CognitoUserPool;
const userPool = new AmazonCognitoId.CognitoUserPool(poolData);

//don't work!!!!!!!!!!!!!!!!!!!!!!!!!!!
const signup = (name, email, password) => {
    return new Promise((result, reject)=>{
        try{

            const attributelist = [];

            attributelist.push(
                new AmazonCognitoId.CognitoUserAttribute({Name: 'name', Value: name})
            );
            attributelist.push(
                new AmazonCognitoId.CognitoUserAttribute({
                    Name: "email",
                    Value: email      
                })
            );
            
            userPool.signUp(email, password, attributelist, null , (err, data)=>{
                if(err) reject(err);
                else result(data);
            });
        }catch(err){
            reject(err);
        }
    });
}


const login = (name,password) => {
    return new Promise((resolve, reject) => {
        try {
            const authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
                Username: name,
                Password: password
            });

            const UserData = {
                Username: name,
                Pool: userPool
            };

            const cognitoUser = new AmazonCognitoId.CognitoUser(UserData);

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: result => {
                    resolve({
                        accessToken: result.getAccessToken().getJwtToken(),
                        idToken: result.getIdToken().getJwtToken(),
                        refreshToken: result.getRefreshToken().getToken()
                    });
                },
                onFailure: err => {
                    reject(err);
                }
            })
        }catch(err){
            reject(err);
        }
    })
}


module.exports.login = login
module.exports.signup = signup