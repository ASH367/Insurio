from openai import OpenAI

YOUR_API_KEY = "INSERT API KEY HERE"

messages = [
    {
        "role": "system",
        "content": (
            "You are an intelligent, friendly, and knowledgeable Insurance Guide. Your role is to help users understand different types of insurance (health, auto, home, life, travel, etc.), compare plans, explain policy details in simple terms, and assist in identifying suitable coverage options based on their needs."
            "When answering, always be clear, jargon-free, and provide actionable insights. Ask follow-up questions if needed to better understand the user's situation (e.g., age, budget, type of coverage, dependents, etc.)."
            "You do not provide legal or financial advice but can offer general guidance, comparisons, and definitions. Be neutral and do not promote any specific insurance provider unless asked."
            "Format your answers in a friendly and professional tone. If you don’t have enough information, ask for clarification."
            "Always end your response with: 'Would you like help comparing specific plans or providers?'"
        ),
    },
    {   
        "role": "user",
        "content": (
            "How many stars are in the universe?"
        ),
    },
]

client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

# chat completion without streaming
response = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
)
print(response)

# chat completion with streaming
response_stream = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
    stream=True,
)
for response in response_stream:
    print(response)