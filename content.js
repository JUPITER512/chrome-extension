
document.body.addEventListener('keyup', function (event) {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'textarea' || (target.tagName.toLowerCase() === 'input' && target.type.toLowerCase() === 'text')) {
            let tooltip = document.getElementById('translationTooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'toggle';
                tooltip.id='translationTooltip'


                const checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';

                const buttonSpan = document.createElement('span');
                buttonSpan.className = 'button';

                const labelSpan = document.createElement('span');
                labelSpan.className = 'label';
                labelSpan.textContent = '☼';

                tooltip.appendChild(checkboxInput);
                tooltip.appendChild(buttonSpan);
                tooltip.appendChild(labelSpan);
                document.body.appendChild(tooltip);
            }

            tooltip.style.left = (target.getBoundingClientRect().left + target.offsetWidth +20) + 'px';
            tooltip.style.top = (target.getBoundingClientRect().top + 20) + 'px';
            
           
            tooltip.onclick = function () {
                let optionsBar = document.getElementById('optionsBar');
                if (!optionsBar) {
                    optionsBar = document.createElement('div');
                    optionsBar.id = 'optionsBar';
                    optionsBar.className = 'topcoat-button-bar';
                    
                    const buttonOne = document.createElement('button');
                    buttonOne.className = 'topcoat-button-bar__button';
                    buttonOne.innerText = 'One';
                    buttonOne.onclick = convertRomanUrduToEnglish;
                    optionsBar.appendChild(buttonOne);
                    
                    // const paste=document.createElement("button")
                    // paste.innerText='paste'
                    // paste.onclick= async () => {
                    //     try {
                    //       const text = await navigator.clipboard.readText()
                    //       document.getElementById('prompt-textarea').value = text;
                    //       console.log('Text pasted.');
                    //     } catch (error) {
                    //       document.getElementById('prompt-textarea').focus();
                    //       const result = document.execCommand('paste')
                    //       console.log('document.execCommand result: ', result);
                    //     }
                    //   }
                    //   optionsBar.appendChild(paste)


                    const buttonTwo = document.createElement('button');
                    buttonTwo.className = 'topcoat-button-bar__button';
                    buttonTwo.innerText = 'Two';
                    buttonTwo.onclick = correctGrammarErrors;
                    optionsBar.appendChild(buttonTwo);
            
                    const buttonThree = document.createElement('button');
                    buttonThree.className = 'topcoat-button-bar__button';
                    buttonThree.innerText = 'Three';
                    buttonThree.onclick=audioToText
                    optionsBar.appendChild(buttonThree);
                 

            
                    const closeButton = document.createElement('button');
                    closeButton.className = 'close_button';
                    closeButton.innerText = 'x';
                    closeButton.onclick = function() {
                        optionsBar.remove();
                    };
                    optionsBar.appendChild(closeButton);
            
                    document.body.appendChild(optionsBar);
                } else {
                    optionsBar.remove();
                }
                
                let newTop = tooltip.getBoundingClientRect().top - optionsBar.offsetHeight - 10; 
                optionsBar.style.left = tooltip.getBoundingClientRect().left + 'px';
                optionsBar.style.top = newTop + 'px';
            };
        }
    });
    
    function convertRomanUrduToEnglish() {
        const romanUrduText = document.getElementById('prompt-textarea').value;
        const serverUrl = "http://localhost:3001/process-text"; 
    
        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": romanUrduText
            })
        })
        .then(response => response.json())
        .then(data => {
                console.log("Text copied to clipboard");
                const element = document.getElementById("prompt-textarea")
                element.value = data.translatedText
                element.innerText = data.translatedText
            
            
        })
        .catch(err => console.error("Error fetching or processing data:", err));
    }
    
// function convertRomanUrduToEnglish() {
//         const romanUrduText = document.getElementById('prompt-textarea').value;
//         const serverUrl = "http://localhost:3001/process-text"; 
//         fetch(serverUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 "text": romanUrduText
//             })
//         }).then(response => response.json())
//         .then(data => {
//             navigator.clipboard.writeText(data.correctedText)
//             .then(() => {
//                 console.log("Text copied to clipboard");
//                 document.getElementById("prompt-textarea").defaultValue=data.correctedText;
//                 document.getElementById("prompt-textarea").innerHTML=data.correctedText;
//             })
//             .catch(err => console.error("Error copying text:", err));
//         }).catch(err => console.error(err));

        
//     }

    
    function correctGrammarErrors() {
        const promptText = document.getElementById('prompt-textarea').value;
        const serverUrl = "http://localhost:3001/correct-grammar";
      
        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": promptText
            })
        })
        .then(response => response.json())
        .then(data => {
            navigator.clipboard.writeText(data.correctedText)
                        .then(() => {
                            console.log("Text copied to clipboard");
                            document.getElementById("prompt-textarea").value=data.correctedText;
                            document.getElementById("prompt-textarea").innerHTML=data.correctedText;
                            document.getElementById("prompt-textarea").defaultValue=data.correctedText;
                        })
        })
        .catch(err => {
            console.log("ERROR FOUND IN correctGrammarMistake:", err);
        });
    }
    

//       //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//       //Record Audio
      
      let mediaRecorder;
      let recordedChunks = [];

        function startRecording() {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = event => {
                        if (event.data.size > 0) {
                            recordedChunks.push(event.data);
                        }
                    };
                    mediaRecorder.start();
                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                });
            }
            
            function stopRecording() {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }
            
           

    function sendAudioToServer() {

            const audioFile = new File(recordedChunks,"recorded_audio.mp3", { type: 'audio/mp3' });
            const formData = new FormData();
            formData.append('audio', audioFile);
            const serverUrl = "http://localhost:3001/transcribe-audio";
              
            fetch(serverUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log("Transcription: ", data.transcription);
            })
            .catch(err => {
                console.error('Error sending audio to server:', err);
            });
        
            mediaRecorder = null;
            recordedChunks = [];
        }
        
        function audioToText() {
            if (!mediaRecorder) {
                console.log("Start Recording")
                startRecording();
            } else {
                console.log("Stop Recording")
                stopRecording();
                console.log("Sending Audio to Server")
                sendAudioToServer();
            }   
        }
    
    

