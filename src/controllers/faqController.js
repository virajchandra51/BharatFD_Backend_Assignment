const FAQ = require("../models/FAQ");
const translationService = require("../services/translationService");
const redis = require("../config/redis");

const SUPPORTED_LANGS = ["hi", "bn", "es", "fr", "de", "zh", "ar"]; // Added more languages

// ✅ Utility Function to Translate FAQ Content
const translateFaqContent = async (question, answer) => {
	try {
		const translations = {};

		const translationPromises = SUPPORTED_LANGS.map(async (lang) => {
			const translated = await translationService.translateContent(
				{ question, answer },
				lang
			);
			translations[lang] = translated;
		});

		await Promise.all(translationPromises);
		return translations;
	} catch (error) {
		console.error("❌ Translation error:", error);
		return {};
	}
};

// ✅ Create FAQ
exports.createFaq = async (req, res) => {
	try {
		const { question, answer } = req.body;
		const translations = await translateFaqContent(question, answer);

		const faq = new FAQ({ question, answer, translations });
		await faq.save();

		// Clear all cached FAQs
		await Promise.all([
			redis.del("faqs:en"),
			...SUPPORTED_LANGS.map((lang) => redis.del(`faqs:${lang}`)),
		]);

		res.status(201).json(faq);
	} catch (error) {
		console.error("❌ Error creating FAQ:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// ✅ Get All FAQs
exports.getFaqs = async (req, res) => {
	try {
		const lang = req.query.lang || "en";
		const cacheKey = `faqs:${lang}`;

		// Check cache
		const cachedData = await redis.get(cacheKey);
		if (cachedData) return res.json(JSON.parse(cachedData));

		const faqs = await FAQ.find();
		const translatedFaqs = faqs.map((faq) => ({
			id: faq._id,
			...faq.getTranslation(lang),
		}));

		// Cache result for 1 hour
		await redis.setex(cacheKey, 3600, JSON.stringify(translatedFaqs));

		res.json(translatedFaqs);
	} catch (error) {
		console.error("❌ Error fetching FAQs:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// ✅ Get FAQ by ID
exports.getFaqById = async (req, res) => {
	try {
		const faq = await FAQ.findById(req.params.id);
		if (!faq) return res.status(404).json({ error: "FAQ not found" });

		const lang = req.query.lang || "en";
		res.json({ id: faq._id, ...faq.getTranslation(lang) });
	} catch (error) {
		console.error("❌ Error fetching FAQ by ID:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// ✅ Update FAQ
exports.updateFaq = async (req, res) => {
	try {
		const { question, answer } = req.body;
		const faq = await FAQ.findById(req.params.id);

		if (!faq) return res.status(404).json({ error: "FAQ not found" });

		// Update only provided fields
		if (question) faq.question = question;
		if (answer) faq.answer = answer;

		if (question || answer) {
			faq.translations = await translateFaqContent(faq.question, faq.answer);
		}

		await faq.save();

		// Clear all cached FAQs
		await Promise.all([
			redis.del("faqs:en"),
			...SUPPORTED_LANGS.map((lang) => redis.del(`faqs:${lang}`)),
		]);

		res.json(faq);
	} catch (error) {
		console.error("❌ Error updating FAQ:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// ✅ Delete FAQ
exports.deleteFaq = async (req, res) => {
	try {
		const faq = await FAQ.findByIdAndDelete(req.params.id);
		if (!faq) return res.status(404).json({ error: "FAQ not found" });

		// Clear all cached FAQs
		await Promise.all([
			redis.del("faqs:en"),
			...SUPPORTED_LANGS.map((lang) => redis.del(`faqs:${lang}`)),
		]);

		res.json({ message: "FAQ deleted successfully" });
	} catch (error) {
		console.error("❌ Error deleting FAQ:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
