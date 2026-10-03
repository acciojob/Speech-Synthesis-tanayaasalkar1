// Your script here.

const synth = window.speechSynthesis;
let msg = new SpeechSynthesisUtterance();
let voices = [];

const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');

let isSpeaking = false;

// Get available voices
function populateVoices() {
  voices = synth.getVoices();

  voicesDropdown.innerHTML = '<option value="">Select A Voice</option>';

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voicesDropdown.appendChild(option);
  });
}

// Load voices
populateVoices();
synth.addEventListener("voiceschanged", populateVoices);

// Set selected voice
function setVoice() {
  const selectedVoice = voices[Number(voicesDropdown.value)];

  if (selectedVoice) {
    msg.voice = selectedVoice;
  }
}

// Update rate, pitch and text
function setOption() {
  const text = document.querySelector('[name="text"]').value;
  const rate = document.querySelector('[name="rate"]').value;
  const pitch = document.querySelector('[name="pitch"]').value;

  msg.text = text;
  msg.rate = Number(rate);
  msg.pitch = Number(pitch);

  // Restart speech if settings change during playback
  if (isSpeaking) {
    speak();
  }
}

// Speak function
function speak() {
  const text = document.querySelector('[name="text"]').value;

  if (!text.trim()) {
    return;
  }

  if (voices.length === 0) {
    populateVoices();

    if (voices.length === 0) {
      return;
    }
  }

  // Stop previous speech
  synth.cancel();

  // Create a new utterance
  msg = new SpeechSynthesisUtterance(text);

  msg.rate = Number(document.querySelector('[name="rate"]').value);
  msg.pitch = Number(document.querySelector('[name="pitch"]').value);

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

// Stop speech
function stop() {
  synth.cancel();
  isSpeaking = false;
}

// Event listeners
speakButton.addEventListener("click", speak);
stopButton.addEventListener("click", stop);

options.forEach(option => {
  option.addEventListener("change", setOption);
  option.addEventListener("input", setOption);
});

// Change voice during speech
voicesDropdown.addEventListener("change", () => {
  if (isSpeaking) {
    speak();
  }
});