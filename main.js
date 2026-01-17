// =================================================================================
// Acrostic Poem Web Component
// =================================================================================

class AcrosticPoem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || '';
        const lines = this.innerHTML.split('\n').filter(line => line.trim() !== '');

        const style = `
            .wrapper {
                padding: 15px;
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: #f9f9f9;
                position: relative;
            }
            h3 {
                margin-top: 0;
            }
            p {
                margin: 5px 0;
            }
            #copy-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 5px 10px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            #copy-btn:hover {
                background-color: #0056b3;
            }
        `;

        let poemHTML = '';
        if (title && lines.length > 0) {
            poemHTML = lines.map((line, index) => {
                if (index < title.length) {
                    const boldedChar = `<strong>${title[index]}</strong>`;
                    return `<p>${boldedChar}${line}</p>`;
                }
                return '';
            }).join('');
        } else if (lines.length > 0) {
            poemHTML = lines.map(line => `<p>${line}</p>`).join('');
        }
        

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="wrapper">
                <button id="copy-btn">Copy</button>
                <h3>${title}</h3>
                <div id="poem-content">${poemHTML}</div>
            </div>
        `;

        const copyBtn = this.shadowRoot.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const poemText = Array.from(this.shadowRoot.querySelector('#poem-content').children).map(p => p.textContent).join('\n');
                navigator.clipboard.writeText(poemText).then(() => {
                    alert('Poem copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Could not copy poem to clipboard. Please check browser permissions.');
                });
            });
        }
    }
}

customElements.define('acrostic-poem', AcrosticPoem);


// =================================================================================
// Firebase Cloud Function for Poem Generation
// =================================================================================

const functions = firebase.functions();
const generateAcrosticPoemCallable = functions.httpsCallable('generateAcrosticPoem');

document.getElementById('generate-btn').addEventListener('click', async function() {
    const word = document.getElementById('word-input').value.trim();
    const length = document.querySelector('input[name="poem-length"]:checked').value;
    const generateBtn = document.getElementById('generate-btn');
    const poemOutput = document.getElementById('poem-output');

    if (!word) {
        alert('Please enter a word to generate a poem.');
        return;
    }
    if (word.length < length) {
        alert(`The word must be at least ${length} characters long.`);
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    poemOutput.innerHTML = '<p>Generating your poem...</p>';

    try {
        const result = await generateAcrosticPoemCallable({ word: word.substring(0, length), length: parseInt(length) });
        const lines = result.data.poem;

        if (!lines || lines.length === 0) {
            throw new Error('No poem was generated. Please try a different word.');
        }

        const poemElement = document.createElement('acrostic-poem');
        poemElement.setAttribute('title', word.substring(0, length));
        poemElement.innerHTML = lines.map(line => `<div>${line}</div>`).join('\n');

        poemOutput.innerHTML = ''; // Clear previous poem
        poemOutput.appendChild(poemElement);
        poemElement.render();

    } catch (error) {
        console.error("Error generating poem:", error);
        poemOutput.innerHTML = `<p style="color: red;">An error occurred while generating the poem: ${error.message}</p>`;
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate N-Poem';
    }
});


// =================================================================================
// Teachable Machine Model Integration
// =================================================================================

const URL = "https://teachablemachine.withgoogle.com/models/nBYS7nNTy/";

let model, labelContainer, maxPredictions;

async function initTeachableMachine() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    const loadModelBtn = document.querySelector("#teachable-machine-section .controls button[onclick='initTeachableMachine()']");
    loadModelBtn.textContent = "Loading Model...";
    loadModelBtn.disabled = true;

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
        
        const imageUpload = document.getElementById("image-upload");
        const uploadedImage = document.getElementById("uploaded-image");

        imageUpload.addEventListener("change", (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadedImage.src = event.target.result;
                    uploadedImage.style.display = "block";
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        loadModelBtn.textContent = "Model Loaded";
    } catch (error) {
        console.error("Error loading Teachable Machine model:", error);
        loadModelBtn.textContent = "Load Failed";
        alert("There was an error loading the AI model. Please check the console for details.");
    }
}

async function predictUploadedImage() {
    const predictBtn = document.querySelector("#teachable-machine-section .controls button[onclick='predictUploadedImage()']");

    if (!model) {
        alert("Please load the model first.");
        return;
    }
    const image = document.getElementById("uploaded-image");
    if (!image.src || image.src.endsWith("#")) {
        alert("Please upload an image first.");
        return;
    }
    
    predictBtn.textContent = "Analyzing...";
    predictBtn.disabled = true;
    
    try {
        const prediction = await model.predict(image);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    } catch (error) {
        console.error("Error during prediction:", error);
        alert("An error occurred during image analysis. Please check the console for details.");
    } finally {
        predictBtn.textContent = "Analyze Image";
        predictBtn.disabled = false;
    }
}
