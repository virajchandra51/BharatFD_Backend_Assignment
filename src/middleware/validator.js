const { body, validationResult } = require("express-validator");

// FAQ Validation Middleware
const validateFaq = [
	body("question")
		.notEmpty()
		.withMessage("Question is required")
		.trim()
		.isLength({ min: 5 })
		.withMessage("Question must be at least 5 characters long"),

	body("answer")
		.notEmpty()
		.withMessage("Answer is required")
		.trim()
		.isLength({ min: 5 })
		.withMessage("Answer must be at least 5 characters long"),

	// Middleware to handle validation errors
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

module.exports = validateFaq;
