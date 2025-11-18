import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Results() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  
  useEffect(() => {
    if (id) {
      fetch(`/api/quiz/${id}`)
        .then(res => res.json())
        .then(data => setQuiz(data));
    }
  }, [id]);
  
  if (!quiz) return <div>Loading...</div>;
  
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h1>Your Quiz Results</h1>
      <h2>{quiz.result}</h2>
      <p>Average Score: {(quiz.average * 100).toFixed(0)}%</p>
      
      {quiz.maskImageUrl && (
        <img src={quiz.maskImageUrl} alt="Your Mask" style={{ maxWidth: '100%', margin: '20px 0' }} />
      )}
      
      <div style={{ textAlign: 'left', margin: '20px' }}>
        <h3>Your Answers:</h3>
        {quiz.answers.map((answer, i) => (
          <p key={i}>Choice {i + 1}: {answer}</p>
        ))}
      </div>
      
      <p style={{ fontSize: '12px', color: '#666' }}>
        Completed: {new Date(quiz.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
```

### **Step 5: Create Environment Variables**

Create **`.env.local`** file in root of project:
```
MONGODB_URI=your-mongodb-connection-string-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000