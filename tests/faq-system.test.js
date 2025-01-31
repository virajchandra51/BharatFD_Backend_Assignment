const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const FAQ = require("../src/models/FAQ");

beforeAll(async () => {
	await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});

beforeEach(async () => {
	await FAQ.deleteMany({});
});

describe("FAQ API", () => {
	describe("POST /api/faqs", () => {
		it("should create a new FAQ", async () => {
			const response = await request(app).post("/api/faqs").send({
				question: "What is this test question?",
				answer: "This is a test answer that should be valid.",
			});

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty(
				"question",
				"What is this test question?"
			);
			expect(response.body).toHaveProperty(
				"answer",
				"This is a test answer that should be valid."
			);
		});

		it("should not allow duplicate FAQs", async () => {
			await FAQ.create({
				question: "Duplicate Question?",
				answer: "Original Answer",
			});

			const response = await request(app).post("/api/faqs").send({
				question: "Duplicate Question?",
				answer: "Duplicate Answer",
			});

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty("error");
		});

		it("should return validation errors for missing input", async () => {
			const response = await request(app).post("/api/faqs").send({
				question: "",
				answer: "",
			});

			expect(response.status).toBe(400);
			expect(response.body.errors).toBeDefined();
		});

		it("should return validation errors for long inputs", async () => {
			const response = await request(app)
				.post("/api/faqs")
				.send({
					question: "A".repeat(1001), // Too long
					answer: "B".repeat(1001), // Too long
				});

			expect(response.status).toBe(400);
			expect(response.body.errors).toBeDefined();
		});
	});

	describe("GET /api/faqs", () => {
		it("should retrieve all FAQs in English by default", async () => {
			await FAQ.create({
				question: "Test Question?",
				answer: "Test Answer",
				translations: {
					hi: { question: "प्रश्न", answer: "उत्तर" },
				},
			});

			const response = await request(app).get("/api/faqs");

			expect(response.status).toBe(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body[0]).toHaveProperty("question", "Test Question?");
			expect(response.body[0]).toHaveProperty("answer", "Test Answer");
		});

		it("should retrieve FAQs in Hindi", async () => {
			await FAQ.create({
				question: "Test Question?",
				answer: "Test Answer",
				translations: {
					hi: { question: "प्रश्न", answer: "उत्तर" },
				},
			});

			const response = await request(app).get("/api/faqs?lang=hi");

			expect(response.status).toBe(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body[0]).toHaveProperty("question", "प्रश्न");
			expect(response.body[0]).toHaveProperty("answer", "उत्तर");
		});

		it("should return an empty array if no FAQs exist", async () => {
			const response = await request(app).get("/api/faqs");
			expect(response.status).toBe(200);
			expect(response.body).toEqual([]);
		});
	});

	describe("GET /api/faqs/:id", () => {
		it("should retrieve a specific FAQ", async () => {
			const faq = await FAQ.create({
				question: "Specific Test Question?",
				answer: "Specific Test Answer",
			});

			const response = await request(app).get(`/api/faqs/${faq._id}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty(
				"question",
				"Specific Test Question?"
			);
			expect(response.body).toHaveProperty("answer", "Specific Test Answer");
		});

		it("should return 404 for an invalid FAQ ID", async () => {
			const response = await request(app).get("/api/faqs/invalidID");
			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty("error");
		});

		it("should return 404 if FAQ does not exist", async () => {
			const response = await request(app).get(
				"/api/faqs/605c72c1fc13ae454e000000"
			);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("error", "FAQ not found");
		});
	});

	describe("PUT /api/faqs/:id", () => {
		it("should update an existing FAQ", async () => {
			const faq = await FAQ.create({
				question: "Old Question?",
				answer: "Old Answer",
			});

			const response = await request(app)
				.put(`/api/faqs/${faq._id}`)
				.send({ question: "Updated Question?" });

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("question", "Updated Question?");
			expect(response.body).toHaveProperty("answer", "Old Answer"); // Answer remains unchanged
		});

		it("should return 404 if trying to update non-existent FAQ", async () => {
			const response = await request(app)
				.put("/api/faqs/605c72c1fc13ae454e000000")
				.send({ question: "Updated Question?" });

			expect(response.status).toBe(404);
		});

		it("should return 400 if update data is invalid", async () => {
			const faq = await FAQ.create({
				question: "Valid Question?",
				answer: "Valid Answer",
			});

			const response = await request(app)
				.put(`/api/faqs/${faq._id}`)
				.send({ question: "" });

			expect(response.status).toBe(400);
		});
	});

	describe("DELETE /api/faqs/:id", () => {
		it("should delete an FAQ", async () => {
			const faq = await FAQ.create({
				question: "Delete Me?",
				answer: "I will be deleted.",
			});

			const response = await request(app).delete(`/api/faqs/${faq._id}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty(
				"message",
				"FAQ deleted successfully"
			);

			const checkFAQ = await FAQ.findById(faq._id);
			expect(checkFAQ).toBeNull();
		});

		it("should return 404 if FAQ does not exist", async () => {
			const response = await request(app).delete(
				"/api/faqs/605c72c1fc13ae454e000000"
			);
			expect(response.status).toBe(404);
		});
	});
});
