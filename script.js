
const synth = window.speechSynthesis;
let msg;
let voices = [];
let isSpeaking = false;
let noVoicesAlertShown = false;

const voicesDropdown = document.querySelector('[name="voice"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');
const textArea = document.querySelector('[name="text"]');
const rateSlider = document.querySelector('[name="rate"]');
const pitchSlider = document.querySelector('[name="pitch"]');

// Load available voices
function populateVoices() {
  voices = synth.getVoices();

  voicesDropdown.innerHTML = "";

  if (voices.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No voices available";
    voicesDropdown.appendChild(option);
    return;
  }

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select A Voice";
  voicesDropdown.appendChild(defaultOption);

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voicesDropdown.appendChild(option);
  });

  const defaultIndex = voices.findIndex(voice => voice.default);
  if (defaultIndex !== -1) {
    voicesDropdown.value = String(defaultIndex);
  }

  noVoicesAlertShown = false;
}

// Fetch voices on page load
populateVoices();

// Fetch voices when they become available
synth.addEventListener("voiceschanged", populateVoices);

// Set selected voice
function setVoice() {
  const selectedIndex = Number(voicesDropdown.value);

  if (voicesDropdown.value !== "" && voices[selectedIndex]) {
    msg.voice = voices[selectedIndex];
  }
}

// Speak text
function speak() {
  const text = textArea.value;

  if (!text.trim()) {
    alert("Please enter some text!");
    return;
  }

  // Refresh voices if none are available
  if (voices.length === 0) {
    populateVoices();

    if (voices.length === 0) {
      if (!noVoicesAlertShown) {
        alert("No voices available. Please try again later.");
        noVoicesAlertShown = true;
      }
      return;
    }
  }

  // Stop previous speech
  synth.cancel();

  // Create a new utterance
  msg = new SpeechSynthesisUtterance(text);

  // Set rate and pitch
  msg.rate = Number(rateSlider.value);
  msg.pitch = Number(pitchSlider.value);

  // Set selected voice
  setVoice();

  // Speech completed
  msg.onend = () => {
    isSpeaking = false;
  };

  // Handle speech errors
  msg.onerror = (event) => {
    isSpeaking = false;
    if (event.error !== "canceled" && event.error !== "interrupted") {
      alert("Speech error: " + event.error);
    }
  };

  // Start speaking
  synth.speak(msg);
  isSpeaking = true;
}

// Stop speech
function stop() {
  synth.cancel();
  isSpeaking = false;
}

// Update rate and pitch while speaking
function setOption() {
  if (isSpeaking) {
    speak();
  }
}

// Speak button
speakButton.addEventListener("click", speak);

// Stop button
stopButton.addEventListener("click", stop);

// Rate slider
rateSlider.addEventListener("input", setOption);

// Pitch slider
pitchSlider.addEventListener("input", setOption);

// Change voice during speech
voicesDropdown.addEventListener("change", () => {
  if (isSpeaking) {
    speak();
  }
});