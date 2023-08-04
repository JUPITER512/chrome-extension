// +++++++++++++++++++++++++++++++++++++++




app.post('/transcribe-audio', upload.single('audio'), async (req, res) => {
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

    // Delete the audio file after transcription
    fs.unlink(audioFileName, (err) => {
        if (err) console.error('Error deleting audio file:', err);
    });
});




// +++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//send audio to server

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


        // function sendAudioToServer() {
        //     const audioBlob = new Blob(recordedChunks, { type: 'audio/mp3' });
        //     const formData = new FormData();
        //     formData.append('audio', audioBlob, 'audio.mp3');
        //     const serverUrl = "http://localhost:3001/transcribe-audio";
              
        //     fetch(serverUrl, {
        //         method: 'POST',
        //         body: formData
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log("Transcription: ", data.transcription);
        //     })
        //     .catch(err => {
        //         console.error('Error sending audio to server:', err);
        //     });
        
        //     mediaRecorder = null;
        //     recordedChunks = [];
        // }
        
        // function audioToText() {
        //     if (!mediaRecorder) {
        //         console.log("Start Recording")
        //         startRecording();
        //     } else {
        //         console.log("Stop Recording")
        //         stopRecording();
        //         console.log("Sending Audio to Server")
        //         sendAudioToServer();
        //     }   
        // }

  