
const synth = window.speechSynthesis;
let msg;
let voices = [];
let isSpeaking = false;

const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
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
}

// Fetch voices when available
populateVoices();
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
    return;
  }

  // Refresh voices if none are available
  if (voices.length === 0) {
    populateVoices();

    if (voices.length === 0) {
      return;
    }
  }

  // Stop previous speech before restarting
  synth.cancel();

  // Create a fresh utterance with current settings
  msg = new SpeechSynthesisUtterance(text);

  msg.rate = Number(rateSlider.value);
  msg.pitch = Number(pitchSlider.value);

  setVoice();

  msg.onend = () => {
    isSpeaking = false;
  };

  msg.onerror = () => {
    isSpeaking = false;
  };

  synth.speak(msg);
  isSpeaking = true;
}

// Stop speech immediately
function stop() {
  synth.cancel();
  isSpeaking = false;
}

// Update settings while speaking
function setOption() {
  if (isSpeaking) {
    speak();
  }
}

// Event listeners
speakButton.addEventListener("click", speak);
stopButton.addEventListener("click", stop);

// Update pitch and rate dynamically
rateSlider.addEventListener("input", setOption);
pitchSlider.addEventListener("input", setOption);

// Change voice during speech
voicesDropdown.addEventListener("change", () => {
  if (isSpeaking) {
    speak();
  }
});