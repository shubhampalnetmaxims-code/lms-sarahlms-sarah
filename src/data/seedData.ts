import { Module, Lesson, Chapter, ContentBlock, Grade } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const createReadingBlock = (text: string, examples: string): ContentBlock => ({
  id: generateId(),
  type: 'reading',
  data: { text, examples }
});

const createVideoBlock = (url: string, description: string): ContentBlock => ({
  id: generateId(),
  type: 'video',
  data: { url, description }
});

const createShortAnswerBlock = (questions: { q: string, a: string }[]): ContentBlock => ({
  id: generateId(),
  type: 'short_answer',
  data: { questions }
});

const createMCQBlock = (question: string, options: { text: string, isCorrect: boolean }[]): ContentBlock => ({
  id: generateId(),
  type: 'mcq',
  data: { question, options }
});

const createFillBlanksBlock = (text: string, answers: string[]): ContentBlock => ({
  id: generateId(),
  type: 'fill_blanks',
  data: { text, answers }
});

const createTrueFalseBlock = (statement: string, isTrue: boolean): ContentBlock => ({
  id: generateId(),
  type: 'true_false',
  data: { statement, isTrue }
});

const createDragDropBlock = (paragraph: string, items: string[]): ContentBlock => ({
  id: generateId(),
  type: 'drag_drop',
  data: { paragraph, items }
});

const generateChaptersForLesson = (lessonName: string, grade: string): Chapter[] => {
  return [
    {
      id: generateId(),
      name: "📖 Reading: " + lessonName,
      content: "Learn about " + lessonName,
      blocks: [
        createReadingBlock(
          `<p>Welcome to the lesson on <strong>${lessonName}</strong>. This is an essential topic for ${grade} students.</p><p>Understanding this will help you build a strong foundation in your studies.</p>`,
          "Example 1, Example 2, Example 3"
        )
      ]
    },
    {
      id: generateId(),
      name: "🎥 Video: " + lessonName,
      content: "Watch the video to understand better.",
      blocks: [
        createVideoBlock(
          "https://www.w3schools.com/html/mov_bbb.mp4",
          "This video explains the core concepts of " + lessonName + " in a simple way."
        )
      ]
    },
    {
      id: generateId(),
      name: "✍️ Practice: Short Answer",
      content: "Answer the following questions.",
      blocks: [
        createShortAnswerBlock([
          { q: "What is the main idea of " + lessonName + "?", a: "The main idea is to understand the basics." },
          { q: "Why is " + lessonName + " important?", a: "It is important for daily life and future learning." },
          { q: "Can you give one real-world application of " + lessonName + "?", a: "One application is in solving problems." }
        ])
      ]
    },
    {
      id: generateId(),
      name: "✅ Quiz: MCQ",
      content: "Choose the correct option.",
      blocks: [
        createMCQBlock(
          "Which of the following is related to " + lessonName + "?",
          [
            { text: "Option A (Correct)", isCorrect: true },
            { text: "Option B", isCorrect: false },
            { text: "Option C", isCorrect: false },
            { text: "Option D", isCorrect: false },
            { text: "Option E", isCorrect: false }
          ]
        )
      ]
    },
    {
      id: generateId(),
      name: "🧩 Activity: Fill in the Blanks",
      content: "Complete the sentences.",
      blocks: [
        createFillBlanksBlock(
          "The first step in [blank] is to [blank]. It is very [blank].",
          ["learning", "understand", "useful"]
        )
      ]
    },
    {
      id: generateId(),
      name: "✔️ Quick Check: True or False",
      content: "Decide if the statements are true or false.",
      blocks: [
        createTrueFalseBlock(lessonName + " is a very difficult subject for everyone.", false)
      ]
    },
    {
      id: generateId(),
      name: "🔀 Challenge: Drag & Drop",
      content: "Arrange the words correctly.",
      blocks: [
        createDragDropBlock(
          "The [blank] [blank] [blank] [blank] [blank].",
          ["quick", "brown", "fox", "jumps", "over"]
        )
      ]
    }
  ];
};

export const generateSeedData = (availableGrades: Grade[]) => {
  const modules: Module[] = [];
  const lessons: Lesson[] = [];

  const curriculum: Record<string, { name: string, description: string, lessons: string[] }[]> = {
    "Grade 2": [
      { 
        name: "Basic English", 
        description: "Foundational English skills for young learners.",
        lessons: ["Alphabet Revision", "Simple Words Formation", "Sentence Making", "Reading Practice"]
      },
      { 
        name: "Basic Mathematics", 
        description: "Introduction to numbers and basic arithmetic.",
        lessons: ["Numbers (1–100)", "Addition & Subtraction", "Shapes Identification", "Time & Money Basics"]
      },
      { 
        name: "General Awareness", 
        description: "Understanding the world around us.",
        lessons: ["My Family", "Animals & Birds", "Plants Around Us", "Good Habits"]
      }
    ],
    "Grade 3": [
      { name: "English: Parts of Speech", description: "Learning nouns, verbs, and adjectives.", lessons: ["Nouns", "Verbs", "Adjectives", "Pronouns"] },
      { name: "Math: Multiplication", description: "Introduction to times tables.", lessons: ["Tables 2-5", "Tables 6-10", "Multiplication Word Problems"] },
      { name: "Science: Environment", description: "Our surroundings and nature.", lessons: ["Air & Water", "Weather", "Pollution"] }
    ],
    "Grade 4": [
      { name: "English: Grammar", description: "Advanced sentence structures.", lessons: ["Punctuation", "Conjunctions", "Prepositions"] },
      { name: "Math: Decimals", description: "Introduction to decimal numbers.", lessons: ["Decimal Basics", "Adding Decimals", "Subtracting Decimals"] },
      { name: "Science: Human Body", description: "Learning about our organs.", lessons: ["Digestive System", "Respiratory System", "Skeletal System"] }
    ],
    "Grade 5": [
      { name: "English: Tenses", description: "Past, present, and future tenses.", lessons: ["Present Tense", "Past Tense", "Future Tense"] },
      { name: "Math: Percentages", description: "Understanding ratios and percents.", lessons: ["Percentage Basics", "Profit & Loss", "Simple Interest"] },
      { name: "Science: Force & Motion", description: "Basics of physics.", lessons: ["Types of Force", "Friction", "Gravity"] }
    ],
    "Grade 6": [
      { name: "English: Advanced Grammar", description: "Clauses and active/passive voice.", lessons: ["Active Voice", "Passive Voice", "Direct Speech"] },
      { name: "Math: Algebra", description: "Introduction to algebraic expressions.", lessons: ["Variables", "Equations", "Inequalities"] },
      { name: "Science: Physics Basics", description: "Light, sound, and electricity.", lessons: ["Light Reflection", "Sound Waves", "Electric Circuits"] }
    ],
    "Grade 7": [
      { name: "English: Literature", description: "Analyzing stories and poems.", lessons: ["Poetry Analysis", "Short Story Themes", "Character Development"] },
      { name: "Math: Probability", description: "Likelihood of events.", lessons: ["Probability Basics", "Statistics", "Data Handling"] },
      { name: "Science: Acids & Bases", description: "Introduction to chemistry.", lessons: ["pH Scale", "Neutralization", "Chemical Reactions"] }
    ]
  };

  Object.keys(curriculum).forEach(gradeName => {
    const gradeObj = availableGrades.find(g => g.name === gradeName);
    if (!gradeObj) return;

    const gradeModules = curriculum[gradeName] || [];
    gradeModules.forEach(modData => {
      const moduleId = generateId();
      modules.push({
        id: moduleId,
        name: modData.name,
        description: modData.description,
        gradeIds: [gradeObj.id],
        createdAt: new Date().toISOString()
      });

      modData.lessons.forEach(lessonName => {
        const lessonId = generateId();
        lessons.push({
          id: lessonId,
          moduleId: moduleId,
          gradeId: gradeObj.id,
          name: lessonName,
          description: "Comprehensive lesson on " + lessonName + " for " + gradeName + ".",
          thumbnail: `https://picsum.photos/seed/${lessonId}/400/300`,
          chapters: generateChaptersForLesson(lessonName, gradeName),
          createdAt: new Date().toISOString()
        });
      });
    });
  });

  return { modules, lessons };
};
