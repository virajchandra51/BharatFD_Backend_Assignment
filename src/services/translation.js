const { Translate } = require("@google-cloud/translate").v2;

class TranslationService {
	constructor() {
		// Validate environment variables
		if (!process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_CREDENTIALS) {
			throw new Error("❌ Missing Google Cloud Translation API credentials.");
		}

		try {
			this.translate = new Translate({
				projectId: process.env.GOOGLE_PROJECT_ID,
				credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
			});

			console.log("✅ Google Cloud Translation API initialized successfully.");
		} catch (error) {
			console.error("❌ Failed to initialize Translation API:", error);
			throw new Error("Translation API setup error.");
		}
	}

	/**
	 * Translates FAQ content (question & answer) into the specified language.
	 * Uses batch translation for improved performance.
	 *
	 * @param {Object} content - The object containing `question` and `answer`.
	 * @param {String} targetLang - The target language code (e.g., 'es', 'fr').
	 * @returns {Promise<Object>} - The translated content.
	 */
	async translateContent({ question, answer }, targetLang) {
		try {
			const [translations] = await this.translate.translate(
				[question, answer],
				targetLang
			);

			if (!Array.isArray(translations) || translations.length < 2) {
				throw new Error("Invalid translation response.");
			}

			return {
				question: translations[0] || question,
				answer: translations[1] || answer,
			};
		} catch (error) {
			console.error(`❌ Translation error for ${targetLang}:`, error.message);
			return { question, answer }; // Return original content in case of failure
		}
	}
}

module.exports = new TranslationService();
