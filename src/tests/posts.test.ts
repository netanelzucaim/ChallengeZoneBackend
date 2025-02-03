import request from "supertest"
import appInit from "../server"
import mongoose from "mongoose"
import postModel from "../models/post_model"
import testPosts from "./tests_post.json"
import { Express } from "express"
import userModel from "../models/user_model"

let app: Express;

type UserInfo = {
    username: string;
    password: string;
    token?: string;
    _id?: string;
}

const userInfo: UserInfo = {
    username: "nati@gmail.com",
    password: "123456"
}

beforeAll(async () => {
    console.log("before all tests");
    app = await appInit()
    await postModel.deleteMany();
    await userModel.deleteMany();
    await request(app).post("/auth/register").send(userInfo)
    const response = await request(app).post("/auth/login").send(userInfo)
    userInfo.token = response.body.accessToken;
    userInfo._id = response.body._id;

});
afterAll(async () => {
    console.log("after all tests")
    await postModel.deleteMany();
    await userModel.deleteMany();
    mongoose.connection.close()
}
);

let postId = "";

describe("Posts test", () => {
    test("Get all posts empty", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(0)
    })

    test("Create new posts", async () => {
        for (const post of testPosts) {
            const response = await request(app).post("/posts").set("authorization", "JWT " + userInfo.token).send(post);
            expect(response.statusCode).toBe(201);
            expect(response.body.postPic).toBe(post.postPic);
            expect(response.body.content).toBe(post.content);
            expect(response.body.sender).toBe(userInfo._id);
            postId = response.body._id;
        }
    })
    test("Update post", async () => {

        const response = await request(app).put("/posts/" + postId).set("authorization", "JWT " + userInfo.token).send({ "postPic": "Test post 2 updated" }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.postPic).toBe("Test post 2 updated");
        expect(response.body.content).toBe(testPosts[testPosts.length - 1].content);
    })
    test("Get post By Id", async () => {
        const response = await request(app).get("/posts/" + postId);
        const post = response.body;
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(post._id);
    });

    test("Posts Get By Id test fail", async () => {
        const response = await request(app).get("/posts/" + postId + "3");
        expect(response.statusCode).toBe(400);
    });

    test("Get all post full", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(testPosts.length)
    })
    test("Get post by sender", async () => {
        const response = await request(app).get("/posts?sender=" + userInfo._id);
        const posts = response.body;
        for (const post of posts) {
            expect(post.sender).toBe(userInfo._id)
        }
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(testPosts.length)
    })
    test("Create a new post failed", async () => {
        const response = await request(app).post("/posts").send({
            postPic: "Test Post 1",
        });
        expect(response.statusCode).not.toBe(200);
    })

    test("Delete post by Id  (must be last otherwise update or get won't work)", async () => {
        const response = await request(app).delete("/posts/" + postId).set("authorization", "JWT " + userInfo.token);
        expect(response.statusCode).toBe(200)
        const responseGet = await request(app).get("/posts/" + postId)
        expect(responseGet.statusCode).toBe(404)
    })
});