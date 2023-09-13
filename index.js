const express = require('express');
const axios = require('axios');
const readline = require('readline');
require('dotenv').config();




const app = express();
const port = 3000; 


const apiKey = process.env.OPENAI_API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


app.use(express.json());


function removeNewlines(text) {
  return text.replace(/\n/g, '');
}


function sendpropmpt(prompt1){


  
  
    if(prompt1){
      return  axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: prompt1,
        max_tokens: 50, 
        temperature: 0.2,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          temperature: 0.1,
        },
      })

    }else{

    app.post('/generate', (req, res) => {
         const { prompt } = req.body;
 

      axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: prompt,
        max_tokens: 50, 
        temperature: 0.2,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          temperature: 0.1,
        },
      })
        .then(response => {
          const generatedText = response.data.choices[0].text;
          const cleanedText = removeNewlines(generatedText);
          // Send the cleaned text as a JSON response
          res.json({ generatedText: cleanedText });
      
        })
        .catch(error => {
          console.error('Error:', error);
          res.status(500).json({ error: 'An error occurred' });
        });
         });

    }

   


}


//Using command line interface


rl.question('Enter your prompt: ', (prompt) => {
  let x= sendpropmpt(prompt)
  console.log(x)
    x.then((response) => {
      const generatedText = response.data.choices[0].text;
      const cleanedText = removeNewlines(generatedText);
      console.log(`Generated Text: ${cleanedText}`);
      rl.close();
    })
    .catch((error) => {
      console.error('Error:', error);
      rl.close();
    });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  sendpropmpt()
});





