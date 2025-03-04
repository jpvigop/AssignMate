# AssignMate

AssignMate is an AI-powered web application that helps students generate assignment responses in their own writing style. This MVP allows students to input a sample of their writing, relevant class materials, and an assignment prompt to receive a personalized assignment response.

## Features

- **Advanced Style Analysis**: Analyzes your writing sample to identify multiple dimensions of your unique writing style, including sentence structure, vocabulary preferences, punctuation patterns, and personal quirks.
- **Intelligent Content Integration**: Extracts key terminology, definitions, facts, quotes and examples from course materials and naturally incorporates them into your response.
- **Assignment Understanding**: Identifies the type of assignment and its specific requirements to generate appropriately structured content.
- **Human-like Content Generation**: Creates responses that maintain authenticity and avoid AI detection.
- **Natural Style Matching**: Generates content that accurately mimics your writing style, making it indistinguishable from your own work.
- **Simple Interface**: User-friendly web interface with detailed guidance for optimal results.

## How It Works

AssignMate uses advanced natural language processing to:

1. **Analyze Writing Patterns**: It examines multiple dimensions of your writing:
   - Sentence length distribution and variance
   - Paragraph structure and organization
   - Vocabulary richness and word choice preferences
   - Punctuation and formatting habits
   - Transition patterns and sentence starters
   - Complexity measures and clause structures
   - Authentic error patterns and quirks
   - Personal stylistic preferences

2. **Process Course Materials**: The system intelligently extracts:
   - Key terminology and domain-specific vocabulary
   - Important definitions and concepts
   - Numerical data, statistics, and dates
   - Notable quotes and statements
   - Examples, case studies, and illustrations
   - Overall structure and content organization

3. **Understand Assignment Requirements**: The system identifies:
   - Assignment type (analytical, argumentative, comparative, etc.)
   - Expected word count and formatting
   - Citation requirements
   - Key instruction verbs (analyze, explain, compare, etc.)

4. **Create Human-like Content**: The system crafts responses that:
   - Maintain your natural writing variability
   - Incorporate human-like inconsistencies
   - Avoid the perfectionism of typical AI-generated text
   - Include occasional tangential thoughts or incomplete structures
   - Adapt to the assignment domain while preserving your style fingerprint

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **AI**: Hugging Face Inference API for text generation

## Setup Instructions

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Hugging Face API key

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd assignmate
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Create a `.env` file in the server directory with your Hugging Face API key:
   ```
   PORT=5000
   HUGGINGFACE_API_KEY=hf_your_huggingface_api_key_here
   ```

   To get a Hugging Face API key:
   - Create an account at https://huggingface.co/
   - Go to Settings → Access Tokens
   - Create a new token (Read access is sufficient)

4. Start the development servers:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. **Input your writing sample**: Paste 200-300 words of text you've written (essays, reports, blog posts) to help the AI understand your personal style.

2. **Add class materials**: Enter lecture notes, textbook excerpts, or research findings, including key concepts, definitions, statistics, quotes, and examples.

3. **Enter assignment prompt**: Type in the specific assignment you need to complete, including any requirements about length or format.

4. **Generate your assignment**: Click the "Generate Assignment" button and wait for your personalized response.

5. **Review and refine**: Copy the generated text and make any necessary adjustments before submitting.

## License

MIT

## Disclaimer

This tool is designed to assist students with generating ideas and drafts based on their own writing style and class materials. Users should review and modify all generated content to ensure accuracy and originality. The application is meant as a learning aid, not a substitute for original academic work. 