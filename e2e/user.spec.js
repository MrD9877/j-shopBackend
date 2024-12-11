import request from "supertest";
import { useApp } from "../src/app.js";
import mongoose from "mongoose";
const productData = {
  title: "title",
  colors: "colors",
  size: "size",
  stock: 10,
  price: 10,
  category: "category",
  description: "description",
};

describe("create user", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect("mongodb://localhost:27017/jshopTest")
      .then(() => console.log("Connected to Test Database user"))
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

  it("should return status 401 on unauth req", async () => {
    const response = await request(app).post("/product").field(productData);
    expect(response.statusCode).toBe(401);
  });
  it("should upload image to aws and save product details in db", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "test", password: "123456" })
      .then((res) => {
        return request(app).post("/product").attach("image", "E:/Coding data/WorkSpace/jshopBackend/images/test.png").attach("image", "E:/Coding data/WorkSpace/jshopBackend/images/test.png").field(productData).set("Cookie", res.headers["set-cookie"]);
      });
    expect(response.statusCode).toBe(201);
  });
  it("should get products", async () => {
    const response = await request(app).get("/product");
    expect(response.statusCode).toBe(200);
  });
  it("should delete product of given id", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "test", password: "123456" })
      .then(async (res) => {
        const products = await request(app).get("/product");
        const productId = products.body[0].productId;
        return request(app).delete("/product").send({ productId: productId }).set("Cookie", res.headers["set-cookie"]);
      });
    expect(response.statusCode).toBe(200);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
