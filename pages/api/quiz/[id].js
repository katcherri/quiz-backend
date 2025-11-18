import { MongoClient } from 'mongodb';

let clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    const client = await clientPromise;
    const db = client.db('quizApp');
    
    if (req.method === 'GET') {
      const quiz = await db.collection('quizzes').findOne({ id });
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      res.status(200).json(quiz);
    }
    
    if (req.method === 'PATCH') {
      const { imageUrl } = req.body;
      await db.collection('quizzes').updateOne(
        { id },
        { $set: { maskImageUrl: imageUrl } }
      );
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}