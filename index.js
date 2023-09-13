const express = require('express');
const readline = require('readline');
const axios = require('axios');

// Replace 'YOUR_OPENAI_API_KEY' with your actual API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Middleware to parse JSON request bodies
app.use(express.json());

async function askQuestion() {
  const question = await promptUser('Enter your question (or type "exit" to quit): ');

  if (question.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
    return;
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        prompt: question,
        max_tokens: 400,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Response:', response.data.choices[0].text);
    askQuestion(); // Ask another question recursively
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    askQuestion(); // Ask another question recursively
  }
}

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
  console.log('Type your questions below. Type "exit" to quit.');
  askQuestion();
});