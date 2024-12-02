document.addEventListener('DOMContentLoaded', () => {
    const inputLanguageSelect = document.getElementById('input-language');
    const outputLanguageSelect = document.getElementById('output-language');
    const startRecordingButton = document.getElementById('start-recording');
    const stopRecordingButton = document.getElementById('stop-recording');
    const recognizedTextArea = document.getElementById('recognized-text');
    const translatedTextArea = document.getElementById('translated-text');
    const textInput = document.getElementById('text-input');
    const convertToSpeechButton = document.getElementById('convert-to-speech');
    const speakTextButton = document.getElementById('speak-text');
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    startRecordingButton.addEventListener('click', () => {
        recognition.lang = inputLanguageSelect.value;
        recognition.start();
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            recognizedTextArea.value = transcript;
            translateText(transcript);
        };
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    });
    
    stopRecordingButton.addEventListener('click', () => {
        recognition.stop();
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
    });

    const translateText = (text) => {
        const sourceLanguage = inputLanguageSelect.value;
        const targetLanguage = outputLanguageSelect.value;
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                translatedTextArea.value = data[0][0][0];
            })
            .catch(error => {
                console.error('Translation error:', error);
            });
    };

    convertToSpeechButton.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(translatedTextArea.value);
        utterance.lang = outputLanguageSelect.value;
        window.speechSynthesis.speak(utterance);
    });

    speakTextButton.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        utterance.lang = outputLanguageSelect.value;
        window.speechSynthesis.speak(utterance);
    });
});
