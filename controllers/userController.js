import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
    // Sign Up
    static userRegistration = async (req, res) => {

        // Client Data
        const { name, email, password, password_confirmation, tc } = req.body;
        // User already exists
        const user = await userModel.findOne({email:email});
        if(user){
            res.status(400).json({ "message":"Email Already exists"});
        }else{
            if(name && email && password && password_confirmation && tc){
                // Confirm password
                if(password===password_confirmation){
                    try {
                        // hashed password
                        const salt = await bcrypt.genSalt(10);
                        const hashpass = await bcrypt.hash(password, salt);
                        const newUser = await new userModel({
                            name,
                            email,
                            password:hashpass,
                            tc
                        });
                        await newUser.save();
                        // Generate jwt Token
                        const saved_user = await userModel.findOne({email : email});
                        const Token = jwt.sign({userId: saved_user._id}, process.env.JWT_SECRET_KEY , { expiresIn:"5d" });
                        res.status(201).json({newUser, "toktn":Token});
                    } catch (error) {
                        res.status(500).json({ message: error.message })
                    }

                }else{
                    res.status(400).json({"message": "Confirm Password are not Same"})
                }
            }else{
                res.status(400).json({ "message":"All fields are required"}); 
            }
        }
    }

    // Log In
    static userLogin = async (req, res)=>{
        try {
            const { email, password } = req.body;
            if(email && password){
                const user = await userModel.findOne({email: email});
                if(user){
                    // hash password match
                    const isMatch = await bcrypt.compare(password, user.password);
                    if((email === user.email) && isMatch){
                        // Generate Token 
                        const Token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY , { expiresIn:"5d" })
                        res.status(200).json({user ,"token":Token })
                    }else{
                        res.status(500).json({"message": "Email or Password is not correct"});
                    }
                }else{
                    res.status(500).json({ "message":"User not Found"});
                }
            }else{
                res.status(500).json({message:"All fields are required"}); 
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }

    }

    // Change Password

    static changePassword = async(req, res) =>{
        const { password , password_confirmation } = req.body;
        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.status(400).json({"message":"New password and Confirm password doesn't match"});
            }else{
                const salt = await bcrypt.genSalt(10);
                const hashpass = await bcrypt.hash(password, salt);
                res.status(201).json({message:"Successfully"})
            }
        }else{
            res.status(500).json({"message":"All feilds are required"});
        }
    }
}

export default UserController;