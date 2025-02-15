import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;
beforeAll(async () => {
    app = await appInit();
    console.log("Before all tests");
});
afterAll(async () => {
    await mongoose.connection.close();
    console.log("After all tests");
});
describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/avatar.png`;
        console.log(filePath)
        try {
            const response = await request(app)
                .post("/file?file=123.png").attach('file', filePath)
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(app).get(url)
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    })
})