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
        poemHTML = lines.map((line, index) => {
            if (index < title.length) {
                // Extract the first character from the line for bolding
                const boldedChar = `<strong>${title[index]}</strong>`;
                return `<p>${boldedChar}${line}</p>`;
            }
            return '';
        }).join('');

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="wrapper">
                <button id="copy-btn">Copy</button>
                <h3>${title}</h3>
                <div id="poem-content">${poemHTML}</div>
            </div>
        `;

        this.shadowRoot.getElementById('copy-btn').addEventListener('click', () => {
            const poemText = Array.from(this.shadowRoot.querySelector('#poem-content').children).map(p => p.textContent).join('\n');
            navigator.clipboard.writeText(poemText).then(() => {
                alert('Poem copied to clipboard!');
            });
        });
    }
}

customElements.define('acrostic-poem', AcrosticPoem);

document.getElementById('generate-btn').addEventListener('click', function() {
    const word = document.getElementById('word-input').value.trim();
    const length = document.querySelector('input[name="poem-length"]:checked').value;

    if (word) {
        if (word.length < length) {
            alert(`단어는 최소 ${length}자 이상이어야 합니다.`);
            return;
        }
        generatePoem(word, length);
    }
});

const poemLines = {
    A: 'rtistic and bright,', B: 'old and brave,', C: 'alm and cool,', D: 'aring and bold,', E: 'legant and bright,',
    F: 'antastic and fun,', G: 'racious and grand,', H: 'appy and kind,', I: 'ntelligent and bright,', J: 'oyful and jolly,',
    K: 'ind and true,', L: 'ovely and bright,', M: 'agnificent and bold,', N: 'eat and new,', O: 'pen and true,',
    P: 'erfect and pure,', Q: 'uiet and calm,', R: 'adiant and rare,', S: 'unny and bright,', T: 'rue and trusted,',
    U: 'nique and upbeat,', V: 'ibrant and vivid,', W: 'onderful and wise,', X: 'enodochial and kind,', Y: 'oung and youthful,',
    Z: 'ealous and zesty,'
};

const koreanPoemLines = {
    '태': '산처럼 듬직하고',
    '용': '기 있는 사람',
    '제': '가 당신의 의도를 파악해서',
    '미': '래의 버그까지 미리 잡고',
    '니': '즈에 꼭 맞는 코드를 만들게요.',
    '인': '제 걱정은 그만',
    '공': '들인 당신의 프로젝트',
    '지': '치지 않고 제가 도울게요',
    '능': '력과 열정만 준비하세요',
    '봇': '물처럼 쏟아지는 아이디어를 현실로!',
};

function generatePoem(word, length) {
    const poemOutput = document.getElementById('poem-output');
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(word);
    const wordForPoem = word.substring(0, length);
    let lines;

    if (isKorean) {
        lines = Array.from(wordForPoem).map(letter => koreanPoemLines[letter] || '...');
    } else {
        lines = Array.from(wordForPoem.toUpperCase()).map(letter => poemLines[letter] || '...');
    }

    const poemElement = document.createElement('acrostic-poem');
    poemElement.setAttribute('title', wordForPoem);
    poemElement.innerHTML = lines.map(line => `<div>${line}</div>`).join('\n');

    poemOutput.innerHTML = ''; // Clear previous poem
    poemOutput.appendChild(poemElement);
    poemElement.render(); // Re-render to apply new content
}
