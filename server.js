require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const app = express();

app.use(express.json());
app.use(cors());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/process-text', async (req, res) => {
    const text = req.body.text;

    try {
        const chatGptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "This is Roman Urdu, Please Translate it into simple English. /n Roman Urdu: Me Ja raha hun /n English: I am going /n Roman Urdu: "
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature: 0,
            max_tokens: 60,
        });

        const translatedText = chatGptResponse.data.choices[0].message.content;
        res.json({ translatedText: translatedText });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        res.status(500).send('Error translating the text');
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
