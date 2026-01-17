# Blueprint

## Overview

An interactive web application that allows users to generate acrostic poems. The user can enter a word, and the application will automatically generate a complete poem. The application also includes a "copy to clipboard" feature. It is built with modern web technologies, including a custom Web Component for displaying the poems. This application also includes a feedback form, a consultation form, a comment section powered by Disqus, and an AI model demonstration with Teachable Machine.

## Project Outline

### **Design and Features**

*   **N-line Poem Generation:** The application automatically generates an N-line poem based on user input.
*   **Copy to Clipboard:** A "Copy" button allows the user to easily copy the generated poem to their clipboard.
*   **Feedback Form:** Users can send feedback through a form.
*   **Consultation Form:** Users can request a consultation by picking a date.
*   **Disqus Comments:** A comment section for user discussions.
*   **AI Model Demo:** A section to demonstrate an image classification model from Teachable Machine.
*   **Modern Styling:** The application features a modern design with centered content, a responsive layout, and stylish form elements for a professional look.
*   **Web Components:** The application uses a custom `<acrostic-poem>` element to encapsulate the structure and styling of each poem.
*   **Google AdSense:** The application is configured with Google AdSense for monetization.

### **File Structure**

*   **`index.html`:** The main entry point of the application.
*   **`style.css`:** Provides the global styles for the application.
*   **`main.js`:** Contains the JavaScript logic for the application.
*   **`blueprint.md`:** This file, providing a comprehensive overview and documentation of the project.
*   **`ads.txt`:** Contains information for Google AdSense.
*   **`GEMINI.md`:** Contains AI development guidelines.

## Current Request

**Goal:** Optimize the website to be "high quality" for Google AdSense.

**Plan:**

1.  **Refactor HTML (`index.html`):**
    *   Add a navigation bar for better user navigation.
    *   Add an "About Us" section to improve trustworthiness.
    *   Add a "Privacy Policy" section.
    *   Add a footer.
    *   Improve the semantic structure of the page.
2.  **Refactor CSS (`style.css`):**
    *   Improve the visual design to be more modern and appealing.
    *   Ensure the layout is responsive and mobile-friendly.
    *   Use CSS variables for better maintainability.
3.  **Refactor JavaScript (`main.js`):**
    *   Review the code for any performance issues.
    *   Ensure the N-line poem generation is working well.
    *   Add comments where necessary.
4.  **Update `GEMINI.md` and `blueprint.md`** to reflect the new features and improvements.