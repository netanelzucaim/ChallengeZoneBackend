import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import postModel from "../models/post_model";

let app: Express;

beforeAll(async () => {
    process.env.TOKEN_EXPIRATION = "3s";
    console.log("before all tests");
    app = await appInit();
    await userModel.deleteMany();
    await postModel.deleteMany();
});

afterAll(() => {
    console.log("after all tests");
    mongoose.connection.close();
});

type UserInfo = {
    username: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;
    _id?: string;
};

const userInfo: UserInfo = {
    username: "nati@gmail.com",
    password: "123456"
};

describe("Auth Test", () => {
    test("Auth Registration", async () => {
        const response = await request(app).post("/auth/register").send(userInfo);
        expect(response.body);
        expect(response.statusCode).toBe(201);
    });

    test("Auth Failed", async () => {
        const response = await request(app).post("/auth/register").send(userInfo);
        expect(response.body);
        expect(response.statusCode).not.toBe(201);
    });

    test("Auth Login", async () => {
        const response = await request(app).post("/auth/login").send(userInfo);
        expect(response.body);
        expect(response.statusCode).toBe(200);
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        const userId = response.body._id;
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        expect(userId).not.toBe("");
        userInfo.accessToken = accessToken;
        userInfo.refreshToken = refreshToken;
        userInfo._id = userId;
    });

    test("Make sure two access tokens are not the same", async () => {
        const response = await request(app).post("/auth/login").send(userInfo);
        expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
    });

    test("Get Protected API", async () => {
        const response = await request(app).post("/posts").send({
            sender: userInfo._id,
            title: "My first post",
            content: "this is my first post"
        });
        expect(response.statusCode).not.toBe(201);

        const response2 = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.accessToken
        }).send({
            sender: userInfo._id,
            title: "My first post",
            content: "this is my first post"
        });
        expect(response2.statusCode).toBe(201);
    });

    test("Get Protected API invalid", async () => {
        const response = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.accessToken + "1"
        }).send({
            sender: userInfo._id,
            title: "My first post",
            content: "this is my first post"
        });
        expect(response.statusCode).toBe(403);
    });

    test("Refresh Token", async () => {
        const response = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken = response.body.accessToken;
        userInfo.refreshToken = response.body.refreshToken;
    });

    test("Logout - invalidate refresh token", async () => {
        const response = await request(app).post("/auth/logout").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).not.toBe(200);
    });

    test("Refresh token multiple usage", async () => {
        const response = await request(app).post("/auth/login").send({
            username: userInfo.username,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken = response.body.accessToken;
        userInfo.refreshToken = response.body.refreshToken;

        //first time use the refresh token and get a new one
        const response2 = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).toBe(200);
        const newRefreshToken = response2.body.refreshToken;

        //second time use the old refresh token and expect to fail
        const response3 = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).not.toBe(200);
        //try to use the new refresh token and expect to fail
        const response4 = await request(app).post("/auth/refresh").send({
            refreshToken: newRefreshToken
        });
        expect(response4.statusCode).not.toBe(200);
    });

    jest.setTimeout(10000);

    test("Timeout on refresh access token", async () => {
        const response = await request(app).post("/auth/login").send({
            username: userInfo.username,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken = response.body.accessToken;
        userInfo.refreshToken = response.body.refreshToken;

        await new Promise(resolve => setTimeout(resolve, 6000));

        const response2 = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.accessToken
        }).send({
            sender: "invalid owner",
            title: "My First post",
            content: "This is my first post"
        });
        expect(response2.statusCode).not.toBe(201);

        const response3 = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).toBe(200);
        userInfo.accessToken = response3.body.accessToken;
        userInfo.refreshToken = response3.body.refreshToken;

        const response4 = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.accessToken
        }).send({
            owner: "invalid owner",
            title: "My First post",
            content: "This is my first post"
        });
        expect(response4.statusCode).toBe(201);
    });
});