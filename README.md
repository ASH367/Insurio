# Insurio - Frontend

**Insurio** is an intelligent insurance assistant that helps users find tailored insurance plans faster. By combining real-time web search with personalized document analysis, Insurio delivers accurate, trusted recommendations.

## 📸 Demo

[![Insurio Demo](https://img.youtube.com/vi/05jEwKGhr0w/0.jpg)](https://youtu.be/05jEwKGhr0w)

## ✨ Key Features

- **Personalized Recommendations**: Get insurance suggestions based on your profile
- **AI-Powered Chat**: Natural language queries about insurance
- **Real-Time Data**: Integrated with Marketplace API for current plans
- **Context-Aware**: Maintains conversation context using recent chat history

## 🚀 User Flow

1. **Form Page**:
   - Users input personal details (name, age, income, state)
   
2. **Chat Interface**:
   - 💬 Ask insurance-related questions via AI chat
   - ✅ Click **Recommend** for personalized insurance suggestions
     - Plans fetched via Marketplace API
     - Enhanced with Perplexity AI for better relevance
   - 🩺 Specialized health insurance queries with real-time data

## ⚙️ System Architecture

- **Frontend**: React.js with TailwindCSS
- **Data Persistence**:
  - User details temporarily stored
  - Chat history saved in MongoDB
  - Last 3 messages maintain session context
- **APIs**:
  - Axios for backend communication
  - Marketplace API for plan data
  - Perplexity AI for recommendation enhancement

## 🛠️ Technology Stack

| Component        | Technology               |
|------------------|--------------------------|
| Frontend         | React.js, JavaScript ES6+|
| Styling          | TailwindCSS              |
| Routing          | React Router             |
| State Management | Context API              |
| API Handling     | Axios                    |
| Database         | MongoDB                  |

## 🏁 Getting Started

### Prerequisites

- Node.js ≥ v14
- npm or yarn

### Installation

```
# Clone repository
git clone https://github.com/ASH367/insurance-assistant
cd insurance-assistant
```

# Install dependencies
```
npm install
```
# or
```
yarn install
```

## 🚀 Quick Start

# Clone and install
```
git clone https://github.com/ASH367/insurance-assistant
cd insurance-assistant
npm install  # or yarn install
```

# Development
```
npm start    # or yarn start
```

# Production build
```
npm run build  # or yarn build
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
