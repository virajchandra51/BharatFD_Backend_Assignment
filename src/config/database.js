const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
			autoIndex: false, // Disable automatic index creation for performance
			maxPoolSize: 10, // Maintain up to 10 connections in the pool
		});

		console.log("✅ MongoDB connected successfully");
	} catch (error) {
		console.error("❌ MongoDB connection error:", error.message);

		// Retry logic (optional)
		setTimeout(connectDB, 5000); // Try reconnecting after 5 seconds
	}
};

// Handle process exit gracefully
mongoose.connection.on("disconnected", () => {
	console.warn("⚠️ MongoDB disconnected. Retrying...");
	setTimeout(connectDB, 5000); // Attempt reconnection
});

module.exports = connectDB;
