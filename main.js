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
        } else if (lines.length > 0) { // If no title but lines exist, just display lines
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
                });
            });
        }
    }
}

customElements.define('acrostic-poem', AcrosticPoem);

const functions = firebase.functions();
const generateAcrosticPoemCallable = functions.httpsCallable('generateAcrosticPoem');

document.getElementById('generate-btn').addEventListener('click', async function() {
    const word = document.getElementById('word-input').value.trim();
    const length = document.querySelector('input[name="poem-length"]:checked').value;
    const generateBtn = document.getElementById('generate-btn');
    const poemOutput = document.getElementById('poem-output');

    if (!word) {
        alert('단어를 입력하세요.');
        return;
    }
    if (word.length < length) {
        alert(`단어는 최소 ${length}자 이상이어야 합니다.`);
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = '생성 중...';
    poemOutput.innerHTML = '<p>시를 생성 중입니다...</p>';

    try {
        const result = await generateAcrosticPoemCallable({ word: word.substring(0, length), length: parseInt(length) });
        const lines = result.data.poem; // Assuming the Cloud Function returns { poem: string[] }

        const poemElement = document.createElement('acrostic-poem');
        poemElement.setAttribute('title', word.substring(0, length));
        poemElement.innerHTML = lines.map(line => `<div>${line}</div>`).join('\n');

        poemOutput.innerHTML = ''; // Clear previous poem
        poemOutput.appendChild(poemElement);
        poemElement.render();

    } catch (error) {
        console.error("Error generating poem:", error);
        poemOutput.innerHTML = `<p style="color: red;">시 생성 중 오류 발생: ${error.message}</p>`;
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'N행시 생성';
    }
});
