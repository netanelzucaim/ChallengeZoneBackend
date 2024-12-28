import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comment_model";
import testComments from "./tests_comment.json";
import { Express } from "express";
import postModel from "../models/post_model"
import userModel from "../models/user_model"

let app: Express;

type UserInfo = {
    email:string;
    password:string;
    token?:string;
    _id?:string;
}

const userInfo:UserInfo = {
    email: "nati@gmail.com",
    password: "123456"
}

type PostInfo = {
    title:string;
    content:string; 
    _id?:string;
}
type CommentInfo = {
    comment:string;
    postId?:string;
    sender?:string;
    _id?:string;
}
const postInfo:PostInfo = {
    title: "creating post  for checking comment",
    content: "created post for checking comment content",

}
// TODO: implement these tests by jwt
beforeAll(async () => {
    process.env.TOKEN_EXPIRATION = "3s"; // Overwrite TOKEN_EXPIRATION for tests
    app = await appInit()
    await postModel.deleteMany();
    await userModel.deleteMany();
    await commentModel.deleteMany();
    await request(app).post("/auth/register").send(userInfo)
    const response = await request(app).post("/auth/login").send(userInfo)
    userInfo.token = response.body.accessToken;
    userInfo._id = response.body._id;
    const post = await request(app).post("/posts").set("authorization","JWT "+ userInfo.token).send(postInfo);
    postInfo._id = post.body._id;
});

afterAll(async () => {
    console.log("after all tests");
    // await postModel.deleteMany();
    // await userModel.deleteMany();
    // await commentModel.deleteMany();
    mongoose.connection.close();
});

let commentId = "";
let newComment;
describe("Comments tests", () => {
    test("Get all comments empty",async ()=>{
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(0)
    })
    test("Create a new comment", async () => {
        for (const comment of testComments) {
            try{
             newComment = comment as CommentInfo
             newComment.postId = postInfo._id; 
             newComment.sender = userInfo._id;  
 
             const response = await request(app).post("/comments").set("authorization","JWT "+ userInfo.token).send(newComment);
            console.log(response.statusCode);
            console.log(response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body.postId).toBe(postInfo._id);
            expect(response.body.content).toBe(comment.comment);
            expect(response.body.user).toBe(userInfo._id);
            commentId = response.body._id;
            } catch(err){
                console.log(err);}
        }
    });


    test("Get all comments full",async ()=>{
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(testComments.length)
    })
    test("Get comment By Id", async () => {
        const response = await request(app).get("/comments/" + commentId);
        const comment = response.body;
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(comment._id);
      });
    test("Delete post by Id",async ()=>{
        const response = await request(app).delete("/posts/"+postId).set("authorization","JWT "+ userInfo.token); 
        expect(response.statusCode).toBe(200)
        const responseGet = await request(app).get("/posts/"+postId)
        expect(responseGet.statusCode).toBe(404)
    })    
    // test("Test update comment by id", async () => {
    //     const updatedContent = { content: "Updated Comment Content" };
    //     const response = await request(app).put("/comments/" + commentId).send(updatedContent);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.content).toBe(updatedContent.content);
    // });

    // test("Test delete comment by id", async () => {
    //     console.log("comment id is " + commentId);
    //     const response = await request(app).delete("/comments/" + commentId);
    //     expect(response.statusCode).toBe(200);
    //     const responseGet = await request(app).get("/comments/" + commentId);
    //     expect(responseGet.statusCode).toBe(404);
    // });

    // test("Test create a new comment failed", async () => {
    //     const response = await request(app).post("/comments").send({
    //         user: "Test comment 1",
    //         content: "Test Comment 1"
    //     });
    //     console.log(response.statusCode);
    //     console.log(response.body);
    //     expect(response.statusCode).toBe(400);
    // });
});