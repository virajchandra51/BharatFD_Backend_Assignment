# 🌍 Multilingual FAQ System

A **high-performance** Node.js-based **FAQ Management System** with **multilingual support**, **caching**, and a **WYSIWYG editor** for content management.

## 🚀 Features

✔️ **Multilingual FAQ Management** – Supports **8+ languages** via Google Translate API  
✔️ **Automated Translations** – FAQs auto-translate to **Hindi, Bengali, Spanish, French, German, Chinese, Arabic**, and more  
✔️ **High-Speed Performance** – **Redis caching** minimizes database queries  
✔️ **RESTful API** – Fully documented **CRUD API** for FAQ management  
✔️ **Scalable & Secure** – **Dockerized** for easy deployment with **MongoDB & Redis**  
✔️ **Comprehensive Testing** – **Unit & Integration tests** ensure system reliability  
✔️ **Production-Ready** – **Works in both local & cloud environments**

---

## 📂 Directory Structure

BharatFD_Backend_Assignment/ 
├── src/ 
│ ├── config/ 
│ │ ├── database.js # MongoDB connection 
│ │ └── redis.js # Redis connection 
│ ├── controllers/ 
│ │ └── faqController.js # FAQ CRUD operations 
│ ├── models/ 
│ │ └── FAQ.js # FAQ MongoDB model 
│ ├── routes/ 
│ │ └── faqRoutes.js # API routes 
│ ├── middleware/ 
│ │ ├── cache.js # Redis caching 
│ │ └── validator.js # Input validation 
│ ├── services/ 
│ │ └── translation.js # Google Translate API integration 
│ ├── app.js # Express app setup 
│ └── index.js # Server entry point 
├── tests/ 
│ └── faq-system.test.js # Unit & integration tests 
├── .env # Environment variables 
├── .gitignore 
├── package.json 
├── Dockerfile 
└── docker-compose.yml


---

## 📦 Prerequisites

- **Node.js 18+**
- **MongoDB**
- **Redis**
- **Google Cloud Translation API credentials**
- **Docker (optional, for containerized deployment)**

---

## 📌 Installation Guide

### 1️⃣ Clone the Repository
To begin, clone the repository to your local machine and navigate into the project directory:

```bash
git clone <your-repo-url>
cd faq-system
```

### 2️⃣ Install Dependencies
Ensure you have all required dependencies installed by running:

```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the following configuration details:

```env
MONGODB_URI=mongodb://localhost:27017/faq_system
REDIS_URL=redis://localhost:6379
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CREDENTIALS={"your":"credentials"}
PORT=3000
```

> 🔹 Replace `your-project-id` and `your-credentials` with your actual Google Cloud credentials.

### 4️⃣ Start the Server
Run the following commands based on your environment:

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

---

## 🐳 Docker Setup
To set up and run the project using Docker, use the following command:

```bash
docker-compose up --build
```

This will build and start the application inside a Docker container, ensuring a consistent and reproducible environment.

---

## 📡 API Endpoints
The FAQ system provides RESTful API endpoints for managing FAQs.

### 🔍 Retrieve FAQs
Fetch a list of frequently asked questions:

```bash
GET /api/faqs
```
By default, FAQs are returned in English. To fetch FAQs in a different language, use the `lang` query parameter:

```bash
GET /api/faqs?lang=hi   # Hindi
GET /api/faqs?lang=bn   # Bengali
GET /api/faqs?lang=es   # Spanish
GET /api/faqs?lang=fr   # French
GET /api/faqs?lang=de   # German
GET /api/faqs?lang=zh   # Chinese
GET /api/faqs?lang=ar   # Arabic
GET /api/faqs?lang=ru   # Russian
GET /api/faqs?lang=pt   # Portuguese
```

### ➕ Create a New FAQ
To create a new FAQ entry, send a POST request with the required JSON payload:

```bash
POST /api/faqs
Content-Type: application/json

{
  "question": "What is this FAQ about?",
  "answer": "This FAQ is about multilingual content management."
}
```

### ✏️ Update an Existing FAQ
Modify an existing FAQ entry by sending a PUT request with the updated details:

```bash
PUT /api/faqs/:id
Content-Type: application/json

{
  "question": "Updated question?",
  "answer": "Updated answer"
}
```

### 🗑️ Delete an FAQ
Remove an FAQ entry permanently using the DELETE request:

```bash
DELETE /api/faqs/:id
```

---

## 🧪 Testing
Run tests to ensure the system functions correctly:

```bash
npm test
```
To run tests with coverage reporting:

```bash
npm test -- --coverage
```

---

## ⚡ Caching Mechanism
To optimize response times and reduce database queries, the FAQ system leverages Redis caching.

### 🔹 Features of Caching Implementation:
- **FAQs are cached for 1 hour** to improve response times.
- **Automatic cache invalidation** ensures the latest data is retrieved after updates.
- **Language-based caching** enables efficient multilingual support using the `?lang=` parameter.
- **Enhanced performance** for frequently accessed FAQs.

---

## 🛠️ Technologies Used
The FAQ system is built using modern and scalable technologies:

- **Node.js / Express** – Server-side application framework
- **MongoDB / Mongoose** – NoSQL database for storing FAQs
- **Redis** – Caching mechanism for optimized performance
- **Docker** – Containerization for easy deployment
- **Google Cloud Translation API** – Multilingual support for FAQs

---

## 📜 License
This project is released under the **MIT License**. You are free to use, modify, and distribute it as per the terms of the license.

---

🚀 *Happy Coding!* 🎯



