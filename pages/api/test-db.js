import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  
  if (!url || !key) {
    return res.status(500).json({ 
      error: 'Missing env vars',
      hasUrl: !!url,
      hasKey: !!key
    });
  }
  
  try {
    const supabase = createClient(url, key);
    
    const { data, error } = await supabase
      .from('quizzes')
      .select('count')
      .limit(1);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Supabase connected!',
      tableExists: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}