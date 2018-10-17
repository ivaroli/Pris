const request = require("supertest");
const api = require("./api");

describe("GET / endpoint", () => {
    it("Should return a 200 OK status code", async () =>{
        const res = await request(api).get("/");
        expect(res.status).toBe(200);
    });
});

describe("GET /results endpoint", () => {
    it("Should return a 200 OK status code", async () =>{
        const res = await request(api).get("/");
        expect(res.status).toBe(200);
    });
});

describe("GET /results.min.js endpoint", () => {
    it("Should return a 200 OK status code", async () =>{
        const res = await request(api).get("/index.min.js");
        expect(res.status).toBe(200);
    });
});

describe("GET /results.min.js endpoint", () => {
    it("Should return a 200 OK status code", async () =>{
        const res = await request(api).get("/results.min.js");
        expect(res.status).toBe(200);
    });
});

describe("GET /asdf endpoint", () => {
    it("Should return a 200 OK status code", async () =>{
        const res = await request(api).get("/asdf");
        expect(res.status).toBe(404);
    });
});