import {Request,Response,NextFunction} from "express"
import userModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request,res:Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
         res.status(400).send("Email and password are required");
         return;
    }
    try {
        // Your registration logic here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);  
    const newUser = await userModel.create({ email: email, password: hashedPassword });
    res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send(error);
    }
}

const generateTokens = (_id: string): { refreshToken: string, accessToken: string } | null => {
    if (process.env.TOKEN_SECRET === undefined) {
      return null;
    }
    const rand = Math.random();
    const accessToken = jwt.sign(
      {
        _id: _id,
        rand: rand
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION });
    const refreshToken = jwt.sign(
      {
        _id: _id,
        rand: rand
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    return { refreshToken: refreshToken, accessToken: accessToken };
  };
  const login = async (req: Request,res:Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
         res.status(400).send("wrong Email or password");
         return;
    }
    try{
    const user = await userModel.findOne({ email: email });
    if (!user) {
         res.status(400).send("User not found");
         return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
         res.status(400).send("Invalid email or password");
         return;
    }
    const userId: string = user._id.toString();    
    const tokens =  generateTokens(userId);
    if(!tokens){
        res.status(400).send("missing auth configuration");
        return;
    }

    if(user.refreshTokens == null) {
        user.refreshTokens = [];
    }
    user.refreshTokens.push(tokens.refreshToken);  
    await user.save();
    res.status(200).send({
        email: user.email,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        _id: user._id   
    }); 
    } catch(err) {
        res.status(400)
    }
}
const logout = async (req: Request,res:Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("Refresh token is required");
        return;
    }   
    //first validate refresh token 
    if(!process.env.TOKEN_SECRET){
        res.status(403).send("invalid token");
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, data: any) => {
        if (err) {
            res.status(403).send("Invalid token");
            return;
        }
    const payload = data as TokenPayload    
    try{
    const user = await userModel.findOne({ _id: payload._id }); 
    if(!user){
        res.status(400).send("invalid  token");
        return;
    }   
    if(!user.refreshTokens || !user.refreshTokens.includes(refreshToken)){
        res.status(400).send("invalid token");
        user.refreshTokens = [];
        await user.save();
        return;
    }   
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    await user.save();
    res.status(200).send("Logout successful");
    } catch(err) {
    res.status(400).send("invalid token");
    }
    });
}
const refresh = async (req: Request,res:Response) => {
//first validate refresh token
const refreshToken = req.body.refreshToken;
if(!refreshToken){
    res.status(400).send( "invalid Refresh token");
    return;
}   
if(!process.env.TOKEN_SECRET){
    res.status(400).send("missing auth configuration");
    return;
}   
jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, data: any) => { 
    if (err) {
        res.status(403).send("Invalid token");
        return;
    }
    //find the user 

    const payload = data as TokenPayload
    try{
    const user  = await userModel.findOne({ _id: payload._id });        
    if(!user){
        res.status(400).send("invalid token");
        return;
    }   
    //check that the token exists in the user
    if(!user.refreshTokens || !user.refreshTokens.includes(refreshToken)){
        user.refreshTokens = [];
        await user.save();
        res.status(400).send("invalid token");    
        return;
    }
    //generate a new access token
    const newTokens = generateTokens(user._id.toString());
    if(!newTokens){
        user.refreshTokens = [];
        await user.save();  
        res.status(400).send("missing auth configuration");
        return;
    }   
    //delete the old refresh token
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    //save the new refresh token
    user.refreshTokens.push(newTokens.refreshToken);
    await user.save();
    //return the new access token and the new refresh token
    res.status(200).send({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken   

    });     
} catch(err) {
    res.status(400).send("invalid token");  
}
});
}

type TokenPayload = {
    _id:string;
}
export const authMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const authHeader  =  req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) { 
        res.status(401).send("missing token");
        return;
    }
    if(!process.env.TOKEN_SECRET){
         res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err: any, data) => {
        if (err) {
            res.status(403).send("Invalid token");
            return;
        }
        const payload = data as TokenPayload
        req.query.userId = payload._id
        next();
    });
 }

export default {register,login,logout,refresh}