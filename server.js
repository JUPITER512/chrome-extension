

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const app = express();
app.use(express.json());
app.use(cors());
const fs = require('fs');


const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:\\Users\\92321\\Desktop\\Chrome Extension\\test-extension\\chrome-extension\\uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + ".mp3")
    }
  })

  const upload = multer({ storage: storage });




const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//Roman Urdu to English

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

        console.log(chatGptResponse)
        
        let translatedText = chatGptResponse.data.choices[0].message.content;

        if(translatedText.startsWith("English:")){
            translatedText=translatedText.replace("English:","")
        }
        
        res.json({ translatedText: translatedText });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        res.status(500).send('Error translating the text');
    }
});


//Correct English

app.post('/correct-grammar', async (req, res) => {
    const text = req.body.text;

    try {
        const chatGptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "This is Incorrect English Sentence, Please Correct the Grammar. /n Incorrect English : How you are! /n Correct English: How are you? /n Incorrect English: "
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature: 0,
            max_tokens: 60,
        });

        console.log(chatGptResponse)

        let correctedText = chatGptResponse.data.choices[0].message.content;
        res.json({ correctedText: correctedText });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        res.status(500).send('Error translating the text');
    }
});

//Audio to text
app.post('/transcribe-audio', upload.single('audio'), async (req, res) => {

    console.log(req.file);
    const audioFileName = req.file.path;

    try {
        const resp = await openai.createTranscription(
            fs.createReadStream(audioFileName),
            "whisper-1"
        );
        const transcription = resp.data.text;

        res.json({ transcription: transcription });
    } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).send('Error transcribing audio');
    }

    fs.unlink(audioFileName, (err) => {
        if (err) console.error('Error deleting audio file:', err);
    });
});




app.listen(3001, () => {
    console.log('Server is running on port 3001');
});




