import request from "supertest";
import { useApp } from "../src/app.js";
import mongoose from "mongoose";

describe("create user", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect("mongodb://localhost:27017/jshopTest")
      .then(() => console.log("Connected to Test Database"))
      .catch((err) => console.log(`Error: ${err}`));
    app = useApp();
  });
  it("should create new user and return 200", async () => {
    const response = await request(app).post("/signin").send({ username: "test2", password: "123456" });
    expect(response.status).toBe(200);
  });
  it("should send duplicate msg with 400 on duplicate usernameSignIn", async () => {
    const response = await request(app).post("/signin").send({ username: "test2", password: "123456" });
    expect(response.status).toBe(400);
    expect(response.body.msg).toContain("please use different username");
  });
  it("should send 400 status on setting user name with prefix 'e-'", async () => {
    const response = await request(app).post("/signin").send({ username: "e-test", password: "123456" });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toStrictEqual("username can't start with e-");
  });
  it("should create admin user and return 201", async () => {
    const response = await request(app).post("/admin").send({ key: "shubhuistati", username: "test", password: "123456" });
    expect(response.status).toBe(201);
  });
  it("should login to account", async () => {
    const response = await request(app).post("/login").send({ username: "test2", password: "123456" });
    expect(response.status).toBe(200);
    expect(response.body.msg).toContain("welcome");
    const cookies = response.headers["set-cookie"];
    expect(cookies[0]).toContain("accessToken");
    expect(cookies[1]).toContain("refreshToken");
    expect(cookies[2]).toContain("connect.sid");
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
