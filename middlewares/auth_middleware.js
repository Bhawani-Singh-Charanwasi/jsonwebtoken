import Jwt  from "jsonwebtoken";
import userModel from "../models/user.js";

var checkUserAuth = async (req,res, next)=>{
    let token;
    // Get Token from header
    const { authorization } = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try {
            // Get token
            token = authorization.split(" ")[1];
            console.log("token" , token);
            console.log('authorization' , authorization);
            
            // Verify Token and get userId
            const { userId } = Jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('userId', userId);

            // Get user from token
            req.user = await userModel.findById(userId).select('-password');
            console.log(req.user);
            next();
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    if(!token){
        res.status(401).json({ message:"Unauthorized User, No token" })
    }
}

export default checkUserAuth;