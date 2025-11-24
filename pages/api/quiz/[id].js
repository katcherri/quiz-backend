import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.status(200).json(data);
  }
  
  if (req.method === 'PATCH') {
    const { imageUrl } = req.body;
    
    const { error } = await supabase
      .from('quizzes')
      .update({ mask_image_url: imageUrl })
      .eq('id', id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(200).json({ success: true });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}