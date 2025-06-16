const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const API_KEY = process.env.MARKETPLACE_API_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PORT = process.env.PORT || 8000;
const Session = require("./models/Session");
const mongoose = require("mongoose");
const sessionRoutes = require("./routes/sessions");
app.use("/api/sessions", sessionRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


const SBM_STATES = {
  CA: "https://www.coveredca.com",
  CO: "https://connectforhealthco.com",
  CT: "https://accesshealthct.com",
  DC: "https://www.dchealthlink.com",
  ID: "https://www.yourhealthidaho.org",
  KY: "https://kynect.ky.gov",
  MA: "https://www.mahealthconnector.org",
  MD: "https://www.marylandhealthconnection.gov",
  MN: "https://www.mnsure.org",
  NJ: "https://www.getcovered.nj.gov",
  NM: "https://bewellnm.com",
  NV: "https://www.nevadahealthlink.com",
  NY: "https://nystateofhealth.ny.gov",
  PA: "https://pennie.com",
  RI: "https://healthsourceri.com",
  VT: "https://portal.healthconnect.vermont.gov",
  WA: "https://www.wahealthplanfinder.org"
};

// Marketplace Plans Endpoint
app.post("/marketplace-plans", async (req, res) => {
  try {
    const { income, age, gender, uses_tobacco, zipcode, countyfips, state, year = 2024, sessionId } = req.body;


    // Validation
    if (!income || !age || !zipcode || !countyfips || !state || !sessionId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Check for SBM state
    if (SBM_STATES[state]) {
      const staticMessage = `Heads up!  
    Currently, ${state} uses its own health insurance marketplace. We can’t pull plan data here. However, you can explore and compare plans directly on your state’s official health insurance marketplace website.`;
    
      let sessionPlan = await Session.findOne({ sessionId });
    
      if (sessionPlan) {
        sessionPlan.formData = { age, gender, income, zipcode, state, uses_tobacco };
        sessionPlan.messages.push(
          { role: "user", content: `User requested plans for SBM state: ${state}` },
          { role: "assistant", content: staticMessage }
        );
      } else {
        sessionPlan = new Session({
          sessionId,
          formData: { age, gender, income, zipcode, state, uses_tobacco },
          messages: [
            { role: "user", content: `User requested plans for SBM state: ${state}` },
            { role: "assistant", content: staticMessage }
          ]
        });
      }
    
      await sessionPlan.save();
    
      return res.json({
        available: false,
        message: staticMessage,
        suggestion: `You can explore available options directly at your state's official exchange:`,
        link: SBM_STATES[state]
      });
    }
    

    // Fetch plans
    const requestBody = {
      household: { income, people: [{ age, gender, uses_tobacco }] },
      market: "Individual",
      place: { countyfips, state, zipcode },
      year
    };
      
    const response = await axios.post(
      `https://marketplace.api.healthcare.gov/api/v1/plans/search?apikey=${API_KEY}`,
      requestBody
    );




    const processedPlans = response.data;

    // Generate AI recommendation
    const prompt = `Analyze these health plans for a ${age}-year-old ${gender} with $${income} income in ${zipcode}:
    
    Key Factors:
    - Tobacco use: ${uses_tobacco ? "Yes" : "No"}
    - Metal levels: Bronze (low premium/high deductible) to Platinum (high premium/low deductible)
    - Subsidy eligibility: ${processedPlans[0]?.subsidy_eligible ? "Yes" : "No"}
    
    Plans Data (USD):
    ${JSON.stringify(processedPlans)}
    
    Create a comparison table with Plan Name, Type, Monthly Cost, Deductible, and Metal Level.
    Recommend top 3 options considering total annual costs (premium + deductible).
    Highlight any tobacco surcharges or special conditions.`;

    const aiResponse = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "You are a health insurance expert. Format responses with clear headings, markdown tables, and concise bullet points."
          },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: { Authorization: `Bearer ${PERPLEXITY_API_KEY}` }
      }
    );
    let sessionPlan = await Session.findOne({ sessionId });

    if (sessionPlan) {
      // Update existing session
      sessionPlan.formData = { age, gender, income, zipcode, state, uses_tobacco };
      sessionPlan.messages.push(
        { role: "user", content: prompt },
        { role: "assistant", content: aiResponse.data.choices[0].message.content }
      );
    } else {
      // Create new session document
      sessionPlan = new Session({
        sessionId,
        formData: { age, gender, income, zipcode, state, uses_tobacco },
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: aiResponse.data.choices[0].message.content }
        ]
      });
    }
    await sessionPlan.save();

    
    res.json({
      plans: processedPlans,
      recommendation: aiResponse.data.choices[0].message.content,
      context: [{
        role: "system",
        content: `PLAN_DATA: ${JSON.stringify(processedPlans)}`
      }]
    });

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Chat Endpoint
app.post("/chat-with-ai", async (req, res) => {
  try {
    const { message, context = [], sessionId } = req.body;

    // Validate input
    if (!message?.trim() || !sessionId) return res.status(400).json({ error: "Empty message" });

    // Clean context and enforce alternation
    const validContext = [];
    let lastRole = null;
    
    context.forEach(msg => {
      if (["user", "assistant"].includes(msg.role) && msg.role !== lastRole) {
        validContext.push(msg);
        lastRole = msg.role;
      }
    });

    // Ensure context starts with user
    while (validContext.length > 0 && validContext[0].role === "assistant") {
      validContext.shift();
    }

    // Build messages array
    const messages = [
      {
        role: "system",
        content: `Answer ONLY health insurance queries. Prioritize accuracy/brevity.

RULES:
Greetings (e.g., "Hi," "Hello"): Respond in 1 sentence.
→ Example: "State your health insurance question."
Scope:
Answer ONLY: Policies, claims, coverage, premiums.
Non-insurance (e.g., billing, tech, wellness):
→ Reply: "I handle health insurance only. Ask about policies or claims."
→ Do not engage further.
Format:
Max 100 words.
Use dashes (-) for lists.
No sources/citations/numbers like [1].
Unclear? Ask: "Clarify your insurance question."
Accuracy:
Unsure → "Consult your insurer for details."
Never guess policy specifics.
EXAMPLES:
**Examples**:  
• User: "Thanks!" → Response: **"You're welcome. Proceed with your insurance question."**  
• User: "Hello" → Response: **"Greetings. State your health insurance query."**  
• User: "Appreciate it!" → Response: **"Acknowledged. What's your insurance question?"** `
      },
      ...validContext.slice(-4), // Keep last 2-3 exchanges
      { role: "user", content: message.trim() }
    ];

    // Final validation of role alternation
    for (let i = 1; i < messages.length; i++) {
      if (messages[i].role === messages[i-1].role) {
        messages.splice(i, 1); // Remove duplicate role
        i--;
      }
    }

    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        messages
      },
      {
        headers: { Authorization: `Bearer ${PERPLEXITY_API_KEY}` }
      }
    );   

    const reply = response.data.choices[0].message.content;

    let savedSession = await Session.findOne({ sessionId });

    if (savedSession) {
      savedSession.messages.push({ role: "user", content: message });
      savedSession.messages.push({ role: "assistant", content: reply });
    } else {
      savedSession = new Session({
        sessionId,
        formData: {},  // or carry over from somewhere if available
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: reply }
        ]
      });
    }

    await savedSession.save();

    res.json({
      reply,
      context: [
        ...validContext.slice(-4),
        { role: "user", content: message },
        { role: "assistant", content: reply }
      ].slice(-6) // Keep last 3 exchanges
    });

  } catch (error) {
    console.error("Chat error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error?.message || "AI service error"
    });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));