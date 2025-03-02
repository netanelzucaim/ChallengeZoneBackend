        import { Request, Response, NextFunction } from "express";
        import userModel, {iUser} from "../models/user_model";
        import bcrypt from "bcrypt";
        import jwt from "jsonwebtoken";
        import path from 'path';
        import { OAuth2Client } from "google-auth-library";
        import { Document } from "mongoose";


        const client = new OAuth2Client();
        const googleSignIn = async (req: Request, res: Response) => {
            console.log(req.body)
            try{
                const ticket = await client.verifyIdToken({
                    idToken: req.body.credential,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                const email = payload?.email;
                if (email != null){
                    let user = await userModel.findOne({ 'username': email });
                    if (user == null){
                        user = await userModel.create({ username: email, displayName: email, password: '0', avatar: payload?.picture });
                    }
                    const tokens = await googleGenerateTokens(user);
                    res.status(200).send({username: user.username, _id: user._id, avatar: user.avatar, ...tokens});
                }
            } catch (err) { 
                console.log(err)
                res.status(400).json({ error: "Invalid request", details: err});
           }
        }

        const googleGenerateTokens = async (user: Document & iUser) => {
            const accessToken = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET?.toString() ?? "", {expiresIn: process.env.TOKEN_EXPIRATION});
            const refreshToken = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET?.toString() ?? "");
            if(user.refreshTokens == null){
                user.refreshTokens = [refreshToken];
            }else{
                user.refreshTokens.push(refreshToken);
            }
            await user.save();
            return {'accessToken': accessToken, 'refreshToken': refreshToken};
        }
        const register = async (req: Request, res: Response) => {
            const username = req.body.username;
            const password = req.body.password;
            if (!username || !password) {
                res.status(400).send("Username and password are required");
                return;
            }
            const existingUser = await userModel.findOne({ username: username });
            if (existingUser) {
                res.status(409).send("A user with this username already exists" );
                return;
            }
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                if (!req.body.avatar) req.body.avatar = process.env.DOMAIN_BASE +  "/public/avatar.png";
                
                const newUser = await userModel.create({ username: username, displayName:username, password: hashedPassword, avatar: req.body.avatar });
                    res.status(201).send(newUser);
            } catch (error) {
                res.status(400).send(error);
            }
        };

        const generateTokens = (_id: string): { refreshToken: string, accessToken: string } | null => {
            if (process.env.TOKEN_SECRET === undefined) {
                return null;
            }
            const rand = Math.random();
            const accessToken = jwt.sign(
                { _id: _id, rand: rand },
                process.env.TOKEN_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRATION }
            );
            const refreshToken = jwt.sign(
                { _id: _id, rand: rand },
                process.env.TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
            );
            return { refreshToken: refreshToken, accessToken: accessToken };
        };

        const login = async (req: Request, res: Response) => {
            const username = req.body.username;
            const password = req.body.password;
            if (!username || !password) {
                res.status(400).send("Wrong username or password");
                return;
            }
            try {
                const user = await userModel.findOne({ username: username });
                if (!user) {
                    res.status(400).send("User not found");
                    return;
                }
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    res.status(400).send("Invalid username or password");
                    return;
                }
                const userId: string = user._id.toString();
                const tokens = generateTokens(userId);
                if (!tokens) {
                    res.status(401).send("Missing auth configuration");
                    return;
                }
                if (user.refreshTokens == null) {
                    user.refreshTokens = [];
                }
                user.refreshTokens.push(tokens.refreshToken);
                await user.save();
                res.status(200).send({
                    username: user.username,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    _id: user._id
                });
            } catch (err) {
                res.status(500).send("Internal server error" + err);
            }
        };

        const logout = async (req: Request, res: Response) => {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                res.status(400).send("Refresh token is required");
                return;
            }
            if (!process.env.TOKEN_SECRET) {
                res.status(400).send("Invalid token");
                return;
            }
            jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, data: any) => {
                if (err) {
                    res.status(403).send("Invalid token");
                    return;
                }
                const payload = data as TokenPayload;
                try {
                    const user = await userModel.findOne({ _id: payload._id });
                    if (!user) {
                        res.status(400).send("Invalid token");
                        return;
                    }
                    if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                        res.status(400).send("Invalid token");
                        user.refreshTokens = [];
                        await user.save();
                        return;
                    }
                    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
                    await user.save();
                    res.status(200).send("Logout successful");
                } catch (err) {
                    res.status(400).send("Invalid token");
                }
            });
        };

        const refresh = async (req: Request, res: Response) => {
            //first validate the refresh token
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                res.status(400).send("missing refresh token");
                return;
            }
            if (!process.env.TOKEN_SECRET) {
                res.status(400).send("Missing auth configuration");
                return;
            }
            jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, data: any) => {
                if (err) {
                    res.status(403).send("Invalid token");
                    return;
                }
                const payload = data as TokenPayload;
                try {
                    const user = await userModel.findOne({ _id: payload._id });
                    if (!user) {
                        res.status(400).send("Invalid token");
                        return;
                    }
                    if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                        user.refreshTokens = [];
                        await user.save();
                        res.status(400).send("Invalid token");
                        return;
                    }
                    const newTokens = generateTokens(user._id.toString());
                    if (!newTokens) {
                        user.refreshTokens = [];
                        await user.save();
                        res.status(400).send("Missing auth configuration");
                        return;
                    }
                    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
                    user.refreshTokens.push(newTokens.refreshToken);
                    await user.save();
                    res.status(200).send({
                        accessToken: newTokens.accessToken,
                        refreshToken: newTokens.refreshToken,
                        username: user.username
                    });
                } catch (err) {
                    res.status(400).send("Invalid token");
                }
            });
        };

        type TokenPayload = {
            _id: string;
        };

        export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
            try {
                const authHeader = req.headers["authorization"];
                const token = authHeader && authHeader.split(" ")[1];
                if (!token) {
                    res.status(401).send("Missing token");
                    return;
                }
                if (!process.env.TOKEN_SECRET) {
                    res.status(400).send("Missing auth configuration");
                    return;
                }
                jwt.verify(token, process.env.TOKEN_SECRET, (err: any, data) => {
                    if (err) {
                        res.status(403).send("Invalid token");
                        return;
                    }
                    const payload = data as TokenPayload;
                    req.query.userId = payload._id;
                    next();
                });
            } catch (err) {
                res.status(400).json({ error: "Invalid request", details: err });
            }
        };

        export default { googleSignIn, register, login, logout, refresh };