let target = null;
document.body.addEventListener("keyup", function (event) {
  target = event.target;
  if (
    target.tagName.toLowerCase() === "textarea" ||
    (target.tagName.toLowerCase() === "inputx" &&
      target.type.toLowerCase() === "text")
  ) {
    let tooltip = document.getElementById("translationTooltip");
    if (!tooltip) {
      tooltip = document.createElement("button");
      tooltip.id = "translationTooltip";
      tooltip.className = "contact-button";
      document.body.appendChild(tooltip);
    }

    tooltip.style.left =
      target.getBoundingClientRect().left + target.offsetWidth + 20 + "px";
    tooltip.style.top = target.getBoundingClientRect().top + "px";

    tooltip.onclick = function () {
      let optionsBar = document.getElementById("optionsBar");
      if (!optionsBar) {
        optionsBar = document.createElement("div");
        optionsBar.id = "optionsBar";
        optionsBar.className = "topcoat-button-bar";

        //TOPBAR HAVING CLOSE BUTTON
        const topBar = document.createElement("div");
        topBar.id = "optionsTopBar";
        topBar.className = "topBar";

        const closeButton = document.createElement("button");
        closeButton.className = "close_button";
        closeButton.innerText = "x";
        closeButton.onclick = function () {
          optionsBar.remove();
        };

        topBar.appendChild(closeButton);

        ``;
        //Body Box having Functionalities Buttons
        const bodyBox = document.createElement("div");
        bodyBox.id = "optionsBodyBox";
        bodyBox.id = "bodyBox";

        const buttonOne = document.createElement("button");
        buttonOne.classList.add("fnBtn", "topcoat-button-bar__button");
        buttonOne.innerText = "Convert";
        buttonOne.onclick = convertRomanUrduToEnglish;
        bodyBox.appendChild(buttonOne);

        const buttonTwo = document.createElement("button");
        buttonTwo.classList.add("fnBtn", "topcoat-button-bar__button");
        // buttonOne.classList.add('fnBtn topcoat-button-bar__button')
        buttonTwo.innerText = "Correction";
        buttonTwo.onclick = correctGrammarErrors;
        bodyBox.appendChild(buttonTwo);

        const buttonThree = document.createElement("button");
        buttonThree.classList.add("fnBtn", "topcoat-button-bar__button");
        buttonThree.id = "transcribeAudio";
        buttonThree.innerText = "Transcribe";
        buttonThree.onclick = audioToText;
        bodyBox.appendChild(buttonThree);

        // const buttonFour = document.createElement("button");
        // buttonFour.classList.add("fnBtn", "topcoat-button-bar__button");
        // buttonFour.innerText = "UrduToEnglish";
        // buttonFour.onclick = urduToEnglish;
        // bodyBox.appendChild(buttonFour);

        optionsBar.appendChild(topBar);
        optionsBar.appendChild(bodyBox);
        document.body.appendChild(optionsBar);
      } else {
        optionsBar.remove();
      }

      let newTop =
        tooltip.getBoundingClientRect().top - optionsBar.offsetHeight - 10;
      optionsBar.style.left = tooltip.getBoundingClientRect().left + "px";
      optionsBar.style.top = newTop + "px";
    };
  }
});

function convertRomanUrduToEnglish() {
  const romanUrduText = target.value;
  const serverUrl = "http://localhost:3001/process-text";

  fetch(serverUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: romanUrduText,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Text copied to clipboard");
      target.value = data.translatedText;
      target.innerText = data.translatedText;
    })
    .catch((err) => console.error("Error fetching or processing data:", err));
}

function correctGrammarErrors() {
  const promptText = document.getElementById("prompt-textarea").value;
  const serverUrl = "http://localhost:3001/correct-grammar";

  fetch(serverUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: promptText,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      navigator.clipboard.writeText(data.correctedText).then(() => {
        console.log("Text copied to clipboard");
        document.getElementById("prompt-textarea").value = data.correctedText;
        document.getElementById("prompt-textarea").innerHTML =
          data.correctedText;
        document.getElementById("prompt-textarea").defaultValue =
          data.correctedText;
      });
    })
    .catch((err) => {
      console.log("ERROR FOUND IN correctGrammarMistake:", err);
    });
}

//       //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//       //Record Audio

let mediaRecorder;
let recordedChunks = [];

function startRecording() {
  console.log(recordedChunks, " onStart");
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        
          sendAudioToServer();
          audioType='';
        
        
        // else if(audioType='urdu'){
        //   urduToEngServer();
        //   audioType=''
        //   return;
        // }
      };
      mediaRecorder.start();
    })
    .catch((error) => {
      console.error("Error accessing microphone:", error);
    });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    recordedChunks = [];
  }
}

function sendAudioToServer() {
  const audioFile = new File(recordedChunks, "recorded_audio", {
    type: "audio/mp3",
  });
  const formData = new FormData();
  formData.append("audio", audioFile);
  const serverUrl = "http://localhost:3001/transcribe-audio";

  fetch(serverUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Transcription: ", data.transcription);
      target.value=data.transcription;
    })
    .catch((err) => {
      console.error("Error sending audio to server:", err);
    });

  mediaRecorder = null;
  recordedChunks = [];
}




// function urduToEngServer() {
//   const audioFile = new File(recordedChunks, "recorded_audio", {
//     type: "audio/mp3",
//   });
//   const formData = new FormData();
//   formData.append("audio", audioFile);
//   const serverUrl = "http://localhost:3001/urdutoenglish";

//   fetch(serverUrl, {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Transcription: ", data.englishfromurdu);
//       target.value = data.englishfromurdu;
//     })
//     .catch((err) => {
//       console.error("Error sending audio to server:", err);
//       resetRecordedChunks();
//     });

//   mediaRecorder = null;
//   recordedChunks = [];
// }



// let audioType='';
function audioToText() {
  if (!mediaRecorder) {
    console.log("Start Recording");
    // audioType='other';
    startRecording();
  } else {
    console.log("Stop Recording");
    stopRecording();
  }
}


// function urduToEnglish() {
//   if (!mediaRecorder) {
//     console.log("Start Urdu Recording");
//     audioType='urdu'
//     startRecording();
//   } else {
//     console.log("Stop Urdu Recording");
//     stopRecording()
//   }
// }
