# Blueprint

## Overview

An interactive web application that allows users to generate acrostic poems in both English and Korean. The user can enter a word, and the application will automatically generate a complete poem in real-time as they type. The application also includes a "copy to clipboard" feature. It is built with modern web technologies, including a custom Web Component for displaying the poems.

## Project Outline

### **Design and Features**

*   **Real-time Poem Generation:** The application automatically generates a complete acrostic poem in real-time as the user types a word into the input field.
*   **Copy to Clipboard:** A "Copy" button allows the user to easily copy the generated poem to their clipboard.
*   **Simplified Interface:** The user interface has been streamlined by removing the need for a "Generate" button, making the experience more intuitive and responsive.
*   **Clear Layout:** The interface is divided into two main sections: a form for user input and an output area where the generated poem is displayed.
*   **Modern Styling:** The application features a modern design with centered content, a responsive layout, and stylish form elements for a professional look.
*   **Web Components:** The application uses a custom `<acrostic-poem>` element to encapsulate the structure and styling of each poem. This promotes reusability and separation of concerns.
*   **Korean Language Support:** The application now supports Korean poem generation, with a dictionary of Korean poem lines and a Korean-friendly user interface.

### **File Structure**

*   **`index.html`:** The main entry point of the application. It contains the HTML structure, including the input field and the output section.
*   **`style.css`:** Provides the global styles for the application, including the layout, typography, and color scheme.
*   **`main.js`:** Contains the JavaScript logic for handling user input, generating the poem in real-time, and defining the `<acrostic-poem>` custom element.
*   **`blueprint.md`:** This file, providing a comprehensive overview and documentation of the project.

## Current Request

**Goal:** Implement real-time poem generation as the user types.

**Plan:**

1.  **`index.html`:**
    *   Remove the "Generate" button and the `<form>` element to simplify the interface.
2.  **`main.js`:**
    *   Change the event listener from `submit` to `input` to trigger poem generation on every keystroke.
3.  **`blueprint.md`:** Update the documentation to reflect the new real-time generation feature.
