const GROQ_API_KEY = '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'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callGroqAPI(messages: GroqMessage[], model = 'llama3-8b-8192') {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Sorry, I could not process your request.'
  } catch (error) {
    console.error('Groq API Error:', error)
    return 'Sorry, I am currently experiencing technical difficulties. Please try again later.'
  }
}

export async function translateText(text: string, targetLanguage: 'hindi' | 'gujarati' | 'english') {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: `You are a helpful translation assistant. Translate the following text to ${targetLanguage}. Only return the translated text, nothing else.`
    },
    {
      role: 'user',
      content: text
    }
  ]
  
  return await callGroqAPI(messages)
}

export async function categorizeHelpRequest(description: string) {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are a disaster relief categorization assistant. Categorize the following help request into one of these categories: earthquake, flood, food, water, shelter, medical, financial, personal. Only return the category name in lowercase.'
    },
    {
      role: 'user',
      content: description
    }
  ]
  
  return await callGroqAPI(messages)
}

export async function analyzeSentiment(text: string) {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are a mental health sentiment analysis assistant. Analyze the emotional state of the following text and return a JSON object with "sentiment" (positive/neutral/negative/crisis), "riskLevel" (low/medium/high/critical), and "needsEscalation" (true/false). Only return valid JSON.'
    },
    {
      role: 'user',
      content: text
    }
  ]
  
  const result = await callGroqAPI(messages)
  try {
    return JSON.parse(result)
  } catch {
    return { sentiment: 'neutral', riskLevel: 'low', needsEscalation: false }
  }
}

export async function generateAIResponse(userMessage: string, context: string = '') {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: `You are Saathi, a compassionate AI mental health companion. You provide supportive, empathetic responses to people in need. Always be kind, understanding, and encouraging. If someone seems to be in crisis or mentions self-harm, gently suggest professional help. Keep responses concise but meaningful. ${context}`
    },
    {
      role: 'user',
      content: userMessage
    }
  ]
  
  return await callGroqAPI(messages)
}