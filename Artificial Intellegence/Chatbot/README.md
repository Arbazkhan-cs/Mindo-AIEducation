# Mindo AI Chatbot

![Mindo AI Chatbot](https://api.placeholder.com/600/200)

## Overview

Mindo AI Chatbot is a modern, responsive web application that leverages the Groq API with the DeepSeek language model to provide intelligent conversational interactions. This React-based application features a sleek, intuitive interface with both light and dark themes, making it accessible and pleasant to use on any device.

## Features

- **AI-Powered Conversations**: Integrates with Groq's API using DeepSeek's LLM for intelligent responses
- **Thoughtful AI**: Configured to think step-by-step before answering questions
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes with preferences saved to local storage
- **Mobile-Optimized**: Side menu provides easy access to settings on smaller screens
- **Real-Time Feedback**: Visual "thinking" indicator shows when the AI is processing
- **Clean UI**: Modern interface with animated message transitions
- **Secure API Key Handling**: Input for your Groq API key with masked field for security

## Live Demo

[View Live Demo](#) (Replace with your deployed application URL)

## Screenshots

### Desktop View - Light Theme
![Desktop Light Theme](https://api.placeholder.com/800/450)

### Mobile View - Dark Theme
![Mobile Dark Theme](https://api.placeholder.com/300/600)

## Technology Stack

- **Frontend**: React.js
- **HTTP Client**: Axios
- **API**: Groq API
- **Language Model**: DeepSeek R1 Distill LLama 70B
- **Styling**: Custom CSS with CSS variables for theming

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Groq API key (sign up at [groq.com](https://groq.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mindo-chatbot.git
   cd mindo-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory (optional for default API key):
   ```
   REACT_APP_DEFAULT_GROQ_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter your Groq API Key**:
   - On desktop: Enter your API key in the field at the top
   - On mobile: Open the menu by clicking the hamburger icon (☰) and enter your API key

2. **Start chatting**:
   - Type your message in the input field at the bottom
   - Press the send button or hit Enter
   - The AI will process your message and respond

3. **Change theme**:
   - Click the theme toggle button (🌙/☀️) in the header

4. **Clear chat history**:
   - On mobile: Open the menu and click "Clear Chat"
   - On desktop: [Feature to be added]

## API Configuration

The application uses the DeepSeek R1 Distill LLama 70B model through Groq's API. The default configuration includes:

- **Model**: `deepseek-r1-distill-llama-70b`
- **Temperature**: 0.7 (balances creativity and coherence)
- **Max Tokens**: 1024 (maximum response length)

To customize these settings, modify the `sendMessage` function in `App.js`.

## Customization

### Changing Colors

The application uses CSS variables for theming. To change the color scheme, modify the variables in `App.css`:

```css
:root {
  --primary-color: #4361ee;
  --secondary-color: #3f37c9;
  /* other variables */
}
```

### Adding Features

Some ideas for extending the application:

- Voice input and output
- Message history storage (localStorage or backend)
- File attachment capabilities
- Response formatting options (markdown, code highlighting)
- Multiple AI models to choose from

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Groq](https://groq.com) for providing the API
- [DeepSeek](https://deepseek.ai) for the language model
- [React](https://reactjs.org) community for the framework and ecosystem

---

Created with ❤️ by Mido Developers
