document.addEventListener('DOMContentLoaded', () => {
    const startRecordingButton = document.getElementById('start-recording');
    const stopRecordingButton = document.getElementById('stop-recording');
    const recognizedTextArea = document.getElementById('recognized-text');
    const textInput = document.getElementById('text-input');
    const convertToSpeechButton = document.getElementById('convert-to-speech');
    const speakTextButton = document.getElementById('speak-text');
    const translatedTextArea = document.getElementById('translated-text');
    const inputLanguageSelect = document.getElementById('input-language');
    const outputLanguageSelect = document.getElementById('output-language');

    // Initialize SpeechRecognition API
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Start recording
    startRecordingButton.addEventListener('click', () => {
        recognition.lang = inputLanguageSelect.value;
        recognition.start();
        recognizedTextArea.placeholder = "Listening...";
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    });

    // Stop recording
    stopRecordingButton.addEventListener('click', () => {
        recognition.stop();
        recognizedTextArea.placeholder = "Press 'Start Recording' and speak...";
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
    });

    // Handle speech recognition result
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognizedTextArea.value = transcript;
        translateText(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        recognizedTextArea.placeholder = "Error occurred during recognition.";
    };

    // Translate text using Google Translate API
    const translateText = (text) => {
        const sourceLanguage = inputLanguageSelect.value.split('-')[0]; // Extract language code
        const targetLanguage = outputLanguageSelect.value;
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    translatedTextArea.value = data[0][0][0]; // Show translation
                } else {
                    translatedTextArea.value = "Translation failed.";
                }
            })
            .catch(error => {
                console.error('Translation error:', error);
                translatedTextArea.value = "Error during translation.";
            });
    };

    // Convert translated text to speech
    convertToSpeechButton.addEventListener('click', () => {
        if (!translatedTextArea.value.trim()) {
            alert("Please translate some text first.");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(translatedTextArea.value);
        utterance.lang = outputLanguageSelect.value;
        window.speechSynthesis.speak(utterance);
    });

    // Speak custom input text
    speakTextButton.addEventListener('click', () => {
        if (!textInput.value.trim()) {
            alert("Please enter some text to speak.");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        utterance.lang = outputLanguageSelect.value;
        window.speechSynthesis.speak(utterance);
    });
});
