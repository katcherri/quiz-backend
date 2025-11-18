// Javimport { MongoClient } from 'mongodb';

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(process.env.MONGODB_URI);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { answers, average, result } = req.body;
    
    const quiz = {
      id: Math.random().toString(36).substring(2, 15), // Simple ID generator
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
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/results/${quiz.id}` 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}