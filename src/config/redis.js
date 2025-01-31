const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
	retryStrategy: (times) => {
		const delay = Math.min(times * 100, 3000); // Exponential backoff up to 3s
		console.warn(`⚠️ Redis retrying connection in ${delay}ms...`);
		return delay;
	},
	reconnectOnError: (err) => {
		console.error("❌ Redis error:", err.message);
		return true; // Automatically reconnect on error
	},
	maxRetriesPerRequest: 5, // Avoid infinite retry loops
});

redis.on("connect", () => {
	console.log("✅ Redis connected successfully");
});

redis.on("error", (error) => {
	console.error("❌ Redis connection error:", error.message);
});

redis.on("end", () => {
	console.warn("⚠️ Redis disconnected. Attempting to reconnect...");
});

module.exports = redis;
