const redis = require("../config/redis");

const cacheMiddleware = async (req, res, next) => {
	try {
		const lang = req.query.lang || "en";
		const cacheKey = `faqs:${lang}`;

		// Check cache
		const cachedData = await redis.get(cacheKey);
		if (cachedData) {
			console.log(`✅ Cache hit for ${cacheKey}`);
			return res.status(200).json(JSON.parse(cachedData));
		}

		console.log(`⚠️ Cache miss for ${cacheKey}, fetching from DB...`);
		next();
	} catch (error) {
		console.error(`❌ Redis cache error: ${error.message}`);
		next(); // Continue even if Redis fails, to avoid breaking the request
	}
};

module.exports = cacheMiddleware;
