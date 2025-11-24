import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { answers, average, result } = req.body;
  
  const quiz = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: Date.now(),
    answers,
    average,
    result,
    mask_image_url: ''
  };
  
  const { data, error } = await supabase
    .from('quizzes')
    .insert([quiz]);
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.status(200).json({ 
    success: true, 
    id: quiz.id,
    url: `https://quiz-backend-nine-xi.vercel.app/results/${quiz.id}` 
  });
}