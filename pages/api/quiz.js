import { MongoClient } from 'mongodb';

let clientPromise;

if (!global._mongoClientPromise) {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', allowedMethods: ['POST'] });
  }
  
  const { answers, average, result } = req.body;
  
  // Validate input
  if (!answers || average === undefined || !result) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const quiz = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: Date.now(),
    answers,
    average,
    result,
    maskImageUrl: ''
  };
  
  try {
    const client = await clientPromise;
    const db = client.db('quizApp');
    await db.collection('quizzes').insertOne(quiz);
    
    res.status(200).json({ 
      success: true, 
      id: quiz.id,
      url: `https://quiz-backend-3l5zy044r-big-guys-projects-bde665b9.vercel.app/results/${quiz.id}` 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', message: error.message });
  }
}