require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Hugging Face Configuration
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Function to analyze writing style
function analyzeWritingStyle(text) {
  // Enhanced writing style analysis that looks at multiple dimensions
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n/);
  
  if (sentences.length === 0) {
    return { avgSentenceLength: 0 };
  }
  
  // Basic sentence structure analysis
  const wordCounts = sentences.map(sentence => 
    sentence.trim().split(/\s+/).length
  );
  
  const sentenceLengths = {
    min: Math.min(...wordCounts),
    max: Math.max(...wordCounts),
    avg: Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length),
    variance: calculateVariance(wordCounts)
  };
  
  // Paragraph structure
  const paragraphLengths = paragraphs.map(p => 
    (p.match(/[^.!?]+[.!?]+/g) || []).length
  ).filter(length => length > 0);
  
  // Vocabulary analysis
  const vocabularyAnalysis = analyzeVocabulary(text);
  
  // Punctuation and formatting patterns
  const punctuationAnalysis = analyzePunctuation(text);
  
  // Sentence beginnings and transitions
  const transitionsAnalysis = analyzeTransitions(text, sentences);
  
  // Sentence complexity analysis
  const complexityAnalysis = analyzeComplexity(sentences);
  
  // Error patterns (spelling, grammar quirks)
  const errorPatterns = analyzeErrorPatterns(text);
  
  // Stylistic preferences
  const stylisticPreferences = analyzeStyle(text, sentences);
  
  return {
    sentenceStructure: sentenceLengths,
    paragraphStructure: {
      avgSentencesPerParagraph: paragraphLengths.length > 0 ? 
        (paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length).toFixed(1) : 0,
      variability: paragraphLengths.length > 0 ? calculateVariance(paragraphLengths) : 0
    },
    vocabulary: vocabularyAnalysis,
    punctuation: punctuationAnalysis,
    transitions: transitionsAnalysis,
    complexity: complexityAnalysis,
    errorPatterns: errorPatterns,
    stylisticPreferences: stylisticPreferences
  };
}

// Helper function to calculate variance (for natural variability in writing)
function calculateVariance(numbers) {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  return Math.round(variance * 100) / 100;
}

// Analyze vocabulary usage patterns
function analyzeVocabulary(text) {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const uniqueWords = [...new Set(words)];
  
  // Word frequency distribution
  const wordFrequency = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency to find favorite words
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .filter(([word]) => word.length > 3 && !commonWords.includes(word))
    .slice(0, 5)
    .map(([word]) => word);
  
  // Adjective and adverb usage
  const adjectivePattern = /\b\w+(?:ful|ous|ive|able|ible|al|ial|ic|ical|ish|less|y)\b/gi;
  const adverbPattern = /\b\w+ly\b/gi;
  const adjectives = text.match(adjectivePattern) || [];
  const adverbs = text.match(adverbPattern) || [];
  
  return {
    lexicalDiversity: (uniqueWords.length / words.length).toFixed(2),
    favoriteWords: sortedWords,
    adjectiveFrequency: (adjectives.length / sentences.length).toFixed(2),
    adverbFrequency: (adverbs.length / sentences.length).toFixed(2),
    avgWordLength: (words.join('').length / words.length).toFixed(1)
  };
}

// Analyze punctuation patterns
function analyzePunctuation(text) {
  const total = text.length;
  return {
    commaRate: ((text.match(/,/g) || []).length / total).toFixed(3),
    semicolonRate: ((text.match(/;/g) || []).length / total).toFixed(3),
    colonRate: ((text.match(/:/g) || []).length / total).toFixed(3),
    dashRate: ((text.match(/—|–|-/g) || []).length / total).toFixed(3),
    exclamationRate: ((text.match(/!/g) || []).length / total).toFixed(3),
    questionRate: ((text.match(/\?/g) || []).length / total).toFixed(3),
    parenthesesRate: ((text.match(/\(|\)/g) || []).length / total).toFixed(3),
    ellipsesRate: ((text.match(/\.{3}|…/g) || []).length / total).toFixed(3),
    quotationRate: ((text.match(/"|"/g) || []).length / total).toFixed(3)
  };
}

// Analyze transitions and sentence beginnings
function analyzeTransitions(text, sentences) {
  const commonTransitionWords = [
    'however', 'therefore', 'moreover', 'consequently', 'furthermore', 
    'nevertheless', 'indeed', 'meanwhile', 'nonetheless', 'thus',
    'also', 'besides', 'then', 'additionally', 'finally', 'subsequently'
  ];
  
  // Find transitions
  const transitions = commonTransitionWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(text)
  );
  
  // Analyze first words of sentences
  const firstWords = sentences.map(s => {
    const match = s.trim().match(/^\s*(\w+)/);
    return match ? match[1].toLowerCase() : '';
  }).filter(Boolean);
  
  const firstWordFrequency = {};
  firstWords.forEach(word => {
    firstWordFrequency[word] = (firstWordFrequency[word] || 0) + 1;
  });
  
  const commonFirstWords = Object.entries(firstWordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);
  
  return {
    preferredTransitions: transitions.slice(0, 3),
    commonSentenceStarters: commonFirstWords,
    usesConnectingWords: transitions.length > 2
  };
}

// Analyze sentence complexity
function analyzeComplexity(sentences) {
  // Check for complex sentence structures
  const complexSentences = sentences.filter(s => 
    /,.*and|,.*but|,.*because|,.*however|,.*therefore|;|:/.test(s)
  ).length;
  
  // Check for subordinate clauses
  const subordinateClauses = sentences.filter(s => 
    /\b(although|though|even though|because|since|unless|if|when|while|whereas|wherever)\b/.test(s)
  ).length;
  
  return {
    complexSentenceRate: (complexSentences / sentences.length).toFixed(2),
    subordinateClauseRate: (subordinateClauses / sentences.length).toFixed(2),
    usesVariedStructure: complexSentences > sentences.length * 0.3
  };
}

// Analyze common error patterns/quirks
function analyzeErrorPatterns(text) {
  // Look for repeated word patterns
  const repeatedWords = (text.match(/\b(\w+)\s+\1\b/gi) || []).length;
  
  // Check for run-on sentences
  const runOnSentences = (text.match(/\w+\s+and\s+\w+\s+and\s+\w+\s+and\s+\w+/g) || []).length;
  
  // Check for passive voice
  const passiveVoicePattern = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;
  const passiveVoiceInstances = (text.match(passiveVoicePattern) || []).length;
  
  return {
    repeatsWords: repeatedWords > 0,
    usesRunOnSentences: runOnSentences > 0,
    passiveVoiceFrequency: passiveVoiceInstances
  };
}

// Analyze personal stylistic preferences
function analyzeStyle(text, sentences) {
  // Check for contractions usage
  const contractions = (text.match(/\b\w+'(s|t|ve|ll|re|d)\b/g) || []).length;
  
  // Check for formal/informal markers
  const formalMarkers = (text.match(/\b(thus|therefore|consequently|furthermore|moreover)\b/gi) || []).length;
  const informalMarkers = (text.match(/\b(well|anyway|basically|actually|like|just|so)\b/gi) || []).length;
  
  // Check for personal pronouns
  const firstPersonRate = (text.match(/\b(I|me|my|mine|myself|we|us|our|ours|ourselves)\b/gi) || []).length / sentences.length;
  const thirdPersonRate = (text.match(/\b(he|him|his|himself|she|her|hers|herself|they|them|their|theirs|themselves|it|its|itself)\b/gi) || []).length / sentences.length;
  
  return {
    usesContractions: contractions > sentences.length * 0.3,
    formalityLevel: formalMarkers > informalMarkers ? "formal" : "casual",
    firstPersonUsage: firstPersonRate.toFixed(2),
    thirdPersonUsage: thirdPersonRate.toFixed(2)
  };
}

// Common words to filter out
const commonWords = [
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'she', 'will', 'would', 'there', 'their', 'what',
  'about', 'which', 'when', 'make', 'like', 'time', 'just', 'know', 'take',
  'into', 'year', 'your', 'some', 'could', 'them', 'than', 'then', 'look',
  'only', 'come', 'over', 'think', 'also', 'back', 'after', 'work', 'first',
  'well', 'even', 'want', 'because', 'these', 'give', 'most'
];

// New function to analyze and extract key information from class materials
function processClassMaterials(classMaterials) {
  // Extract key terminology and concepts
  const termPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]{2,})\b/g;
  const potentialTerms = [...new Set(classMaterials.match(termPattern) || [])];
  
  // Filter out common words that might be capitalized
  const commonWords = ["I", "The", "A", "An", "In", "On", "At", "To", "For", "With", "By"];
  const keyTerms = potentialTerms.filter(term => 
    !commonWords.includes(term) && term.length > 1
  ).slice(0, 15); // Limit to top 15 terms
  
  // Extract potential definitions (Term: Definition or Term - Definition patterns)
  const definitionPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]{2,})\s*(?::|–|-)\s*([^.]+)/g;
  let match;
  const definitions = [];
  
  while ((match = definitionPattern.exec(classMaterials)) !== null) {
    definitions.push({
      term: match[1].trim(),
      definition: match[2].trim()
    });
  }
  
  // Extract numerical facts and dates
  const numericalFacts = classMaterials.match(/\b\d+(?:\.\d+)?%|\b\d+(?:,\d+)*\b|\b(?:19|20)\d{2}\b/g) || [];
  
  // Find quoted material
  const quotes = classMaterials.match(/"([^"]+)"/g) || [];
  
  // Extract example indicators
  const examplePattern = /(?:for example|e\.g\.|example:|case study:|instance)[^.!?]+[.!?]/gi;
  const examples = classMaterials.match(examplePattern) || [];
  
  // Identify potential section headers and structure
  const headerPattern = /(?:^|\n)([A-Z][A-Za-z\s]+)(?:\n|:)/g;
  const headers = [];
  while ((match = headerPattern.exec(classMaterials)) !== null) {
    headers.push(match[1].trim());
  }
  
  // Determine material type based on patterns
  let materialType = "generic";
  if (classMaterials.match(/(?:syllabus|course outline|learning objectives|course description)/i)) {
    materialType = "syllabus";
  } else if (classMaterials.match(/(?:chapter|section|textbook|reading|author states)/i)) {
    materialType = "textbook";
  } else if (classMaterials.match(/(?:lecture|professor|discussed in class|as mentioned in class)/i)) {
    materialType = "lecture";
  } else if (classMaterials.match(/(?:experiment|method|results|conclusion|findings|study showed)/i)) {
    materialType = "scientific";
  }
  
  return {
    keyTerms,
    definitions,
    numericalFacts,
    quotes,
    examples: examples.map(ex => ex.trim()),
    headers,
    materialType,
    wordCount: classMaterials.split(/\s+/).length
  };
}

// Analyze assignment prompt to understand requirements better
function analyzeAssignmentPrompt(prompt) {
  // Identify the type of assignment
  let assignmentType = "essay";
  if (prompt.match(/(?:analyze|analysis|examine|explore|investigate|evaluate|assess)/i)) {
    assignmentType = "analytical";
  } else if (prompt.match(/(?:compare|contrast|differentiate|distinguish|similarities|differences)/i)) {
    assignmentType = "comparison";
  } else if (prompt.match(/(?:argue|argument|persuade|convince|position|stance|defend)/i)) {
    assignmentType = "argumentative";
  } else if (prompt.match(/(?:explain|description|describe|illustrate|define)/i)) {
    assignmentType = "explanatory";
  } else if (prompt.match(/(?:research|study|investigate|report|findings)/i)) {
    assignmentType = "research";
  } else if (prompt.match(/(?:reflect|personal|experience|learning|growth)/i)) {
    assignmentType = "reflective";
  }
  
  // Extract word count requirements
  const wordCountMatch = prompt.match(/(\d+)\s*(?:word|words)/i);
  const wordCount = wordCountMatch ? parseInt(wordCountMatch[1]) : null;
  
  // Extract deadline or timeframe
  const deadlineMatch = prompt.match(/(?:due|deadline|by|before)\s*(?:the)?\s*(\d+(?:st|nd|rd|th)?\s+(?:of\s+)?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+\d{4})?)/i);
  const deadline = deadlineMatch ? deadlineMatch[1] : null;
  
  // Check for citation requirements
  const citationMatch = prompt.match(/(?:cite|citation|reference|MLA|APA|Chicago|sources|bibliography)/i);
  const requiresCitations = !!citationMatch;
  
  // Identify key instruction verbs
  const instructionVerbs = [];
  const verbsToCheck = [
    "analyze", "argue", "compare", "contrast", "define", "describe", 
    "discuss", "evaluate", "examine", "explain", "illustrate", "interpret", 
    "justify", "outline", "review", "summarize", "trace"
  ];
  
  verbsToCheck.forEach(verb => {
    if (new RegExp(`\\b${verb}\\b`, 'i').test(prompt)) {
      instructionVerbs.push(verb);
    }
  });
  
  return {
    assignmentType,
    wordCount,
    deadline,
    requiresCitations,
    instructionVerbs,
    promptLength: prompt.split(/\s+/).length
  };
}

function humanizeOutput(text) {
  return text
    // Add occasional typos (1 in 300 words)
    .replace(/\b\w{5,}\b/g, word => 
      Math.random() < 0.003 ? introduceTypo(word) : word
    )
    
    // Vary punctuation usage
    .replace(/\,/g, match => 
      Math.random() > 0.1 ? match : ';'
    )
    
    // Add hedge words
    .replace(/\b(is|are)\b/g, match =>
      Math.random() > 0.8 ? `seems to ${match}` : match
    )
    
    // Introduce occasional run-on sentences
    .replace(/\. ([A-Z])/g, (match, letter) =>
      Math.random() > 0.9 ? ` and ${letter.toLowerCase()}` : match
    );
}

function introduceTypo(word) {
  const typos = {
    'th': 'ht',
    'ie': 'ei',
    'el': 'le'
  };
  // Only apply to non-technical terms
  if (isCommonWord(word)) {
    for (let [correct, typo] of Object.entries(typos)) {
      if (word.includes(correct) && Math.random() < 0.3) {
        return word.replace(correct, typo);
      }
    }
  }
  return word;
}

// Add the isCommonWord function that was missing
function isCommonWord(word) {
  // List of common English words that might reasonably have typos
  // This is a simplified approach - in a production app, you might use a more comprehensive dictionary
  const commonWords = [
    'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
    'his', 'from', 'they', 'say', 'her', 'she', 'will', 'one', 'all', 'would',
    'there', 'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make',
    'can', 'like', 'time', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
    'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
    'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
    'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
    'because', 'these', 'give', 'most', 'important', 'however', 'through', 'being', 'therefore', 'although',
    'something', 'anything', 'everything', 'nothing', 'sometimes', 'always', 'never', 'usually', 'often', 'rarely'
  ];
  
  // Check if it's a medium-length common word (not too short, not too long)
  // Words that are too short aren't worth adding typos to
  // Words that are too long might be specialized terms
  return word.length > 4 && 
         word.length < 12 && 
         !word.startsWith(word[0].toUpperCase()) && // Not likely a proper noun
         !commonWords.includes(word.toLowerCase());
}

function getTypicalErrors(writingSample) {
  try {
    // Extract potential common error patterns from the writing sample
    const commonErrors = [];
    
    // Check for comma splice errors
    if (/[a-z]+ [a-z]+, [a-z]+ [a-z]+/i.test(writingSample)) {
      commonErrors.push("occasional comma splices");
    }
    
    // Check for run-on sentences
    if (/[a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+/i.test(writingSample)) {
      commonErrors.push("some run-on sentences");
    }
    
    // Check for common homophone errors
    if (/\b(they're|their|there|your|you're|its|it's|affect|effect|then|than)\b/i.test(writingSample)) {
      commonErrors.push("occasional homophone confusion");
    }
    
    // Check for inconsistent tense
    const presentTenseCount = (writingSample.match(/\b(is|are|am|has|have|do|does)\b/gi) || []).length;
    const pastTenseCount = (writingSample.match(/\b(was|were|had|did)\b/gi) || []).length;
    if (presentTenseCount > 0 && pastTenseCount > 0) {
      const ratio = Math.max(presentTenseCount, pastTenseCount) / Math.min(presentTenseCount, pastTenseCount);
      if (ratio < 3) {  // If there's a mix of tenses
        commonErrors.push("occasional tense shifting");
      }
    }
    
    return commonErrors.length > 0 ? commonErrors.join(", ") : "no consistent errors";
  } catch (error) {
    console.warn("Error analyzing typical errors:", error);
    return "no consistent errors"; // Fallback
  }
}

function buildPrompt(writingSample, materials, prompt) {
  let errorPatterns = "no consistent errors";
  try {
    errorPatterns = getTypicalErrors(writingSample);
  } catch (error) {
    console.warn("Error getting typical errors:", error);
  }
  
  return `
    INSTRUCTIONS: Write a response to the following assignment prompt using the style patterns below. DO NOT COPY THE SAMPLE TEXT DIRECTLY. CREATE NEW CONTENT.
    
    ASSIGNMENT: ${prompt || "Write a short essay about a topic of your choice"}
    
    COURSE MATERIALS TO REFERENCE: ${materials || "Use general knowledge on the topic"}
    
    STYLE GUIDANCE - Write like a student who:
    - Sometimes repeats ideas slightly differently
    - Occasionally uses informal transitions
    - Makes minor grammar mistakes (${errorPatterns})
    - Shows personal opinion through phrases like "I believe" or "In my view"
    - References course materials naturally, not perfectly
    
    CONTENT REQUIREMENTS:
    - Include 2-3 slightly imperfect citations
    - Make 1-2 minor logical leaps
    - Add personal anecdotes or reactions
    - Vary paragraph lengths unpredictably
    
    WRITING SAMPLE FOR STYLE MATCHING ONLY (DO NOT COPY THIS CONTENT - ONLY MATCH THE STYLE):
    ${writingSample}
    
    YOUR RESPONSE TO THE ASSIGNMENT:
  `;
}

function addNaturalVariations(text) {
  // Add occasional redundancies
  text = text.replace(/\b(important|significant|key)\b/gi, match => 
    Math.random() > 0.7 ? `really ${match}` : match
  );
  
  // Vary sentence beginnings
  text = text.replace(/\. ([A-Z])/g, (match, letter) =>
    Math.random() > 0.3 ? `. ${letter}` : `. Well, ${letter}`
  );

  // Add thinking particles
  text = text.replace(/\. ([A-Z])/g, (match, letter) =>
    Math.random() > 0.8 ? `. I think ${letter}` : match
  );

  return text;
}

async function generateAssignment(writingSample, materials, prompt) {
  const systemPrompt = buildPrompt(writingSample, materials, prompt);
  
  const response = await hf.textGeneration({
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    inputs: systemPrompt,
    parameters: {
      max_new_tokens: 1024,
      temperature: 0.85, // Increased for more variability
      top_p: 0.9,
      repetition_penalty: 1.1
    }
  });

  let text = response.generated_text;
  
  // Apply our humanizing transformations
  text = addNaturalVariations(text);
  text = humanizeOutput(text);
  
  return text;
}

app.post('/api/generate', async (req, res) => {
  try {
    const { writingSample, assignmentPrompt, materials } = req.body;
    
    if (!writingSample || !assignmentPrompt) {
      return res.status(400).json({ 
        error: 'Writing sample and assignment prompt are required' 
      });
    }
    
    const response = await generateAssignment(writingSample, materials, assignmentPrompt);
    
    if (!response) {
      throw new Error('Failed to generate response');
    }
    
    res.json({ 
      text: response,
      generatedText: response  // Include both formats for compatibility
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 