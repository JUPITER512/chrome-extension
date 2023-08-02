// function convertRomanUrduToEnglish() {
//   const romanUrduText = document.getElementById('prompt-textarea').value;

//   const promptText = `Translate the following Roman Urdu text to English: ${romanUrduText}`;

//   const serverUrl = "http://localhost:3000/openaiapi";

//   fetch(serverUrl, {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//           "prompt": promptText,
//           "max_tokens": 60
//       })
//   }).then(response => response.json())
//   .then(data => {
//       if(data.choices && data.choices.length > 0){
//           const englishText = data.choices[0].text.trim();
//           console.log("Translated text: ", englishText);
//       }
//   }).catch(err => console.error(err));
// }
// document.getElementById("romanUrduToEng").addEventListener('click', convertRomanUrduToEnglish);




// function speechToText() {
//     let speechRecognition = new SpeechRecognition();
//     speechRecognition.lang = "en-US";
//     speechRecognition.continuous = true;
//     speechRecognition.interimResults = true;
//     speechRecognition.start();
//     speechRecognition.addEventListener("result", function(event) {
//       let text = event.results[0].transcript;  
//       document.getElementById("prompt-textarea").value = text;
//     });
//   }
//   document.getElementById("speechtotext").addEventListener("click", speechToText);