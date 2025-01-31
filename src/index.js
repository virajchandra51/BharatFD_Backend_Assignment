const { app, mongoose } = require("./app");

// Connect to MongoDB and Start Server
const startServer = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to MongoDB");

		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`🚀 Server is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("❌ MongoDB Connection Failed:", error.message);
		process.exit(1); // Exit on failure
	}
};

startServer();
