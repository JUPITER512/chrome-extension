document.body.addEventListener('keyup', function (event) {
    const target = event.target;
    console.log(target)

    if (target.tagName.toLowerCase() === 'textarea' || (target.tagName.toLowerCase() === 'input' && target.type.toLowerCase() === 'text')) {
        // Create tooltip if it doesn't exist
        let tooltip = document.getElementById('translationTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'translationTooltip';
            tooltip.className = 'contact-button';
            document.body.appendChild(tooltip);
        }

        // Position the tooltip near the text input field
        tooltip.style.left = (target.getBoundingClientRect().left + target.offsetWidth + 20) + 'px';
        tooltip.style.top = target.getBoundingClientRect().top + 'px';

        // Create the options bar when tooltip is clicked
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
                
                const buttonTwo = document.createElement('button');
                buttonTwo.className = 'topcoat-button-bar__button';
                buttonTwo.innerText = 'Two';
                // buttonTwo.onclick = speechToText;
                optionsBar.appendChild(buttonTwo);
                const buttonThree = document.createElement('button');
                buttonThree.className = 'topcoat-button-bar__button';
                buttonThree.innerText = 'Three';
                optionsBar.appendChild(buttonThree);

                document.body.appendChild(optionsBar);
            }

            // Position the options bar near the tooltip
            optionsBar.style.left = (tooltip.getBoundingClientRect().left + tooltip.offsetWidth + 10) + 'px';
            optionsBar.style.top = tooltip.getBoundingClientRect().top + 'px';
        };
    }
});

function convertRomanUrduToEnglish() {
    const romanUrduText = document.getElementById('prompt-textarea').value;
    console.log(romanUrduText)
  
    const serverUrl = "http://localhost:3001/process-text";  // Updated to match server.js
  
    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "text": romanUrduText
        })
    }).then(response => response.json())
    .then(data => {
        console.log("Translated text: ", data.translatedText);
        document.getElementById('prompt-textarea').value=data.translatedText
    }).catch(err => console.error(err));
}























// function convertRomanUrduToEnglish() {
//     const romanUrduText = document.getElementById('prompt-textarea').value;
  
//     const promptText = `Translate the following Roman Urdu text to English: ${romanUrduText}`;
  
//     const serverUrl = "http://localhost:3001/openaiapi"; // Changed port to match server.js
  
//     fetch(serverUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             "prompt": promptText,
//             "max_tokens": 60
//         })
//     }).then(response => response.json())
//     .then(data => {
//         if(data.choices && data.choices.length > 0){
//             const englishText = data.choices[0].text.trim();
//             console.log("Translated text: ", englishText);
//         }
//     }).catch(err => console.error(err));
// };
//   function speechToText() {
//       let speechRecognition = new SpeechRecognition();
//       speechRecognition.lang = "en-US";
//       speechRecognition.continuous = true;
//       speechRecognition.interimResults = true;
//       speechRecognition.start();
//       speechRecognition.addEventListener("result", function(event) {
//         let text = event.results[0].transcript;  
//         document.getElementById("prompt-textarea").value = text;
//       });
//     }