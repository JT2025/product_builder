const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access your API key (see "Set up your API key" above)
const API_KEY = process.env.GEMINI_API_KEY; // Ensure this env variable is set in Firebase project config

if (!API_KEY) {
    console.error("GEMINI_API_KEY environment variable is not set.");
    // Exit or throw error if API key is critical for function execution
    // In production, you might want to return an error to the client instead of exiting.
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Using gemini-pro for 3.0 Pro capabilities

exports.generateAcrosticPoem = functions.https.onCall(async (data, context) => {
    // Check authentication if needed
    // if (!context.auth) {
    //     throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    // }

    const word = data.word;
    const length = data.length;

    if (!word || !length) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with "word" and "length" arguments.');
    }

    const characters = Array.from(word.substring(0, length));
    const prompt = `Create a ${length}-line acrostic poem using the word "${word}". Each line should start with a character from the word. The word is: ${characters.join('')}.
    For example, if the word is "APPLE" and length is 3, a possible poem could be:
    A: Always
    P: Playful
    P: Pups
    
    Return the poem lines as a JSON array of strings, where each string is a line of the poem. Do not include the starting character in the JSON array output. For example: ["Always", "Playful", "Pups"]
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Gemini sometimes includes markdown formatting (```json) or other conversational text
        // Attempt to extract JSON from the response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            text = jsonMatch[1];
        }

        let poemLines;
        try {
            poemLines = JSON.parse(text);
        } catch (jsonError) {
            console.error("Failed to parse Gemini response as JSON:", text, jsonError);
            // Fallback: If JSON parsing fails, try to split by lines
            poemLines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            // Further clean-up if lines still include the starting character or other artifacts
            poemLines = poemLines.map(line => {
                const firstCharMatch = line.match(/^(\S+):?\s*(.*)/); // Match "Char: Line" or "Char Line"
                return firstCharMatch ? firstCharMatch[2].trim() : line;
            }).filter(line => line.length > 0);
        }

        if (!Array.isArray(poemLines) || poemLines.length === 0) {
            throw new functions.https.HttpsError('internal', 'Gemini model did not return a valid poem array.', text);
        }
        
        // Ensure the poem has the requested number of lines
        while (poemLines.length < length) {
            poemLines.push("..."); // Pad if Gemini returns fewer lines than requested
        }
        poemLines = poemLines.slice(0, length); // Truncate if Gemini returns more lines than requested

        return { poem: poemLines };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new functions.https.HttpsError('internal', 'Failed to generate poem from Gemini model.', error.message);
    }
});
