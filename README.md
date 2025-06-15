# Insurio - Frontend

**Insurio** helps users find the right insurance faster and cleaner by combining real-time web search with personalized document understanding to provide fast and trusted answers.

## 📸 Demo

[![Demo Video](https://img.youtube.com/vi/05jEwKGhr0w/0.jpg)](https://youtu.be/05jEwKGhr0w)

## 🧠 About the Project

Users begin by entering their personal information (like name, age, income, and state) on the **Form Page**.

Once submitted, the data is sent to the backend, and the user is taken to the **Chat Page**, where they can:

- 💬 Ask questions related to insurance via the integrated AI
- ✅ Click the **Recommend** button to receive a personalized insurance suggestion
  - These are generated based on the user’s submitted information and location
  - Plans are fetched using the **Marketplace API**
  - The recommendation is enhanced using **Perplexity AI**
- 🩺 Specifically query about **health insurance** to get reliable and real-time information

### 🗃️ Chat & Data Handling

- User details are temporarily stored
- Chat history is saved in **MongoDB**
- Last 3 messages are used for session continuity

## 🛠️ Tech Stack

- React.js
- JavaScript (ES6+)
- HTML5 & CSS3
- TailwindCSS
- MongoDB – stores chat history and user interactions
- Axios – for backend/API communication
- React Router – for navigation

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
git clone https://github.com/ASH367/insurance-assistant
cd insurance-assistant
npm install
# or
yarn install 

### Run the Application
npm start
# or
yarn start

### Build for Production

npm run build
# or
yarn build

## 📄 License

This project is licensed under the [MIT License](LICENSE).
