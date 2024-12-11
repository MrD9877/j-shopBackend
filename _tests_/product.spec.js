import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { deleteProductHandler, getProductHandler, patchProductHandler, uploadProductHandler } from "../src/handlers/productHandlers.js";
import { generateRandom } from "../src/utility/randomKey.js";
import dotenv from "dotenv";
import setUrls from "../src/utility/findImageUrl.js";
import { Product } from "../src/mongooseSchemas/productSchema.js";
import intigrateUrls from "../src/mockUtility/integrate.js";
dotenv.config();
const mockSend = jest.fn();
jest.mock("../src/utility/randomKey.js", () => ({
  generateRandom: jest.fn(() => "random"),
}));

jest.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  S3Client: jest.fn(() => ({
    send: () => mockSend,
  })),
}));
jest.mock("../src/utility/findImageUrl.js", () => jest.fn());

jest.mock("../src/mockUtility/integrate.js", () => jest.fn());

jest.mock("../src/mongooseSchemas/productSchema.js");
const mockReq = {
  files: [
    { buffer: "buffer1", mimetype: "mimetype1" },
    { buffer: "buffer2", mimetype: "mimetype2" },
  ],
  body: {
    title: "testTitle",
    colors: "red,blue,green",
    size: "S,M,L",
    stock: 100,
    price: 49.99,
    category: "testCategory",
    description: "testDescription",
  },
};
const mockRes = {
  sendStatus: jest.fn(),
  status: jest.fn(() => mockRes),
  send: jest.fn(),
};

describe("upload product", () => {
  it("should send status of 201 on saveing img", async () => {
    mockSend.mockResolvedValueOnce(null);
    await uploadProductHandler(mockReq, mockRes);
    const saveUrl = jest.spyOn(Product.prototype, "save");
    expect(generateRandom).toHaveBeenCalledTimes(3);
    expect(generateRandom).toHaveBeenLastCalledWith(32);
    expect(PutObjectCommand).toHaveBeenCalledTimes(2);
    expect(setUrls).toHaveBeenCalledWith(["random", "random"]);
    expect(saveUrl).toHaveBeenCalled();
    expect(mockRes.sendStatus).toHaveBeenCalledWith(201);
  });
  it("should send status 400 if not saved on db", async () => {
    mockSend.mockResolvedValueOnce(null);
    const saveData = jest.spyOn(Product.prototype, "save").mockImplementationOnce(() => Promise.reject("save error"));
    await uploadProductHandler(mockReq, mockRes);
    expect(saveData).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  // it("should send status of 502 after failing aws save", async () => {
  //   mockSend.mockRejectedValueOnce("Some error");
  //   await uploadProductHandler(mockReq, mockRes);
  //   expect(mockRes.sendStatus).toHaveBeenCalledWith(502);
  // });
});

describe("delete product", () => {
  mockSend.mockResolvedValueOnce(null);
  const mockReq = {
    body: {
      productId: 1,
    },
  };
  const mockProduct = {
    images: ["1", "2", "3"],
  };
  it("should send status 200 after saving on s3 and db", async () => {
    const findProduct = jest.spyOn(Product, "findOne").mockReturnValue(Promise.resolve(mockProduct));
    const deleteProduct = jest.spyOn(Product, "deleteOne");
    await deleteProductHandler(mockReq, mockRes);
    expect(findProduct).toHaveBeenCalledWith({ productId: 1 });
    expect(DeleteObjectCommand).toHaveBeenCalledTimes(3);
    expect(deleteProduct).toHaveBeenCalledWith({ productId: 1 });
    expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
  });
  it("should send status 502 failing to find product", async () => {
    const findProduct = jest.spyOn(Product, "findOne").mockReturnValue(Promise.reject({ message: "fail to find" }));
    await deleteProductHandler(mockReq, mockRes);
    expect(findProduct).toHaveBeenCalledWith({ productId: 1 });
    expect(mockRes.status).toHaveBeenCalledWith(502);
    expect(mockRes.send).toHaveBeenCalledWith({ message: "fail to find" });
  });
  it("should send status 502 failing to delete product from db", async () => {
    const findProduct = jest.spyOn(Product, "findOne").mockReturnValue(Promise.resolve(mockProduct));
    const deleteProduct = jest.spyOn(Product, "deleteOne").mockReturnValue(Promise.reject({ message: "fail to delete" }));

    await deleteProductHandler(mockReq, mockRes);
    expect(findProduct).toHaveBeenCalledWith({ productId: 1 });
    expect(DeleteObjectCommand).toHaveBeenCalledTimes(3);
    expect(deleteProduct).toHaveBeenCalledWith({ productId: 1 });
    expect(mockRes.status).toHaveBeenCalledWith(502);
    expect(mockRes.send).toHaveBeenCalledWith({ message: "fail to delete" });
  });
});

describe("patch product", () => {
  mockSend.mockResolvedValueOnce(null);
  const mockReq = {
    body: {
      productId: 2,
      patch: "test",
      content: "this is test content",
    },
  };
  it("should return status 201 after patching", async () => {
    const patchProduct = jest.spyOn(Product, "updateOne").mockReturnValue(Promise.resolve({ acknowledged: true }));
    await patchProductHandler(mockReq, mockRes);
    expect(patchProduct).toHaveBeenCalled();
    expect(mockRes.sendStatus).toHaveBeenCalledWith(201);
  });
  it("should return 400 if db refuse", async () => {
    const patchProduct = jest.spyOn(Product, "updateOne").mockReturnValue(Promise.resolve({ acknowledged: false }));
    await patchProductHandler(mockReq, mockRes);
    expect(patchProduct).toHaveBeenCalled();
    expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
  });
  it("should return 400 if bad credentials", async () => {
    const mockReq = {
      body: {
        productId: 2,
        content: "this is test content",
      },
    };
    await patchProductHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ message: "Invalid field" });
  });
  it("should return 400 if fail to connect with db", async () => {
    const patchProduct = jest.spyOn(Product, "updateOne").mockReturnValue(Promise.reject({ message: "fail to connect" }));
    await patchProductHandler(mockReq, mockRes);
    expect(patchProduct).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ message: "fail to connect" });
  });
});

describe("get product", () => {
  mockSend.mockResolvedValueOnce(null);
  it("should get all products", async () => {
    const mockReq = { query: {} };
    const findProduct = jest.spyOn(Product, "find").mockReturnValue(Promise.resolve("resultProducts"));
    intigrateUrls.mockReturnValue(Promise.resolve("productWithUrls"));
    await getProductHandler(mockReq, mockRes);
    expect(intigrateUrls).toHaveBeenCalledWith("resultProducts", "products");
    expect(mockRes.send).toHaveBeenCalledWith("productWithUrls");
  });
  it("should get all product of given Id", async () => {
    const mockReq = { query: { productId: 1 } };
    const findProduct = jest.spyOn(Product, "findOne").mockReturnValue(Promise.resolve("resultProduct"));
    intigrateUrls.mockReturnValue(Promise.resolve("productWithUrls"));
    await getProductHandler(mockReq, mockRes);
    expect(findProduct).toHaveBeenCalledWith({ productId: 1 });
    expect(intigrateUrls).toHaveBeenCalledWith("resultProduct", "product");
    expect(mockRes.send).toHaveBeenCalledWith("productWithUrls");
  });
  it("should get products of search text", async () => {
    const mockReq = { query: { search: "test" } };
    const findProduct = jest.spyOn(Product, "find").mockReturnValue(Promise.resolve("resultProducts"));
    intigrateUrls.mockReturnValue(Promise.resolve("productWithUrls"));
    await getProductHandler(mockReq, mockRes);
    expect(findProduct).toHaveBeenCalledWith({ $text: { $search: "test" } });
    expect(intigrateUrls).toHaveBeenCalledWith("resultProducts", "products");
    expect(mockRes.send).toHaveBeenCalledWith("productWithUrls");
  });
});
