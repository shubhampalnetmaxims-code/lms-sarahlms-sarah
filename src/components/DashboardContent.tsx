import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  PlayCircle,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  Book,
  FileText,
  ChevronDown,
  ArrowLeft,
  LayoutGrid,
  List,
  GraduationCap,
  Eye,
  Layers,
  Star,
  Sparkles,
  Trophy,
  Database,
  ClipboardList,
  Copy,
  FileJson,
  Download,
  Upload,
  Building2,
  Shield,
  Key,
  RefreshCw,
  Loader2,
  X,
  User,
  Mail,
  Phone
} from "lucide-react";
import ModuleModal from "./ModuleModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import LessonModal from "./LessonModal";
import { Module, Lesson, Chapter, ContentBlock, LearningPath, QuestionBank, Organization, Level, Student, Teacher, Invitation, TeacherPermissions } from "../types";
import ChapterModal from "./ChapterModal";
import ChapterEditor from "./ChapterEditor";
import StudentPreview from "./StudentPreview";
import LearningPathModal from "./LearningPathModal";
import LearningPathPreview from "./LearningPathPreview";
import LearningPathZigZagPreview from "./LearningPathZigZagPreview";
import QuestionBankModal from "./QuestionBankModal";
import QuestionBankPreview from "./QuestionBankPreview";
import SkillLessonModal from "./SkillLessonModal";
import CurriculumWizard from "./CurriculumWizard";
import CryptoJS from "crypto-js";

interface DashboardContentProps {
  activeTab: string;
  showToast: (message: string, type: "success" | "error") => void;
}

const INITIAL_MODULES: Module[] = [
  { 
    id: "m1", 
    name: "Advanced English Composition", 
    description: "Master the art of structured writing, advanced grammar, and persuasive techniques for academic excellence.", 
    levelIds: ["g4", "g5"], 
    createdAt: new Date().toISOString() 
  },
  { 
    id: "m2", 
    name: "Foundational Mathematics", 
    description: "Building strong mathematical foundations through interactive problem solving and logical reasoning.", 
    levelIds: ["g1", "g2", "g3"], 
    createdAt: new Date().toISOString() 
  },
  { 
    id: "m3", 
    name: "Introduction to Life Sciences", 
    description: "Exploring the wonders of the natural world, from microscopic cells to complex ecosystems.", 
    levelIds: ["g3", "g4", "g5"], 
    createdAt: new Date().toISOString() 
  },
];

const INITIAL_LEVELS: Level[] = [
  { id: "g1", name: "Level 1", description: "Lower Primary", status: "active", created: new Date().toISOString() },
  { id: "g2", name: "Level 2", description: "Lower Primary", status: "active", created: new Date().toISOString() },
  { id: "g3", name: "Level 3", description: "Middle Primary", status: "active", created: new Date().toISOString() },
  { id: "g4", name: "Level 4", description: "Upper Primary", status: "active", created: new Date().toISOString() },
  { id: "g5", name: "Level 5", description: "Upper Primary", status: "active", created: new Date().toISOString() },
];

const generateLessons = (): Lesson[] => {
  const lessons: Lesson[] = [];
  const moduleData = [
    { 
      id: "m1", 
      name: "Advanced English Composition",
      lessonNames: ["The Art of Persuasion", "Creative Narrative Writing", "Academic Essay Structure"]
    },
    { 
      id: "m2", 
      name: "Foundational Mathematics",
      lessonNames: ["Number Sense & Operations", "Geometry & Spatial Reasoning", "Data Handling & Probability"]
    },
    { 
      id: "m3", 
      name: "Introduction to Life Sciences",
      lessonNames: ["The World of Plants", "Animal Kingdoms", "Human Body Systems"]
    }
  ];

  const getChapterData = (type: string, modName: string, lessonName: string, chapterIdx: number) => {
    const baseId = `b-${type}-${Math.random().toString(36).substr(2, 5)}`;
    switch (type) {
      case 'reading':
        return {
          name: `📖 Reading: ${lessonName} Concepts`,
          blocks: [{
            id: baseId,
            type: 'reading' as const,
            data: {
              text: `<h3>Mastering ${lessonName}</h3><p>In this chapter, we explore the fundamental aspects of ${lessonName} within the context of ${modName}. Understanding these concepts is essential for academic growth.</p><h4>Key Learning Objectives:</h4><ul><li>Identify core principles of ${lessonName}</li><li>Analyze real-world applications</li><li>Synthesize information from multiple sources</li></ul>`,
              examples: `<strong>Example A:</strong> Applying ${lessonName} in a standard scenario.\n<strong>Example B:</strong> Advanced implementation of ${modName} techniques.`
            }
          }]
        };
      case 'video':
        return {
          name: `🎥 Video Tutorial: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'video' as const,
            data: {
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
              description: `A comprehensive visual walkthrough of ${lessonName} techniques and best practices.`
            }
          }]
        };
      case 'mcq':
        return {
          name: `✅ Knowledge Check: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'mcq' as const,
            data: {
              question: `Which of the following best describes the primary objective of ${lessonName}?`,
              options: [
                { text: "Memorizing facts without context", isCorrect: false },
                { text: "Applying critical thinking to solve problems", isCorrect: true },
                { text: "Following instructions blindly", isCorrect: false },
                { text: "Avoiding all challenges", isCorrect: false }
              ],
              marks: 5
            }
          }]
        };
      case 'short_answer':
        return {
          name: `✍️ Quick Quiz: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'short_answer' as const,
            data: {
              questions: [
                { q: `Define the core concept of ${lessonName}.`, a: `It is the systematic study and application of ${modName} principles.` },
                { q: `Why is ${lessonName} important?`, a: `It provides the necessary tools for advanced learning and practical application.` }
              ],
              marks: 10
            }
          }]
        };
      case 'fill_blanks':
        return {
          name: `🧩 Vocabulary: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'fill_blanks' as const,
            data: {
              text: `${lessonName} is a [blank] process that requires [blank] and [blank].`,
              answers: ["dynamic", "patience", "practice"],
              options: [
                ["static", "dynamic", "linear"],
                ["patience", "speed", "luck"],
                ["practice", "guessing", "waiting"]
              ],
              marks: 5
            }
          }]
        };
      case 'true_false':
        return {
          name: `✔️ Fact or Fiction: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'true_false' as const,
            data: {
              statement: `${lessonName} is a skill that can be improved through consistent effort and feedback.`,
              isTrue: true,
              marks: 5
            }
          }]
        };
      case 'drag_drop':
        return {
          name: `🔀 Sequence: ${lessonName} Workflow`,
          blocks: [{
            id: baseId,
            type: 'drag_drop' as const,
            data: {
              paragraph: `The correct order of operations in ${lessonName} is: [blank], then [blank], and finally [blank].`,
              items: ["Analysis", "Execution", "Evaluation"],
              answers: ["Analysis", "Execution", "Evaluation"],
              marks: 10
            }
          }]
        };
      case 'long_text':
        return {
          name: `📝 Critical Essay: ${lessonName}`,
          blocks: [{
            id: baseId,
            type: 'long_text' as const,
            data: {
              question: `Discuss the impact of ${lessonName} on modern ${modName} practices.`,
              description: "Write a minimum of 200 words. Include at least two specific examples.",
              expected_answer: "The student should demonstrate a deep understanding of the topic, linking theoretical concepts to practical examples and showing critical analysis.",
              keywords: `${lessonName.toLowerCase()}, impact, examples, analysis`,
              marks: 20
            }
          }]
        };
      default:
        return { name: "Chapter", blocks: [] };
    }
  };

  const chapterTypes = ['reading', 'video', 'mcq', 'short_answer', 'fill_blanks', 'true_false', 'drag_drop', 'long_text'];

  moduleData.forEach((mod) => {
    mod.lessonNames.forEach((lessonName, lessonIdx) => {
      const lessonId = `l-${mod.id}-${lessonIdx + 1}`;
      const chapters: Chapter[] = [];
      
      const module = INITIAL_MODULES.find(m => m.id === mod.id);
      const levelId = module?.levelIds[lessonIdx % module.levelIds.length] || "g1";

      chapterTypes.forEach((type, cIdx) => {
        const chapterId = `c-${lessonId}-${cIdx + 1}`;
        const { name, blocks } = getChapterData(type, mod.name, lessonName, cIdx);
        chapters.push({ id: chapterId, name, content: "", blocks });
      });

      const isSkillLesson = lessonIdx === 2; // Make the 3rd lesson a skill lesson
      lessons.push({
        id: lessonId,
        moduleId: mod.id,
        levelId: levelId,
        name: lessonName,
        description: `A deep dive into ${lessonName}, designed to challenge and inspire students in ${mod.name}.`,
        thumbnail: `https://picsum.photos/seed/${lessonId}/800/600`,
        createdAt: new Date().toISOString(),
        chapters,
        isSkillLesson: isSkillLesson,
        starNumber: isSkillLesson ? 3 : undefined,
        learningPathId: isSkillLesson ? `lp-${mod.id}` : undefined
      });
    });
  });

  return lessons;
};

const INITIAL_LESSONS: Lesson[] = generateLessons();

const INITIAL_QUESTION_BANKS: QuestionBank[] = [
  {
    id: "qb1",
    name: "English Proficiency Benchmark",
    description: "A comprehensive assessment of writing skills, reading comprehension, and grammatical accuracy.",
    levelIds: ["g4", "g5"],
    createdAt: new Date().toISOString(),
    questions: [
      { id: "sec1", type: "section", question: "Section A: Grammar & Vocabulary", marks: 0, required: false },
      {
        id: "q1",
        type: "mcq",
        question: "Identify the correct use of the semicolon in the following sentences.",
        options: [
          { text: "I like apples; and oranges.", isCorrect: false },
          { text: "The weather was beautiful; we decided to go for a walk.", isCorrect: true },
          { text: "She said; 'Hello'.", isCorrect: false },
          { text: "Wait; for me.", isCorrect: false }
        ],
        marks: 5,
        required: true,
        image: "https://picsum.photos/seed/grammar/800/400"
      },
      {
        id: "q2",
        type: "fill_blanks",
        question: "The [blank] of the story was [blank] and [blank].",
        answers: ["protagonist", "brave", "determined"],
        marks: 5,
        required: true
      },
      { id: "sec2", type: "section", question: "Section B: Critical Analysis", marks: 0, required: false },
      {
        id: "q3",
        type: "true_false",
        question: "A persuasive essay should only present one side of the argument to be effective.",
        correctAnswer: false,
        marks: 5,
        required: true
      },
      {
        id: "q4",
        type: "long_text",
        question: "Analyze the theme of 'Resilience' in a book you have recently read.",
        description: "Provide specific textual evidence to support your claims.",
        expectedAnswer: "The student should identify a character or situation showing resilience and explain how it contributes to the overall theme.",
        keywords: "resilience, theme, evidence, analysis",
        marks: 20,
        required: true
      }
    ]
  },
  {
    id: "qb2",
    name: "Mathematics Logic & Reasoning",
    description: "Testing fundamental mathematical concepts and logical deduction capabilities.",
    levelIds: ["g1", "g2", "g3"],
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "mq1",
        type: "mcq",
        question: "What is the result of 15 + (3 * 4)?",
        options: [
          { text: "72", isCorrect: false },
          { text: "27", isCorrect: true },
          { text: "32", isCorrect: false },
          { text: "19", isCorrect: false }
        ],
        marks: 5,
        required: true
      },
      {
        id: "mq2",
        type: "short_answer",
        question: "If a triangle has angles of 90 and 45 degrees, what is the third angle?",
        expectedAnswer: "45 degrees",
        marks: 5,
        required: true
      }
    ]
  }
];

const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: "lp-m1",
    name: "The Writer's Journey",
    description: "A gamified path to becoming a master communicator and creative writer.",
    moduleId: "m1",
    levelIds: ["g4", "g5"],
    stars: 5,
    starLessons: ["l-m1-1", "l-m1-2", "l-m1-3", null, null],
    starsData: [
      { star: 1, mainLessonId: "l-m1-1", skillLessonIds: [] },
      { star: 2, mainLessonId: "l-m1-2", skillLessonIds: [] },
      { star: 3, mainLessonId: "l-m1-3", skillLessonIds: [] },
      { star: 4, mainLessonId: null, skillLessonIds: [] },
      { star: 5, mainLessonId: null, skillLessonIds: [] }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "lp-m2",
    name: "Math Explorer",
    description: "Embark on an adventure through the world of numbers and logic.",
    moduleId: "m2",
    levelIds: ["g1", "g2", "g3"],
    stars: 5,
    starLessons: ["l-m2-1", "l-m2-2", "l-m2-3", null, null],
    starsData: [
      { star: 1, mainLessonId: "l-m2-1", skillLessonIds: [] },
      { star: 2, mainLessonId: "l-m2-2", skillLessonIds: [] },
      { star: 3, mainLessonId: "l-m2-3", skillLessonIds: [] },
      { star: 4, mainLessonId: null, skillLessonIds: [] },
      { star: 5, mainLessonId: null, skillLessonIds: [] }
    ],
    createdAt: new Date().toISOString()
  }
];

export default function DashboardContent({ activeTab, showToast }: DashboardContentProps) {
  // Modules State
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [editingChapterInEditor, setEditingChapterInEditor] = useState<Chapter | null>(null);
  const itemsPerPage = 10;

  // Modal States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLearningPathModalOpen, setIsLearningPathModalOpen] = useState(false);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);
  const [isSkillLessonModalOpen, setIsSkillLessonModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);
  const [isCurriculumWizardOpen, setIsCurriculumWizardOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "module" | "lesson" | "chapter" | "learning-path" | "assessments" } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  // Organization State
  const [orgData, setOrgData] = useState<Organization>({
    name: "Aquire Global Academy",
    logo: "https://picsum.photos/seed/aquire-logo/400/400",
    address: "123 Education Excellence Way, Knowledge City, 110001",
    email: "contact@aquireglobal.com",
    phone: "+91 98765 43210",
    updated: new Date().toISOString()
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isSavingOrg, setIsSavingOrg] = useState(false);

  // Teacher State
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({ 
    name: "", 
    email: "", 
    levelIds: [] as string[],
    assignedStudentIds: [] as string[],
    permissions: {
      learning_paths: true,
      skill_based: true,
      assessments: true,
      create_learning_paths: true,
      create_skill_based: true,
      invite_students: true
    }
  });

  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  // Student State
  const [students, setStudents] = useState<Student[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState({ name: "", email: "", level_id: "", teacher_id: "" });

  // Level State
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [levelForm, setLevelForm] = useState({ name: "", description: "", status: "active" as const });
  const [manageSchoolTab, setManageSchoolTab] = useState<'profile' | 'levels'>('profile');
  const [levelSort, setLevelSort] = useState<{ field: 'name' | 'status', direction: 'asc' | 'desc' }>({ field: 'name', direction: 'asc' });

  useEffect(() => {
    const savedOrg = localStorage.getItem("aquire_organization");
    if (savedOrg) {
      setOrgData(JSON.parse(savedOrg));
    }

    const savedTeachers = localStorage.getItem("aquire_teachers");
    const savedLevels = localStorage.getItem("aquire_levels");
    const currentLevels = savedLevels ? JSON.parse(savedLevels) : INITIAL_LEVELS;

    if (savedTeachers) {
      let parsedTeachers: Teacher[] = JSON.parse(savedTeachers);
      let updated = false;
      
      // Ensure existing teachers have levelIds and permissions
      parsedTeachers = parsedTeachers.map(t => {
        let tUpdated = false;
        if (!t.levelIds || t.levelIds.length === 0) {
          tUpdated = true;
          const randomLevels = currentLevels.slice(0, 2).map((g: Level) => g.id);
          t.levelIds = randomLevels;
        }
        if (!t.permissions) {
          tUpdated = true;
          t.permissions = {
            learning_paths: true,
            skill_based: true,
            assessments: true,
            create_learning_paths: true,
            create_skill_based: true,
            invite_students: true
          };
        }
        if (tUpdated) updated = true;
        return t;
      });

      if (updated) {
        saveTeachers(parsedTeachers);
      } else {
        setTeachers(parsedTeachers);
      }
    } else {
      // Seed Data
      const seedTeachers: Teacher[] = [
        { 
          id: "t1", 
          name: "Dr. Elizabeth Smith", 
          email: "elizabeth.smith@aquireglobal.com", 
          status: 'active', 
          joined: new Date().toISOString(), 
          profile_pic: "https://i.pravatar.cc/150?u=elizabeth", 
          levelIds: ["g4", "g5"],
          permissions: {
            learning_paths: true,
            skill_based: true,
            assessments: true,
            create_learning_paths: true,
            create_skill_based: true,
            invite_students: true
          }
        },
        { 
          id: "t2", 
          name: "Prof. Robert Johnson", 
          email: "robert.johnson@aquireglobal.com", 
          status: 'active', 
          joined: new Date().toISOString(), 
          profile_pic: "https://i.pravatar.cc/150?u=robert", 
          levelIds: ["g1", "g2", "g3"],
          permissions: {
            learning_paths: true,
            skill_based: true,
            assessments: true,
            create_learning_paths: false,
            create_skill_based: true,
            invite_students: true
          }
        },
        { 
          id: "t3", 
          name: "Ms. Sophia Williams", 
          email: "sophia.williams@aquireglobal.com", 
          status: 'active', 
          joined: new Date().toISOString(), 
          profile_pic: "https://i.pravatar.cc/150?u=sophia", 
          levelIds: ["g3", "g4", "g5"],
          permissions: {
            learning_paths: true,
            skill_based: true,
            assessments: true,
            create_learning_paths: false,
            create_skill_based: false,
            invite_students: false
          }
        },
      ];
      setTeachers(seedTeachers);
      localStorage.setItem("aquire_teachers", JSON.stringify(seedTeachers));
    }

    const savedInvitations = localStorage.getItem("aquire_invitations");
    if (savedInvitations) {
      setInvitations(JSON.parse(savedInvitations));
    }

    const savedStudents = localStorage.getItem("aquire_students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Seed Data for Students
      const seedStudents: Student[] = [
        { id: "s1", name: "Rahul Sharma", email: "rahul@school.com", level_id: "g5", teacher_id: "t1", status: "active", joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=rahul", progress: 80 },
        { id: "s2", name: "Aanya Gupta", email: "aanya@school.com", level_id: "g5", teacher_id: "t1", status: "active", joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=aanya", progress: 45 },
        { id: "s3", name: "Ishaan Verma", email: "ishaan@school.com", level_id: "g5", teacher_id: "t1", status: "pending", joined: new Date().toISOString(), progress: 0 },
        { id: "s4", name: "Saanvi Reddy", email: "saanvi@school.com", level_id: "g5", teacher_id: "t2", status: "active", joined: new Date().toISOString(), progress: 65 },
        { id: "s5", name: "Arjun Kapoor", email: "arjun@school.com", level_id: "g5", teacher_id: "t2", status: "inactive", joined: new Date().toISOString(), progress: 30 },
        { id: "s6", name: "Vivaan Shah", email: "vivaan@school.com", level_id: "g1", teacher_id: "t2", status: "active", joined: new Date().toISOString(), progress: 90 },
        { id: "s7", name: "Diya Malhotra", email: "diya@school.com", level_id: "g1", teacher_id: "t3", status: "active", joined: new Date().toISOString(), progress: 75 },
        { id: "s8", name: "Kabir Singh", email: "kabir@school.com", level_id: "g1", teacher_id: "t3", status: "active", joined: new Date().toISOString(), progress: 55 },
        { id: "s9", name: "Myra Joshi", email: "myra@school.com", level_id: "g8", status: "pending", joined: new Date().toISOString(), progress: 0 },
        { id: "s10", name: "Advait Nair", email: "advait@school.com", level_id: "g8", status: "pending", joined: new Date().toISOString(), progress: 0 },
        { id: "s11", name: "Kiara Bose", email: "kiara@school.com", level_id: "g8", status: "pending", joined: new Date().toISOString(), progress: 0 },
        { id: "s12", name: "Reyansh Goel", email: "reyansh@school.com", level_id: "g8", status: "pending", joined: new Date().toISOString(), progress: 0 },
        { id: "s13", name: "Zoya Khan", email: "zoya@school.com", level_id: "g10", status: "active", joined: new Date().toISOString(), progress: 85 },
        { id: "s14", name: "Aarav Patel", email: "aarav@school.com", level_id: "g10", status: "active", joined: new Date().toISOString(), progress: 92 },
        { id: "s15", name: "Ananya Das", email: "ananya@school.com", level_id: "g10", status: "active", joined: new Date().toISOString(), progress: 78 },
      ];
      setStudents(seedStudents);
      localStorage.setItem("aquire_students", JSON.stringify(seedStudents));
    }

    if (savedLevels) {
      setLevels(JSON.parse(savedLevels));
    } else {
      setLevels(INITIAL_LEVELS);
      localStorage.setItem("aquire_levels", JSON.stringify(INITIAL_LEVELS));
    }
  }, []);

  const saveTeachers = (updated: Teacher[]) => {
    setTeachers(updated);
    localStorage.setItem("aquire_teachers", JSON.stringify(updated));
  };

  const saveInvitations = (updated: Invitation[]) => {
    setInvitations(updated);
    localStorage.setItem("aquire_invitations", JSON.stringify(updated));
  };

  const saveStudents = (updated: Student[]) => {
    setStudents(updated);
    localStorage.setItem("aquire_students", JSON.stringify(updated));
  };

  const saveLevels = (updated: Level[]) => {
    setLevels(updated);
    localStorage.setItem("aquire_levels", JSON.stringify(updated));
  };

  const handleSaveLevel = () => {
    if (!levelForm.name) {
      showToast("Level name is required", "error");
      return;
    }

    // Check uniqueness
    const isDuplicate = levels.some(g => 
      g.name.toLowerCase() === levelForm.name.toLowerCase() && 
      (!editingLevel || g.id !== editingLevel.id)
    );

    if (isDuplicate) {
      showToast("Level name must be unique", "error");
      return;
    }

    if (editingLevel) {
      const updated = levels.map(g => g.id === editingLevel.id ? { ...g, ...levelForm } : g);
      saveLevels(updated);
      showToast("Level updated successfully", "success");
    } else {
      const newLevel: Level = {
        id: crypto.randomUUID(),
        ...levelForm,
        created: new Date().toISOString()
      };
      saveLevels([newLevel, ...levels]);
      showToast("Level added successfully", "success");
    }

    setIsLevelModalOpen(false);
    setEditingLevel(null);
    setLevelForm({ name: "", description: "", status: "active" });
  };

  const deleteLevel = (id: string) => {
    const updated = levels.filter(g => g.id !== id);
    saveLevels(updated);
    showToast("Level removed successfully", "success");
  };

  const toggleLevelStatus = (id: string) => {
    const updated = levels.map(g => g.id === id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g);
    saveLevels(updated);
    showToast("Status updated", "success");
  };

  const handleSaveTeacher = () => {
    if (!teacherForm.name || !teacherForm.email || teacherForm.levelIds.length === 0) {
      showToast("Please fill all fields and select at least one level", "error");
      return;
    }

    let teacherId = "";

    if (editingTeacher) {
      teacherId = editingTeacher.id;
      const updated = teachers.map(t => t.id === editingTeacher.id ? { ...t, ...teacherForm } : t);
      saveTeachers(updated);
      showToast("Assigned successfully!", "success");
    } else {
      // Check if email already exists
      if (teachers.some(t => t.email === teacherForm.email)) {
        showToast("Teacher with this email already exists", "error");
        return;
      }

      const token = crypto.randomUUID();
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      const newInvitation: Invitation = {
        token,
        email: teacherForm.email,
        name: teacherForm.name,
        expires: expires.toISOString(),
        used: false
      };

      teacherId = crypto.randomUUID();
      const newTeacher: Teacher = {
        id: teacherId,
        name: teacherForm.name,
        email: teacherForm.email,
        status: 'pending',
        joined: new Date().toISOString(),
        invitation_token: token,
        token_expires: expires.toISOString(),
        levelIds: teacherForm.levelIds,
        permissions: teacherForm.permissions
      };

      saveInvitations([...invitations, newInvitation]);
      saveTeachers([...teachers, newTeacher]);

      // Simulate Email
      const inviteLink = `${window.location.origin}${window.location.pathname}?token=${token}`;
      console.log(`
        Subject: Aquire Academy - Teacher Invitation
        ---
        Hi ${teacherForm.name},

        Welcome to Aquire Academy! You have been assigned to levels: ${teacherForm.levelIds.map(id => levels.find(l => l.id === id)?.name).join(', ')}.

        Signup: ${inviteLink}
        Expires: ${expires.toLocaleString()}
        ---
      `);

      navigator.clipboard.writeText(inviteLink);
      showToast("Invitation sent! Link copied to clipboard.", "success");
    }

    // Update Student Assignments
    const updatedStudents = students.map(s => {
      if (teacherForm.assignedStudentIds.includes(s.id)) {
        return { ...s, teacher_id: teacherId };
      } else if (s.teacher_id === teacherId) {
        // If it was assigned to this teacher but now it's not in the list
        return { ...s, teacher_id: undefined };
      }
      return s;
    });
    saveStudents(updatedStudents);
    
    setTeacherForm({ 
      name: "", 
      email: "", 
      levelIds: [],
      assignedStudentIds: [],
      permissions: {
        learning_paths: true,
        skill_based: true,
        assessments: true,
        create_learning_paths: true,
        create_skill_based: true,
        invite_students: true
      }
    });
    setEditingTeacher(null);
    setIsTeacherModalOpen(false);
  };

  const handleImpersonate = (teacher: Teacher) => {
    document.dispatchEvent(new CustomEvent('impersonate-teacher', { detail: teacher }));
  };

  const toggleTeacherStatus = (teacherId: string) => {
    const updated = teachers.map(t => {
      if (t.id === teacherId) {
        return { ...t, status: t.status === 'active' ? 'inactive' : 'active' };
      }
      return t;
    });
    saveTeachers(updated);
    showToast("Teacher status updated", "success");
  };

  const deleteTeacher = (teacherId: string) => {
    const updated = teachers.filter(t => t.id !== teacherId);
    saveTeachers(updated);
    showToast("Teacher deleted", "success");
  };

  // Student Handlers
  const handleSaveStudent = () => {
    if (!studentForm.name || !studentForm.email || !studentForm.level_id) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (editingStudent) {
      const updated = students.map(s => s.id === editingStudent.id ? { ...s, ...studentForm } : s);
      saveStudents(updated);
      showToast("Student updated successfully", "success");
    } else {
      if (students.some(s => s.email === studentForm.email)) {
        showToast("Student with this email already exists", "error");
        return;
      }

      const token = crypto.randomUUID();
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      const newInvitation: Invitation = {
        token,
        email: studentForm.email,
        name: studentForm.name,
        expires: expires.toISOString(),
        used: false
      };

      const newStudent: Student = {
        id: crypto.randomUUID(),
        name: studentForm.name,
        email: studentForm.email,
        level_id: studentForm.level_id,
        teacher_id: studentForm.teacher_id,
        status: 'pending',
        joined: new Date().toISOString(),
        invitation_token: token,
        token_expires: expires.toISOString(),
        progress: 0
      };

      saveInvitations([...invitations, newInvitation]);
      saveStudents([...students, newStudent]);

      const inviteLink = `${window.location.origin}${window.location.pathname}?token=${token}`;
      console.log(`
        Subject: Welcome to Aquire Academy, ${studentForm.name}!
        ---
        Hi ${studentForm.name},

        Welcome to Aquire Academy! You have been invited to join Level ${levels.find(l => l.id === studentForm.level_id)?.name}.

        Signup: ${inviteLink}
        Expires: ${expires.toLocaleString()}
        ---
      `);

      navigator.clipboard.writeText(inviteLink);
      showToast("Student invitation sent! Link copied.", "success");
    }
    
    setStudentForm({ name: "", email: "", level_id: "", teacher_id: "" });
    setEditingStudent(null);
    setIsStudentModalOpen(false);
  };

  const handleImpersonateStudent = (student: Student) => {
    document.dispatchEvent(new CustomEvent('impersonate-student', { detail: student }));
  };

  const toggleStudentStatus = (studentId: string) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        return { ...s, status: s.status === 'active' ? 'inactive' : 'active' };
      }
      return s;
    });
    saveStudents(updated);
    showToast("Student status updated", "success");
  };

  const deleteStudent = (studentId: string) => {
    const updated = students.filter(s => s.id !== studentId);
    saveStudents(updated);
    showToast("Student deleted", "success");
  };

  useEffect(() => {
    const savedOrg = localStorage.getItem("aquire_organization");
    if (savedOrg) {
      setOrgData(JSON.parse(savedOrg));
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Logo size must be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrgData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const handleSaveOrganization = async () => {
    setIsSavingOrg(true);
    try {
      // Handle password change if provided
      if (passwordForm.current || passwordForm.new || passwordForm.confirm) {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
          showToast("Please fill all password fields", "error");
          setIsSavingOrg(false);
          return;
        }

        const savedHash = localStorage.getItem("aquire_admin_password_hash") || CryptoJS.SHA256("Admin@123").toString();
        const currentHash = CryptoJS.SHA256(passwordForm.current).toString();

        if (currentHash !== savedHash) {
          showToast("Current password is incorrect", "error");
          setIsSavingOrg(false);
          return;
        }

        if (passwordForm.new !== passwordForm.confirm) {
          showToast("New passwords do not match", "error");
          setIsSavingOrg(false);
          return;
        }

        const strength = calculatePasswordStrength(passwordForm.new);
        if (strength < 100) {
          showToast("Password must be 8+ chars, with upper, number, and special char", "error");
          setIsSavingOrg(false);
          return;
        }

        const newHash = CryptoJS.SHA256(passwordForm.new).toString();
        localStorage.setItem("aquire_admin_password_hash", newHash);
      }

      const updatedOrg = { ...orgData, updated: new Date().toISOString() };
      localStorage.setItem("aquire_organization", JSON.stringify(updatedOrg));
      setOrgData(updatedOrg);
      
      // Trigger update in other components
      document.dispatchEvent(new CustomEvent('organization-updated'));
      
      showToast("Organization profile updated successfully", "success");
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error) {
      showToast("Failed to update organization", "error");
    } finally {
      setIsSavingOrg(false);
    }
  };

  // Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [previewChapterIndex, setPreviewChapterIndex] = useState(0);
  const [isPathPreviewOpen, setIsPathPreviewOpen] = useState(false);
  const [isPreviewZigZag, setIsPreviewZigZag] = useState(true);
  const [previewPath, setPreviewPath] = useState<LearningPath | null>(null);
  const [isBankPreviewOpen, setIsBankPreviewOpen] = useState(false);
  const [previewBank, setPreviewBank] = useState<QuestionBank | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedModules = localStorage.getItem("aquire_modules");
    const savedLessons = localStorage.getItem("aquire_lessons");
    const savedPaths = localStorage.getItem("aquire_learning_paths");
    const savedBanks = localStorage.getItem("aquire_question_banks");
    
    // Check if we need to force update to the new writing curriculum
    let needsUpdate = true;
    const SEED_VERSION = "v2_comprehensive";
    try {
      const savedVersion = localStorage.getItem("aquire_seed_version");
      if (savedVersion === SEED_VERSION && savedModules && savedLessons && savedBanks) {
        needsUpdate = false;
      }
    } catch (e) {
      needsUpdate = true;
    }

    if (needsUpdate) {
      setModules(INITIAL_MODULES);
      setLessons(INITIAL_LESSONS);
      setLearningPaths(INITIAL_LEARNING_PATHS);
      setQuestionBanks(INITIAL_QUESTION_BANKS);
      setLevels(INITIAL_LEVELS);
      
      const defaultPermissions: TeacherPermissions = {
        learning_paths: false,
        skill_based: false,
        assessments: true,
        create_learning_paths: false,
        create_skill_based: false,
        invite_students: false
      };

      const seedTeachers: Teacher[] = [
        { id: "t1", name: "Dr. Elizabeth Smith", email: "elizabeth.smith@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=elizabeth", levelIds: ["g4", "g5"], permissions: defaultPermissions },
        { id: "t2", name: "Prof. Robert Johnson", email: "robert.johnson@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=robert", levelIds: ["g1", "g2", "g3"], permissions: defaultPermissions },
        { id: "t3", name: "Ms. Sophia Williams", email: "sophia.williams@aquireglobal.com", status: 'active', joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=sophia", levelIds: ["g3", "g4", "g5"], permissions: defaultPermissions },
      ];
      setTeachers(seedTeachers);

      const seedStudents: Student[] = [
        { id: "s1", name: "Rahul Sharma", email: "rahul@school.com", level_id: "g5", status: "active", joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=rahul" },
        { id: "s2", name: "Aanya Gupta", email: "aanya@school.com", level_id: "g5", status: "active", joined: new Date().toISOString(), profile_pic: "https://i.pravatar.cc/150?u=aanya" },
        { id: "s3", name: "Ishaan Verma", email: "ishaan@school.com", level_id: "g5", status: "pending", joined: new Date().toISOString() },
        { id: "s4", name: "Saanvi Reddy", email: "saanvi@school.com", level_id: "g5", status: "active", joined: new Date().toISOString() },
        { id: "s5", name: "Arjun Kapoor", email: "arjun@school.com", level_id: "g5", status: "inactive", joined: new Date().toISOString() },
        { id: "s6", name: "Vivaan Shah", email: "vivaan@school.com", level_id: "g1", status: "active", joined: new Date().toISOString() },
        { id: "s7", name: "Diya Malhotra", email: "diya@school.com", level_id: "g1", status: "active", joined: new Date().toISOString() },
        { id: "s8", name: "Kabir Singh", email: "kabir@school.com", level_id: "g1", status: "active", joined: new Date().toISOString() },
        { id: "s9", name: "Myra Joshi", email: "myra@school.com", level_id: "g8", status: "pending", joined: new Date().toISOString() },
        { id: "s10", name: "Advait Nair", email: "advait@school.com", level_id: "g8", status: "pending", joined: new Date().toISOString() },
        { id: "s11", name: "Kiara Bose", email: "kiara@school.com", level_id: "g8", status: "pending", joined: new Date().toISOString() },
        { id: "s12", name: "Reyansh Goel", email: "reyansh@school.com", level_id: "g8", status: "pending", joined: new Date().toISOString() },
        { id: "s13", name: "Zoya Khan", email: "zoya@school.com", level_id: "g10", status: "active", joined: new Date().toISOString() },
        { id: "s14", name: "Aarav Patel", email: "aarav@school.com", level_id: "g10", status: "active", joined: new Date().toISOString() },
        { id: "s15", name: "Ananya Das", email: "ananya@school.com", level_id: "g10", status: "active", joined: new Date().toISOString() },
      ];
      setStudents(seedStudents);
      
      const defaultOrg = {
        name: "Aquire Global Academy",
        logo: "https://picsum.photos/seed/aquire-logo/400/400",
        address: "123 Education Excellence Way, Knowledge City, 110001",
        email: "contact@aquireglobal.com",
        phone: "+91 98765 43210",
        updated: new Date().toISOString()
      };
      setOrgData(defaultOrg);

      localStorage.setItem("aquire_modules", JSON.stringify(INITIAL_MODULES));
      localStorage.setItem("aquire_lessons", JSON.stringify(INITIAL_LESSONS));
      localStorage.setItem("aquire_learning_paths", JSON.stringify(INITIAL_LEARNING_PATHS));
      localStorage.setItem("aquire_question_banks", JSON.stringify(INITIAL_QUESTION_BANKS));
      localStorage.setItem("aquire_levels", JSON.stringify(INITIAL_LEVELS));
      localStorage.setItem("aquire_teachers", JSON.stringify(seedTeachers));
      localStorage.setItem("aquire_students", JSON.stringify(seedStudents));
      localStorage.setItem("aquire_organization", JSON.stringify(defaultOrg));
      localStorage.setItem("aquire_seed_version", SEED_VERSION);
    } else {
      setModules(JSON.parse(savedModules!));
      setLessons(JSON.parse(savedLessons!));
      if (savedPaths) setLearningPaths(JSON.parse(savedPaths));
      if (savedBanks) setQuestionBanks(JSON.parse(savedBanks));

      // Migration for teachers to ensure they have permissions
      const savedTeachers = localStorage.getItem("aquire_teachers");
      if (savedTeachers) {
        const parsedTeachers: Teacher[] = JSON.parse(savedTeachers);
        const migratedTeachers = parsedTeachers.map(t => ({
          ...t,
          permissions: t.permissions || {
            learning_paths: false,
            skill_based: false,
            assessments: true,
            create_learning_paths: false,
            create_skill_based: false,
            invite_students: false
          }
        }));
        setTeachers(migratedTeachers);
        localStorage.setItem("aquire_teachers", JSON.stringify(migratedTeachers));
      }
    }
  }, []);

  // Save data to localStorage
  const saveModules = (updatedModules: Module[]) => {
    setModules(updatedModules);
    localStorage.setItem("aquire_modules", JSON.stringify(updatedModules));
  };

  const saveLessons = (updatedLessons: Lesson[]) => {
    setLessons(updatedLessons);
    localStorage.setItem("aquire_lessons", JSON.stringify(updatedLessons));
  };

  const saveLearningPaths = (updatedPaths: LearningPath[]) => {
    setLearningPaths(updatedPaths);
    localStorage.setItem("aquire_learning_paths", JSON.stringify(updatedPaths));
  };

  const saveQuestionBanks = (updatedBanks: QuestionBank[]) => {
    setQuestionBanks(updatedBanks);
    localStorage.setItem("aquire_question_banks", JSON.stringify(updatedBanks));
  };

  // CRUD Handlers - Modules
  const handleSaveModule = (data: Omit<Module, "id" | "createdAt">) => {
    if (editingModule) {
      const updated = modules.map(m => m.id === editingModule.id ? { ...m, ...data } : m);
      saveModules(updated);
      showToast("Module updated successfully!", "success");
    } else {
      const newModule: Module = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      saveModules([newModule, ...modules]);
      showToast("Module created successfully!", "success");
    }
    setIsModuleModalOpen(false);
    setEditingModule(null);
  };

  const handleSaveCurriculum = (data: {
    module: Omit<Module, "id" | "createdAt">;
    lessons: {
      name: string;
      description: string;
      successKPIs: string[];
      chapters: string[];
    }[];
  }) => {
    const moduleId = Math.random().toString(36).substr(2, 9);
    
    // Create the module
    const newModule: Module = {
      id: moduleId,
      ...data.module,
      createdAt: new Date().toISOString(),
    };

    // Create the lessons and their skeletal chapters
    const newLessons: Lesson[] = data.lessons.map((lessonData) => {
      const lessonId = "l" + Math.random().toString(36).substr(2, 9);
      
      const chapters: Chapter[] = lessonData.chapters.map((chapterName) => ({
        id: "c" + Math.random().toString(36).substr(2, 9),
        name: chapterName,
        content: "",
        blocks: []
      }));

      return {
        id: lessonId,
        moduleId: moduleId,
        levelId: data.module.levelIds[0], // assigning first level by default
        name: lessonData.name,
        description: lessonData.description,
        successKPIs: lessonData.successKPIs,
        thumbnail: `https://picsum.photos/seed/${lessonId}/800/600`,
        chapters: chapters,
        createdAt: new Date().toISOString(),
      };
    });

    saveModules([newModule, ...modules]);
    saveLessons([...newLessons, ...lessons]);
    showToast("Curriculum infrastructure created! You can now add content to chapters.", "success");
  };

  const handleSaveSkillLesson = (lessonId: string, data: { isSkillLesson: boolean; learningPathId: string; starNumber: number }) => {
    const updated = lessons.map(l => l.id === lessonId ? { ...l, ...data } : l);
    saveLessons(updated);
    showToast("Skill lesson assignment saved!", "success");
    
    // Also update the learning path group if needed
    const savedLesson = updated.find(l => l.id === lessonId);
    if (savedLesson && savedLesson.isSkillLesson && savedLesson.learningPathId) {
      const updatedPaths = learningPaths.map(p => {
        if (p.id === savedLesson.learningPathId) {
          const starsData = p.starsData || [];
          const starIdx = starsData.findIndex(s => s.star === savedLesson.starNumber);
          
          if (starIdx > -1) {
            const updatedStarsData = [...starsData];
            if (!updatedStarsData[starIdx].skillLessonIds.includes(savedLesson.id)) {
              updatedStarsData[starIdx].skillLessonIds = [...updatedStarsData[starIdx].skillLessonIds, savedLesson.id];
            }
            return { ...p, starsData: updatedStarsData };
          } else {
            return {
              ...p,
              starsData: [...starsData, {
                star: savedLesson.starNumber!,
                mainLessonId: null,
                skillLessonIds: [savedLesson.id]
              }]
            };
          }
        }
        return p;
      });
      saveLearningPaths(updatedPaths);
    }
  };

  // CRUD Handlers - Lessons
  const handleSaveLesson = (data: Omit<Lesson, "id" | "chapters" | "createdAt">) => {
    let savedLesson: Lesson;
    if (editingLesson) {
      savedLesson = { ...editingLesson, ...data };
      const updated = lessons.map(l => l.id === editingLesson.id ? savedLesson : l);
      saveLessons(updated);
      showToast("Lesson updated successfully!", "success");
    } else {
      savedLesson = {
        id: "l" + Math.random().toString(36).substr(2, 9),
        ...data,
        chapters: [],
        createdAt: new Date().toISOString(),
      };
      saveLessons([savedLesson, ...lessons]);
      showToast("Lesson created successfully!", "success");
    }

    // Update Learning Path if it's a skill lesson
    if (savedLesson.isSkillLesson && savedLesson.learningPathId) {
      const updatedPaths = learningPaths.map(p => {
        if (p.id === savedLesson.learningPathId) {
          const starsData = p.starsData || [];
          const starIdx = starsData.findIndex(s => s.star === savedLesson.starNumber);
          
          if (starIdx > -1) {
            const updatedStarsData = [...starsData];
            if (!updatedStarsData[starIdx].skillLessonIds.includes(savedLesson.id)) {
              updatedStarsData[starIdx].skillLessonIds = [...updatedStarsData[starIdx].skillLessonIds, savedLesson.id];
            }
            return { ...p, starsData: updatedStarsData };
          } else {
            return {
              ...p,
              starsData: [...starsData, {
                star: savedLesson.starNumber!,
                mainLessonId: null,
                skillLessonIds: [savedLesson.id]
              }]
            };
          }
        }
        return p;
      });
      saveLearningPaths(updatedPaths);
    }

    setIsLessonModalOpen(false);
    setEditingLesson(null);
  };

  // CRUD Handlers - Chapters
  const handleSaveChapter = (data: Omit<Chapter, "id">) => {
    if (!selectedLessonId) return;
    const updated = lessons.map(l => {
      if (l.id === selectedLessonId) {
        if (editingChapter) {
          return {
            ...l,
            chapters: (l.chapters || []).map(c => c.id === editingChapter.id ? { ...c, ...data } : c)
          };
        } else {
          return {
            ...l,
            chapters: [...l.chapters, { ...data, id: "c" + Math.random().toString(36).substr(2, 9), blocks: [] }]
          };
        }
      }
      return l;
    });
    saveLessons(updated);
    showToast(editingChapter ? "Chapter updated!" : "Chapter added!", "success");
    setIsChapterModalOpen(false);
    setEditingChapter(null);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (itemToDelete.type === "module") {
      const updatedModules = modules.filter(m => m.id !== itemToDelete.id);
      const updatedLessons = lessons.filter(l => l.moduleId !== itemToDelete.id);
      saveModules(updatedModules);
      saveLessons(updatedLessons);
      showToast("Module and associated lessons deleted.", "success");
    } else if (itemToDelete.type === "lesson") {
      const updated = lessons.filter(l => l.id !== itemToDelete.id);
      saveLessons(updated);
      showToast("Lesson deleted successfully!", "success");
    } else if (itemToDelete.type === "chapter" && selectedLessonId) {
      const updated = lessons.map(l => {
        if (l.id === selectedLessonId) {
          return { ...l, chapters: l.chapters.filter(c => c.id !== itemToDelete.id) };
        }
        return l;
      });
      saveLessons(updated);
      showToast("Chapter deleted successfully!", "success");
    } else if (itemToDelete.type === "learning-path") {
      const updated = learningPaths.filter(p => p.id !== itemToDelete.id);
      saveLearningPaths(updated);
      showToast("Learning Path deleted successfully!", "success");
    } else if (itemToDelete.type === "assessments") {
      const updated = questionBanks.filter(b => b.id !== itemToDelete.id);
      saveQuestionBanks(updated);
      showToast("Assessment deleted successfully!", "success");
    }

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleSaveLearningPath = (data: Omit<LearningPath, "id" | "createdAt">) => {
    if (editingPath) {
      const updated = learningPaths.map(p => p.id === editingPath.id ? { ...p, ...data } : p);
      saveLearningPaths(updated);
      showToast("Learning Path updated successfully!", "success");
    } else {
      const newPath: LearningPath = {
        id: "lp" + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      saveLearningPaths([newPath, ...learningPaths]);
      showToast("Learning Path created successfully!", "success");
    }
    setIsLearningPathModalOpen(false);
    setEditingPath(null);
  };

  const handleSaveQuestionBank = (data: Omit<QuestionBank, "id" | "createdAt">) => {
    if (editingBank) {
      const updated = questionBanks.map(b => b.id === editingBank.id ? { ...b, ...data } : b);
      saveQuestionBanks(updated);
      showToast("Question Bank updated successfully!", "success");
    } else {
      const newBank: QuestionBank = {
        id: "qb" + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      saveQuestionBanks([newBank, ...questionBanks]);
      showToast("Question Bank created successfully!", "success");
    }
    setIsQuestionBankModalOpen(false);
    setEditingBank(null);
  };

  // Filtering & Sorting
  const filteredModules = useMemo(() => {
    let result = modules.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return result;
  }, [modules, searchQuery, sortOrder]);

  const filteredLessons = useMemo(() => {
    let result = lessons.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = moduleFilter === "all" || l.moduleId === moduleFilter;
      return matchesSearch && matchesModule;
    });
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return result;
  }, [lessons, searchQuery, moduleFilter, sortOrder]);

  const filteredLearningPaths = useMemo(() => {
    let result = learningPaths.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = moduleFilter === "all" || p.moduleId === moduleFilter;
      const matchesStars = starFilter === "all" || p.stars.toString() === starFilter;
      return matchesSearch && matchesModule && matchesStars;
    });
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return result;
  }, [learningPaths, searchQuery, moduleFilter, starFilter, sortOrder]);

  // Pagination
  const currentItems = activeTab === "curriculum" ? filteredModules : 
                      activeTab === "learning-paths" ? filteredLearningPaths : [];
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const paginatedItems = currentItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder, moduleFilter, activeTab]);

  const selectedLesson = useMemo(() => 
    lessons.find(l => l.id === selectedLessonId), 
  [lessons, selectedLessonId]);

  const stats = [
    { label: "Total Students", value: "1,284", change: "+12%", icon: <Users className="text-aquire-primary" />, color: "bg-aquire-primary/10" },
    { label: "Active Modules", value: modules.length.toString(), change: "+3", icon: <Layers className="text-emerald-500" />, color: "bg-emerald-500/10" },
    { label: "Total Lessons", value: lessons.length.toString(), change: "+8%", icon: <BookOpen className="text-amber-500" />, color: "bg-amber-500/10" },
    { label: "Completion Rate", value: "89%", change: "+2%", icon: <TrendingUp className="text-purple-500" />, color: "bg-purple-500/10" },
  ];

  const renderDashboard = () => (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 group hover:border-aquire-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                stat.change.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              }`}>
                {stat.change}
              </span>
            </div>
            <h4 className="text-aquire-grey-med font-semibold text-sm uppercase tracking-wider mb-1">{stat.label}</h4>
            <p className="text-3xl font-bold text-aquire-black tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-aquire-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-aquire-black">Recent Activity</h3>
              <button className="text-aquire-primary font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="p-0">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className={`p-6 flex items-center gap-4 hover:bg-aquire-grey-light transition-colors ${i !== 2 ? 'border-b border-aquire-border' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-aquire-grey-light flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-aquire-grey-med" />
                  </div>
                  <div className="flex-1">
                    <p className="text-aquire-text-heading font-bold">New lesson added to "Advanced Algebra"</p>
                    <p className="text-aquire-grey-med text-sm">2 hours ago • by Admin</p>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition-all text-aquire-grey-med">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-8 bg-aquire-black text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-aquire-primary/20 blur-3xl rounded-full" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setIsCurriculumWizardOpen(true)}
                  className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                >
                  <Sparkles size={20} />
                  Curriculum Builder
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-aquire-black mb-4">Storage Usage</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-aquire-grey-med font-medium">Video Content</span>
                <span className="text-aquire-black font-bold">4.2 GB / 10 GB</span>
              </div>
              <div className="w-full h-3 bg-aquire-grey-light rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "42%" }}
                  className="h-full bg-aquire-primary rounded-full"
                />
              </div>
              <p className="text-xs text-aquire-grey-med">You have used 42% of your total storage capacity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  const renderCurriculum = () => {
    if (editingChapterInEditor) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest">
              <span>Curriculum</span>
              <ChevronRight size={12} />
              <span>{selectedLesson?.name}</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Editor</span>
            </div>
            <button 
              onClick={() => {
                setPreviewLesson(selectedLesson || null);
                setPreviewChapterIndex(selectedLesson?.chapters.findIndex(c => c.id === editingChapterInEditor.id) || 0);
                setIsPreviewOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-dark hover:bg-aquire-grey-light transition-all text-sm font-bold shadow-sm"
            >
              <Eye size={18} />
              Preview Chapter
            </button>
          </div>
          <ChapterEditor 
            chapter={editingChapterInEditor}
            onBack={() => setEditingChapterInEditor(null)}
            onUpdate={(updatedChapter) => {
              if (!selectedLessonId) return;
              setLessons(prev => prev.map(l => {
                if (l.id === selectedLessonId) {
                  return {
                    ...l,
                    chapters: (l.chapters || []).map(c => c.id === updatedChapter.id ? updatedChapter : c)
                  };
                }
                return l;
              }));
            }}
            onSave={(updatedChapter) => {
              if (!selectedLessonId) return;
              setLessons(prev => prev.map(l => {
                if (l.id === selectedLessonId) {
                  return {
                    ...l,
                    chapters: (l.chapters || []).map(c => c.id === updatedChapter.id ? updatedChapter : c)
                  };
                }
                return l;
              }));
              showToast("Chapter saved successfully", "success");
              setEditingChapterInEditor(null);
            }}
            showToast={showToast}
          />
        </div>
      );
    }

    if (isPreviewOpen && previewLesson) {
      return (
        <StudentPreview 
          lesson={previewLesson}
          initialChapterIndex={previewChapterIndex}
          onClose={() => setIsPreviewOpen(false)}
        />
      );
    }

    const toggleModule = (moduleId: string) => {
      setExpandedModules(prev => 
        prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
      );
    };

    const toggleLesson = (lessonId: string) => {
      setExpandedLessons(prev => 
        prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
      );
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Academic</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Curriculum Builder</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Curriculum Management</h2>
            <p className="text-aquire-grey-med">Structure your modules, lessons, and chapters in one place.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCurriculumWizardOpen(true)}
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
            >
              <Sparkles size={20} />
              Wizard Builder
            </button>
          </div>
        </div>

        {/* Search Bar for Curriculum */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules or lessons..." 
              className="w-full pl-12 pr-4 py-4 input-field bg-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredModules.map((module) => {
            const moduleLessons = lessons.filter(l => l.moduleId === module.id);
            const isExpanded = expandedModules.includes(module.id);

            return (
              <div key={module.id} className="card overflow-hidden transition-all duration-300">
                {/* Module Header */}
                <div 
                  className={`p-6 flex items-center justify-between cursor-pointer hover:bg-aquire-grey-light transition-colors ${isExpanded ? 'bg-aquire-grey-light/50 border-b border-aquire-border' : ''}`}
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-aquire-primary/10 flex items-center justify-center text-aquire-primary shrink-0">
                      <Layers size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-aquire-black flex items-center gap-2 flex-wrap">
                        {module.name}
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-aquire-primary/10 text-aquire-primary text-[10px] font-black rounded uppercase tracking-wider">
                            {moduleLessons.length} Lessons
                          </span>
                          {module.levelIds?.map(levelId => {
                            const level = levels.find(g => g.id === levelId);
                            return level ? (
                              <span key={levelId} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded uppercase tracking-wider border border-indigo-100">
                                {level.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </h3>
                      <p className="text-xs text-aquire-grey-med line-clamp-1">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingModule(module); setIsModuleModalOpen(true); }}
                        className="p-2 hover:bg-white rounded-lg text-aquire-grey-med hover:text-aquire-primary transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setItemToDelete({ id: module.id, type: "module" }); setIsDeleteModalOpen(true); }}
                        className="p-2 hover:bg-white rounded-lg text-aquire-grey-med hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <ChevronDown size={20} className={`text-aquire-grey-med transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Lessons Container */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-white"
                    >
                      {moduleLessons.length === 0 ? (
                        <div className="p-10 text-center text-aquire-grey-med italic text-sm">
                          No lessons added to this module yet.
                          <button 
                            onClick={() => { setEditingLesson(null); setIsLessonModalOpen(true); }}
                            className="ml-2 text-aquire-primary font-bold hover:underline"
                          >
                            Add First Lesson
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-aquire-border">
                          {moduleLessons.map((lesson) => {
                            const isLessonExpanded = expandedLessons.includes(lesson.id);
                            return (
                              <div key={lesson.id} className="bg-aquire-grey-light/20">
                                {/* Lesson Header */}
                                <div 
                                  className="px-8 py-4 flex items-center justify-between cursor-pointer hover:bg-aquire-grey-light/40 transition-colors"
                                  onClick={() => toggleLesson(lesson.id)}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-8 rounded-lg overflow-hidden border border-aquire-border shrink-0">
                                      <img src={lesson.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-bold text-aquire-grey-dark flex items-center gap-2 flex-wrap">
                                        {lesson.name}
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-medium text-aquire-grey-med">
                                            ({lesson.chapters?.length || 0} Chapters)
                                          </span>
                                          {lesson.levelId && (
                                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded uppercase tracking-wider border border-blue-100">
                                              {levels.find(g => g.id === lesson.levelId)?.name || "Level"}
                                            </span>
                                          )}
                                        </div>
                                      </h4>
                                      {lesson.successKPIs && lesson.successKPIs.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {lesson.successKPIs.map((kpi, kIdx) => (
                                            <span key={kIdx} className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded uppercase tracking-wider border border-emerald-100/50">
                                              {kpi}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setEditingLesson(lesson); setIsLessonModalOpen(true); }}
                                        className="p-1.5 hover:bg-white rounded-lg text-aquire-grey-med hover:text-aquire-primary transition-all"
                                      >
                                        <Edit size={14} />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setItemToDelete({ id: lesson.id, type: "lesson" }); setIsDeleteModalOpen(true); }}
                                        className="p-1.5 hover:bg-white rounded-lg text-aquire-grey-med hover:text-red-500 transition-all"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                    <ChevronDown size={16} className={`text-aquire-grey-med transition-transform duration-300 ${isLessonExpanded ? 'rotate-180' : ''}`} />
                                  </div>
                                </div>

                                {/* Chapters Container */}
                                <AnimatePresence>
                                  {isLessonExpanded && (
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="pl-20 pr-8 pb-4 space-y-2 overflow-hidden"
                                    >
                                      {lesson.chapters?.map((chapter, idx) => (
                                        <div key={chapter.id} className="flex items-center justify-between p-3 bg-white border border-aquire-border rounded-xl group hover:border-aquire-primary transition-all shadow-sm">
                                          <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-aquire-grey-light flex items-center justify-center text-[10px] font-bold text-aquire-grey-med group-hover:bg-aquire-primary group-hover:text-white transition-all">
                                              {idx + 1}
                                            </span>
                                            <span className="text-xs font-bold text-aquire-grey-dark">{chapter.name}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <button 
                                              onClick={() => {
                                                setSelectedLessonId(lesson.id);
                                                setEditingChapterInEditor(chapter);
                                              }}
                                              className="flex items-center gap-1.5 px-3 py-1.5 bg-aquire-primary/5 text-aquire-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-aquire-primary hover:text-white transition-all"
                                            >
                                              <FileText size={12} />
                                              Edit Content
                                            </button>
                                            <button 
                                              onClick={() => { setEditingChapter(chapter); setSelectedLessonId(lesson.id); setIsChapterModalOpen(true); }}
                                              className="p-1.5 hover:bg-aquire-grey-light rounded-lg text-aquire-grey-med hover:text-aquire-primary transition-all"
                                            >
                                              <Edit size={12} />
                                            </button>
                                            <button 
                                              onClick={() => { setItemToDelete({ id: chapter.id, type: "chapter" }); setSelectedLessonId(lesson.id); setIsDeleteModalOpen(true); }}
                                              className="p-1.5 hover:bg-aquire-grey-light rounded-lg text-aquire-grey-med hover:text-red-500 transition-all"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      <button 
                                        onClick={() => { setSelectedLessonId(lesson.id); setEditingChapter(null); setIsChapterModalOpen(true); }}
                                        className="w-full py-2 border-dashed border border-aquire-border rounded-xl text-xs font-bold text-aquire-grey-med hover:border-aquire-primary hover:text-aquire-primary transition-all flex items-center justify-center gap-2"
                                      >
                                        <Plus size={14} />
                                        Add New Chapter
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                          <div className="p-4 bg-aquire-grey-light/10 border-t border-aquire-border">
                            <button 
                              onClick={() => { setEditingLesson(null); setIsLessonModalOpen(true); }}
                              className="w-full py-3 bg-white border border-aquire-border rounded-xl text-sm font-bold text-aquire-grey-dark hover:bg-aquire-grey-light transition-all flex items-center justify-center gap-2"
                            >
                              <Plus size={18} className="text-aquire-primary" />
                              Add New Lesson to Module
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderSkills = () => {
    const skillLessons = lessons.filter(l => l.isSkillLesson);
    const filteredSkills = skillLessons.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Academic</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Skill-Based Lessons</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Skill-Based Lessons</h2>
            <p className="text-aquire-grey-med">Manage floating lessons that reinforce specific skills within learning paths.</p>
          </div>
          <button 
            onClick={() => setIsSkillLessonModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={20} />
            Add Skill Lesson
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill lessons..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredSkills.map((lesson) => (
            <motion.div
              key={lesson.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 flex items-center gap-6 hover:border-aquire-primary transition-all group"
            >
              <div className="w-20 h-12 rounded-lg overflow-hidden shrink-0 border border-aquire-border">
                <img 
                  src={lesson.thumbnail} 
                  alt={lesson.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black text-aquire-primary uppercase tracking-widest">
                    {modules.find(m => m.id === lesson.moduleId)?.name || "General"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-aquire-grey-med" />
                  <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">
                    {lesson.chapters.length} Chapters
                  </span>
                  <span className="w-1 h-1 rounded-full bg-aquire-grey-med" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {levels.find(l => l.id === lesson.levelId)?.name || "Level"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-aquire-black truncate group-hover:text-aquire-primary transition-colors">
                  {lesson.name}
                </h3>
              </div>

              <div className="hidden md:flex flex-col items-end shrink-0 px-6 border-x border-aquire-border">
                <div className="flex items-center gap-1.5 text-xs font-bold text-aquire-black">
                  <Trophy size={14} className="text-amber-500" />
                  <span>Star {lesson.starNumber}</span>
                </div>
                <span className="text-[10px] font-medium text-aquire-grey-med italic">
                  {learningPaths.find(p => p.id === lesson.learningPathId)?.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => {
                    setPreviewLesson(lesson);
                    setPreviewChapterIndex(0);
                    setIsPreviewOpen(true);
                  }}
                  className="p-2 hover:bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary transition-all"
                  title="Preview"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => {
                    setEditingLesson(lesson);
                    setIsLessonModalOpen(true);
                  }}
                  className="p-2 hover:bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary transition-all"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => {
                    const updated = lessons.map(l => 
                      l.id === lesson.id ? { ...l, isSkillLesson: false, learningPathId: undefined, starNumber: undefined } : l
                    );
                    saveLessons(updated);
                    showToast("Skill lesson removed", "success");
                  }}
                  className="p-2 hover:bg-red-50 text-aquire-grey-med hover:text-red-500 transition-all"
                  title="Remove Skill Assignment"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {skillLessons.length === 0 && (
          <div className="py-20 text-center card border-dashed border-2 border-aquire-border bg-transparent shadow-none">
            <div className="w-16 h-16 bg-aquire-grey-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} className="text-aquire-grey-med" />
            </div>
            <h3 className="text-xl font-bold text-aquire-black mb-2">No Skill Lessons Found</h3>
            <p className="text-aquire-grey-med max-w-sm mx-auto mb-8">
              Skill lessons are floating lessons that reinforce specific skills. Add one to get started!
            </p>
            <button 
              onClick={() => setIsSkillLessonModalOpen(true)}
              className="btn-primary"
            >
              <Plus size={20} />
              Add First Skill Lesson
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const renderLearningPaths = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Academic</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Learning Paths</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Learning Paths</h2>
            <p className="text-aquire-grey-med">Create and manage sequential learning journeys for students.</p>
          </div>
          <button 
            onClick={() => {
              setEditingPath(null);
              setIsLearningPathModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={20} />
            Create Learning Path
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paths..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4" />
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="pl-10 pr-10 py-4 bg-white border border-aquire-border rounded-xl text-aquire-grey-dark text-sm font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-aquire-primary/20"
              >
                <option value="all">All Modules</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative">
              <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4" />
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="pl-10 pr-10 py-4 bg-white border border-aquire-border rounded-xl text-aquire-grey-dark text-sm font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-aquire-primary/20"
              >
                <option value="all">All Stars</option>
                {[5, 10, 15, 20].map(n => (
                  <option key={n} value={n.toString()}>{n} Stars</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-aquire-border text-aquire-grey-med text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-4">Path Details</th>
                  <th className="px-6 py-4">Levels</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">Stars</th>
                  <th className="px-6 py-4">Lessons</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {(paginatedItems as LearningPath[]).map((path) => (
                    <motion.tr 
                      key={path.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border-b border-aquire-border hover:bg-aquire-grey-light transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-aquire-text-heading font-bold">{path.name}</h4>
                          <p className="text-aquire-grey-med text-xs line-clamp-1" dangerouslySetInnerHTML={{ __html: path.description }}></p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {path.levelIds?.map(lid => {
                            const l = levels.find(level => level.id === lid);
                            return l ? (
                              <span key={lid} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                                {l.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-aquire-grey-light text-aquire-grey-dark text-[10px] font-bold uppercase tracking-widest border border-aquire-border">
                          {modules.find(m => m.id === path.moduleId)?.name || "Module"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-amber-600 font-bold">
                          <Star size={14} fill="currentColor" />
                          {path.stars}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-aquire-grey-med text-xs">
                          <BookOpen size={14} />
                          {path.starLessons.filter(l => l !== null).length} / {path.stars}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setPreviewPath(path);
                              setIsPreviewZigZag(true);
                              setIsPathPreviewOpen(true);
                            }}
                            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary transition-all"
                            title="Gamified Zig-Zag Preview"
                          >
                            <Sparkles size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setPreviewPath(path);
                              setIsPreviewZigZag(false);
                              setIsPathPreviewOpen(true);
                            }}
                            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary transition-all"
                            title="Sequential Preview"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingPath(path);
                              setIsLearningPathModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-primary/10 transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setItemToDelete({ id: path.id, type: "learning-path" });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredLearningPaths.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-aquire-grey-med">
                      No learning paths found. Create your first one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
      </motion.div>
    );
  };

  const renderAssessments = () => {
    const filteredBanks = questionBanks.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-aquire-border">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={20} />
            <input 
              type="text" 
              placeholder="Search assessments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-aquire-grey-light border border-aquire-border rounded-2xl focus:outline-none focus:border-aquire-primary transition-all"
            />
          </div>
          <button 
            onClick={() => {
              setEditingBank(null);
              setIsQuestionBankModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-aquire-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-aquire-primary/20 transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Create Assessment
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-aquire-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-aquire-border text-aquire-grey-med text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-4">Assessment Details</th>
                  <th className="px-6 py-4">Levels</th>
                  <th className="px-6 py-4">Questions</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {filteredBanks.map((bank) => (
                    <motion.tr 
                      key={bank.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border-b border-aquire-border hover:bg-aquire-grey-light transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-aquire-text-heading font-bold">{bank.name}</h4>
                          <p className="text-aquire-grey-med text-xs line-clamp-1">{bank.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {bank.levelIds?.map(lid => {
                            const l = levels.find(level => level.id === lid);
                            return l ? (
                              <span key={lid} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                                {l.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-aquire-primary text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                          {bank.questions.filter(q => q.type !== 'section').length} Questions
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-aquire-text-heading">
                          {bank.questions.reduce((acc, q) => acc + (q.marks || 0), 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-aquire-grey-med text-xs">
                        {new Date(bank.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setPreviewBank(bank);
                              setIsBankPreviewOpen(true);
                            }}
                            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary transition-all"
                            title="Preview Student View"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingBank(bank);
                              setIsQuestionBankModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-primary/10 transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setItemToDelete({ id: bank.id, type: "assessments" });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-3 bg-aquire-grey-light rounded-xl text-aquire-grey-med hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredBanks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-aquire-grey-med">
                      No assessments found. Create your first one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSchoolProfile = () => {
    const strength = calculatePasswordStrength(passwordForm.new);
    const strengthColor = strength === 0 ? "bg-aquire-grey-light" : strength < 50 ? "bg-red-500" : strength < 100 ? "bg-amber-500" : "bg-emerald-500";

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-8 space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-aquire-border">
              <div className="w-10 h-10 bg-aquire-primary/10 rounded-xl flex items-center justify-center">
                <Building2 className="text-aquire-primary" size={20} />
              </div>
              <h3 className="text-xl font-bold text-aquire-black">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">School Name</label>
                <input 
                  type="text" 
                  value={orgData.name}
                  onChange={(e) => setOrgData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                  placeholder="e.g. ABC International School"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Admin Email</label>
                <input 
                  type="email" 
                  value={orgData.email}
                  onChange={(e) => setOrgData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field w-full"
                  placeholder="admin@school.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Contact Number</label>
                <input 
                  type="text" 
                  value={orgData.phone}
                  onChange={(e) => setOrgData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field w-full"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">School Address</label>
                <textarea 
                  value={orgData.address}
                  onChange={(e) => setOrgData(prev => ({ ...prev, address: e.target.value }))}
                  className="input-field w-full min-h-[100px] py-3"
                  placeholder="Full postal address..."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-aquire-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="text-amber-500" size={20} />
                </div>
                <h3 className="text-xl font-bold text-aquire-black">Security Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Current Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={16} />
                    <input 
                      type="password" 
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                      className="input-field w-full pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={16} />
                    <input 
                      type="password" 
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                      className="input-field w-full pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                  {passwordForm.new && (
                    <div className="space-y-1.5 mt-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-aquire-grey-med">Strength</span>
                        <span className={strength === 100 ? "text-emerald-500" : "text-amber-500"}>
                          {strength === 0 ? "None" : strength < 50 ? "Weak" : strength < 100 ? "Good" : "Strong"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-aquire-grey-light rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${strength}%` }}
                          className={`h-full ${strengthColor} transition-all duration-500`}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Confirm Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={16} />
                    <input 
                      type="password" 
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                      className="input-field w-full pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo & Branding */}
        <div className="space-y-6">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-aquire-border">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Sparkles className="text-purple-500" size={20} />
              </div>
              <h3 className="text-xl font-bold text-aquire-black">Branding</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">School Logo</label>
                <div className="flex flex-col items-center gap-6 p-8 bg-aquire-grey-light/50 rounded-3xl border-2 border-dashed border-aquire-border">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-aquire-border overflow-hidden group relative">
                    {orgData.logo ? (
                      <img src={orgData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                    ) : (
                      <Building2 className="text-aquire-grey-med w-12 h-12" />
                    )}
                    <div className="absolute inset-0 bg-aquire-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-2 bg-white rounded-lg text-aquire-black">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="text-aquire-primary font-bold hover:underline mb-1">Upload new logo</button>
                    <p className="text-[10px] text-aquire-grey-med uppercase tracking-widest">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Logo URL (Optional)</label>
                <input 
                  type="text" 
                  value={orgData.logo}
                  onChange={(e) => setOrgData(prev => ({ ...prev, logo: e.target.value }))}
                  className="input-field w-full"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>

          <div className="card p-8 bg-aquire-black text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-aquire-primary/20 blur-3xl rounded-full" />
            <h4 className="text-lg font-bold mb-2 relative z-10">Need Help?</h4>
            <p className="text-white/60 text-sm mb-6 relative z-10">Contact our support team if you need assistance with your school settings.</p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold transition-all relative z-10">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLevels = () => {
    const filteredLevels = levels.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      if (levelSort.field === 'name') {
        return levelSort.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return levelSort.direction === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
      }
    });

    const paginatedLevels = filteredLevels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalLevelPages = Math.ceil(filteredLevels.length / itemsPerPage);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search levels by name or description..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLevelSort(prev => ({ field: 'name', direction: prev.field === 'name' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
              className={`px-4 py-3 rounded-xl border font-bold text-sm flex items-center gap-2 transition-all ${levelSort.field === 'name' ? 'bg-aquire-primary/10 border-aquire-primary text-aquire-primary' : 'bg-white border-aquire-border text-aquire-grey-med'}`}
            >
              Name {levelSort.field === 'name' && (levelSort.direction === 'asc' ? '▲' : '▼')}
            </button>
            <button 
              onClick={() => setLevelSort(prev => ({ field: 'status', direction: prev.field === 'status' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
              className={`px-4 py-3 rounded-xl border font-bold text-sm flex items-center gap-2 transition-all ${levelSort.field === 'status' ? 'bg-aquire-primary/10 border-aquire-primary text-aquire-primary' : 'bg-white border-aquire-border text-aquire-grey-med'}`}
            >
              Status {levelSort.field === 'status' && (levelSort.direction === 'asc' ? '▲' : '▼')}
            </button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-aquire-grey-light/50 border-b border-aquire-border">
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Level Name</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aquire-border">
                {paginatedLevels.map((level) => (
                  <tr key={level.id} className="hover:bg-aquire-grey-light/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-aquire-black">{level.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-aquire-grey-med">
                      {level.description || "No description"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        level.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {level.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingLevel(level);
                            setLevelForm({ name: level.name, description: level.description, status: level.status });
                            setIsLevelModalOpen(true);
                          }}
                          className="p-2 hover:bg-aquire-primary/10 text-aquire-primary rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => toggleLevelStatus(level.id)}
                          className={`p-2 rounded-lg transition-all ${
                            level.status === 'active' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'
                          }`}
                          title={level.status === 'active' ? "Deactivate" : "Activate"}
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setItemToDelete({ id: level.id, type: 'level', name: level.name });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLevels.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-aquire-grey-med">
                      No levels found. Add your first level to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalLevelPages > 1 && (
          <div className="mt-8 pt-8 border-t border-aquire-border flex items-center justify-between">
            <p className="text-aquire-grey-med text-xs font-bold uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLevels.length)} of {filteredLevels.length}
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalLevelPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                      currentPage === page 
                        ? "bg-aquire-primary text-white shadow-lg shadow-aquire-primary/20" 
                        : "bg-white border border-aquire-border text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-grey-light"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalLevelPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Level Modal */}
        <AnimatePresence>
          {isLevelModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLevelModalOpen(false)}
                className="absolute inset-0 bg-aquire-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative z-10"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-aquire-black">
                        {editingLevel ? 'Edit Level' : 'Add New Level'}
                      </h3>
                      <p className="text-aquire-grey-med text-sm">
                        {editingLevel ? 'Update level details.' : 'Create a new academic level.'}
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsLevelModalOpen(false)}
                      className="p-2 hover:bg-aquire-grey-light rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Level Name</label>
                      <input 
                        type="text" 
                        value={levelForm.name}
                        onChange={(e) => setLevelForm(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field w-full"
                        placeholder="e.g. Level 5 or Class 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Description</label>
                      <textarea 
                        value={levelForm.description}
                        onChange={(e) => setLevelForm(prev => ({ ...prev, description: e.target.value }))}
                        className="input-field w-full min-h-[100px] py-3"
                        placeholder="e.g. Primary level students..."
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button 
                      onClick={() => setIsLevelModalOpen(false)}
                      className="flex-1 py-4 px-6 border border-aquire-border rounded-2xl font-bold text-aquire-grey-med hover:bg-aquire-grey-light transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveLevel}
                      className="flex-1 py-4 px-6 bg-aquire-primary text-white rounded-2xl font-bold shadow-lg shadow-aquire-primary/20 hover:bg-aquire-primary-hover transition-all"
                    >
                      {editingLevel ? 'Update Level' : 'Add Level'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderOrganization = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Organization</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Manage School</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">
              {manageSchoolTab === 'profile' ? 'School Profile' : 'Level Management'}
            </h2>
            <p className="text-aquire-grey-med">
              {manageSchoolTab === 'profile' 
                ? "Manage your school's branding, contact information, and security settings."
                : "Define and manage academic levels and classes for your institution."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {manageSchoolTab === 'profile' ? (
              <>
                <button 
                  onClick={() => {
                    const defaultOrg = {
                      name: "Aquire Academy",
                      logo: "",
                      address: "Delhi, India",
                      email: "admin@gmail.com",
                      phone: "+91-XXXXXXXXXX",
                      updated: new Date().toISOString()
                    };
                    setOrgData(defaultOrg);
                    localStorage.setItem("aquire_organization", JSON.stringify(defaultOrg));
                    document.dispatchEvent(new CustomEvent('organization-updated'));
                    showToast("Reset to default branding", "success");
                  }}
                  className="px-6 py-3 border border-aquire-border rounded-xl text-aquire-grey-med font-bold hover:bg-aquire-grey-light transition-all flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Reset to Default
                </button>
                <button 
                  onClick={handleSaveOrganization}
                  disabled={isSavingOrg}
                  className="btn-primary min-w-[160px]"
                >
                  {isSavingOrg ? <Loader2 size={20} className="animate-spin" /> : <><Plus size={20} /> Save Profile</>}
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setEditingLevel(null);
                  setLevelForm({ name: "", description: "", status: "active" });
                  setIsLevelModalOpen(true);
                }}
                className="btn-primary"
              >
                <Plus size={20} />
                Add Level
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-aquire-border w-fit">
          <button
            onClick={() => setManageSchoolTab('profile')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${manageSchoolTab === 'profile' ? 'bg-white text-aquire-primary shadow-sm' : 'text-aquire-grey-med hover:text-aquire-black'}`}
          >
            School Profile
          </button>
          <button
            onClick={() => setManageSchoolTab('levels')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${manageSchoolTab === 'levels' ? 'bg-white text-aquire-primary shadow-sm' : 'text-aquire-grey-med hover:text-aquire-black'}`}
          >
            Levels
          </button>
        </div>

        {manageSchoolTab === 'profile' ? renderSchoolProfile() : renderLevels()}
      </motion.div>
    );
  };

  const renderTeachers = () => {
    const filteredTeachers = teachers.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isTeacherModalOpen) {
      const teacherStudents = students.filter(s => teacherForm.levelIds.includes(s.level_id));
      const filteredTeacherStudents = teacherStudents.filter(s => 
        s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
      );

      const studentsByLevel = teacherForm.levelIds.reduce((acc, levelId) => {
        acc[levelId] = filteredTeacherStudents.filter(s => s.level_id === levelId);
        return acc;
      }, {} as Record<string, Student[]>);

      return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 pb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => {
                setIsTeacherModalOpen(false);
                setEditingTeacher(null);
                setTeacherForm({
                  name: "",
                  email: "",
                  levelIds: [],
                  assignedStudentIds: [],
                  permissions: {
                    learning_paths: true,
                    skill_based: true,
                    assessments: true,
                    create_learning_paths: true,
                    create_skill_based: true,
                    invite_students: true
                  }
                });
              }}
              className="p-2 hover:bg-aquire-grey-light rounded-xl transition-colors text-aquire-grey-med"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
                <span>Organization</span>
                <ChevronRight size={12} />
                <span>Teachers</span>
                <ChevronRight size={12} />
                <span className="text-aquire-primary">{editingTeacher ? "Edit Teacher" : "Invite Teacher"}</span>
              </div>
              <h2 className="text-3xl font-bold text-aquire-black">{editingTeacher ? "Edit Teacher" : "Invite Teacher"}</h2>
              <p className="text-aquire-grey-med">{editingTeacher ? "Update teacher profile and level assignments." : "Send an invitation to join Aquire Academy."}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section: Teacher Profile Card */}
              <div className="card p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <GraduationCap size={120} />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-4xl font-bold shadow-xl border border-white/30 overflow-hidden">
                    {editingTeacher?.profile_pic ? (
                      <img src={editingTeacher.profile_pic} alt={editingTeacher.name} className="w-full h-full object-cover" />
                    ) : (
                      teacherForm.name.charAt(0) || <User size={48} />
                    )}
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="text-3xl font-bold">{teacherForm.name || "New Teacher"}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{teacherForm.email || "No email provided"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>+91 98765 43210</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
                        Senior Faculty
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Form Fields */}
              <div className="card p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest flex items-center gap-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={teacherForm.name}
                      onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field w-full"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest flex items-center gap-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={teacherForm.email}
                      onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field w-full"
                      placeholder="john@school.com"
                    />
                  </div>
                </div>

                {/* Level Selection */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest flex items-center gap-1">
                    Select Level(s) ✅ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-6 bg-aquire-grey-light rounded-2xl border border-aquire-border">
                    {levels.map(level => {
                      const isSelected = teacherForm.levelIds.includes(level.id);
                      return (
                        <button
                          key={level.id}
                          onClick={() => {
                            if (isSelected) {
                              setTeacherForm(prev => ({ ...prev, levelIds: prev.levelIds.filter(id => id !== level.id) }));
                            } else {
                              setTeacherForm(prev => ({ ...prev, levelIds: [...prev.levelIds, level.id] }));
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                            isSelected 
                              ? "bg-aquire-primary text-white border-aquire-primary shadow-lg shadow-aquire-primary/20" 
                              : "bg-white text-aquire-grey-med border-aquire-border hover:border-aquire-primary hover:text-aquire-primary"
                          }`}
                        >
                          {level.name}
                          {isSelected && <X size={14} className="hover:scale-125 transition-transform" />}
                        </button>
                      );
                    })}
                  </div>
                  {teacherForm.levelIds.length === 0 && (
                    <p className="text-xs text-red-500 font-bold">Please select at least one level.</p>
                  )}
                </div>

                {/* Student Assignment Section */}
                <div className="pt-8 border-t border-aquire-border space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-aquire-black">Assign Students</h3>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4" />
                      <input 
                        type="text" 
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        placeholder="Search students..." 
                        className="w-full pl-10 pr-4 py-2 bg-aquire-grey-light border border-aquire-border rounded-xl text-sm focus:border-aquire-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {isFetchingStudents ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-10 h-10 text-aquire-primary animate-spin" />
                      <p className="text-sm font-bold text-aquire-grey-med">Fetching students for selected levels...</p>
                    </div>
                  ) : teacherForm.levelIds.length > 0 ? (
                    <div className="space-y-6">
                      {teacherForm.levelIds.map(levelId => {
                        const level = levels.find(l => l.id === levelId);
                        const levelStudents = studentsByLevel[levelId] || [];
                        const allSelected = levelStudents.length > 0 && levelStudents.every(s => teacherForm.assignedStudentIds.includes(s.id));

                        return (
                          <div key={levelId} className="space-y-3">
                            <div className="flex items-center justify-between px-2">
                              <h4 className="font-bold text-aquire-grey-dark flex items-center gap-2">
                                <span className="w-2 h-2 bg-aquire-primary rounded-full" />
                                {level?.name} ({levelStudents.length} students)
                              </h4>
                              {levelStudents.length > 0 && (
                                <button
                                  onClick={() => {
                                    if (allSelected) {
                                      setTeacherForm(prev => ({
                                        ...prev,
                                        assignedStudentIds: prev.assignedStudentIds.filter(id => !levelStudents.some(s => s.id === id))
                                      }));
                                    } else {
                                      const newIds = [...new Set([...teacherForm.assignedStudentIds, ...levelStudents.map(s => s.id)])];
                                      setTeacherForm(prev => ({ ...prev, assignedStudentIds: newIds }));
                                    }
                                  }}
                                  className="text-xs font-black text-aquire-primary uppercase tracking-widest hover:underline"
                                >
                                  {allSelected ? "Deselect All" : "Select All"}
                                </button>
                              )}
                            </div>
                            
                            <div className="card overflow-hidden border-aquire-border/50">
                              <table className="w-full text-left text-sm">
                                <thead className="bg-aquire-grey-light/50 border-b border-aquire-border">
                                  <tr>
                                    <th className="px-6 py-3 w-10">
                                      <input 
                                        type="checkbox" 
                                        checked={allSelected}
                                        onChange={() => {}} // Handled by button above
                                        className="rounded border-aquire-border text-aquire-primary pointer-events-none"
                                      />
                                    </th>
                                    <th className="px-6 py-3 font-bold text-aquire-grey-med">Name</th>
                                    <th className="px-6 py-3 font-bold text-aquire-grey-med">Email</th>
                                    <th className="px-6 py-3 font-bold text-aquire-grey-med">Assigned To</th>
                                    <th className="px-6 py-3 font-bold text-aquire-grey-med">Progress</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-aquire-border">
                                  {levelStudents.map(student => {
                                    const studentTeacher = teachers.find(t => t.id === student.teacher_id);
                                    return (
                                      <tr 
                                        key={student.id} 
                                        className="hover:bg-aquire-grey-light/30 cursor-pointer transition-colors"
                                        onClick={() => {
                                          const isSelected = teacherForm.assignedStudentIds.includes(student.id);
                                          if (isSelected) {
                                            setTeacherForm(prev => ({ ...prev, assignedStudentIds: prev.assignedStudentIds.filter(id => id !== student.id) }));
                                          } else {
                                            setTeacherForm(prev => ({ ...prev, assignedStudentIds: [...prev.assignedStudentIds, student.id] }));
                                          }
                                        }}
                                      >
                                        <td className="px-6 py-4">
                                          <input 
                                            type="checkbox" 
                                            checked={teacherForm.assignedStudentIds.includes(student.id)}
                                            onChange={() => {}} // Handled by row click
                                            className="rounded border-aquire-border text-aquire-primary pointer-events-none"
                                          />
                                        </td>
                                        <td className="px-6 py-4 font-bold text-aquire-black">{student.name}</td>
                                        <td className="px-6 py-4 text-aquire-grey-med">{student.email}</td>
                                        <td className="px-6 py-4">
                                          {studentTeacher ? (
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${studentTeacher.id === editingTeacher?.id ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                              {studentTeacher.name}
                                            </span>
                                          ) : (
                                            <span className="text-[10px] font-bold text-aquire-grey-med italic">Unassigned</span>
                                          )}
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-aquire-grey-light rounded-full overflow-hidden">
                                              <div 
                                                className="h-full bg-emerald-500" 
                                                style={{ width: `${student.progress || 0}%` }}
                                              />
                                            </div>
                                            <span className="text-[10px] font-bold text-aquire-grey-med">{student.progress || 0}%</span>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  {levelStudents.length === 0 && (
                                    <tr>
                                      <td colSpan={5} className="px-6 py-8 text-center text-aquire-grey-med italic">
                                        No students found matching your search in this level.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="card p-12 bg-aquire-grey-light/30 border-dashed border-2 border-aquire-border flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Users className="text-aquire-grey-med" size={32} />
                      </div>
                      <div>
                        <h4 className="font-bold text-aquire-black">No Levels Selected</h4>
                        <p className="text-sm text-aquire-grey-med max-w-xs mx-auto">Select at least one level above to see and assign students.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Permissions Section */}
              <div className="card p-8 space-y-6">
                <h3 className="text-lg font-bold text-aquire-black border-b border-aquire-border pb-4 flex items-center gap-2">
                  <Shield size={20} className="text-aquire-primary" />
                  Teacher Permissions
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest mb-3">Academic Access</p>
                    <div className="space-y-2">
                      {[
                        { id: 'learning_paths', label: 'Learning Paths' },
                        { id: 'skill_based', label: 'Skill-Based Content' },
                        { id: 'assessments', label: 'Assessments' }
                      ].map(perm => (
                        <label key={perm.id} className="flex items-center justify-between p-3 bg-aquire-grey-light rounded-xl cursor-pointer hover:bg-aquire-grey-light/80 transition-all">
                          <span className="text-sm font-bold text-aquire-grey-dark">{perm.label}</span>
                          <div 
                            onClick={() => setTeacherForm(prev => ({
                              ...prev,
                              permissions: { ...prev.permissions, [perm.id]: !prev.permissions[perm.id as keyof TeacherPermissions] }
                            }))}
                            className={`w-10 h-5 rounded-full transition-all relative ${teacherForm.permissions[perm.id as keyof TeacherPermissions] ? 'bg-emerald-500' : 'bg-aquire-grey-med'}`}
                          >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${teacherForm.permissions[perm.id as keyof TeacherPermissions] ? 'right-1' : 'left-1'}`} />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest mb-3">Content Creation</p>
                    <div className="space-y-2">
                      {[
                        { id: 'create_learning_paths', label: 'Create Learning Paths' },
                        { id: 'create_skill_based', label: 'Create Skill-Based Content' }
                      ].map(perm => (
                        <label key={perm.id} className="flex items-center justify-between p-3 bg-aquire-grey-light rounded-xl cursor-pointer hover:bg-aquire-grey-light/80 transition-all">
                          <span className="text-sm font-bold text-aquire-grey-dark">{perm.label}</span>
                          <div 
                            onClick={() => setTeacherForm(prev => ({
                              ...prev,
                              permissions: { ...prev.permissions, [perm.id]: !prev.permissions[perm.id as keyof TeacherPermissions] }
                            }))}
                            className={`w-10 h-5 rounded-full transition-all relative ${teacherForm.permissions[perm.id as keyof TeacherPermissions] ? 'bg-emerald-500' : 'bg-aquire-grey-med'}`}
                          >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${teacherForm.permissions[perm.id as keyof TeacherPermissions] ? 'right-1' : 'left-1'}`} />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest mb-3">Student Management</p>
                    <div className="space-y-2">
                      {[
                        { id: 'invite_students', label: 'Invite/Add Students' }
                      ].map(perm => (
                        <label key={perm.id} className="flex items-center justify-between p-3 bg-aquire-grey-light rounded-xl cursor-pointer hover:bg-aquire-grey-light/80 transition-all">
                          <span className="text-sm font-bold text-aquire-grey-dark">{perm.label}</span>
                          <div 
                            onClick={() => setTeacherForm(prev => ({
                              ...prev,
                              permissions: { ...prev.permissions, [perm.id]: !prev.permissions[perm.id as keyof TeacherPermissions] }
                            }))}
                            className={`w-10 h-5 rounded-full transition-all relative ${teacherForm.permissions[perm.id as keyof TeacherPermissions] ? 'bg-emerald-500' : 'bg-aquire-grey-med'}`}
                          >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${teacherForm.permissions[perm.id as keyof TeacherPermissions] ? 'right-1' : 'left-1'}`} />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card p-8 space-y-4 sticky top-6">
                <button 
                  onClick={handleSaveTeacher}
                  disabled={teacherForm.levelIds.length === 0}
                  className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    teacherForm.levelIds.length > 0 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20" 
                      : "bg-aquire-grey-light text-aquire-grey-med cursor-not-allowed"
                  }`}
                >
                  <Plus size={20} />
                  {editingTeacher ? "Save Changes" : "Assign to Teacher"}
                </button>
                <button 
                  onClick={() => {
                    setIsTeacherModalOpen(false);
                    setEditingTeacher(null);
                  }}
                  className="w-full py-4 px-6 border border-aquire-border rounded-2xl font-bold text-aquire-grey-med hover:bg-aquire-grey-light transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Organization</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Teachers</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Teacher Management</h2>
            <p className="text-aquire-grey-med">Invite and manage your teaching staff.</p>
          </div>
          <button 
            onClick={() => {
              setEditingTeacher(null);
              setTeacherForm({
                name: "",
                email: "",
                levelIds: [],
                assignedStudentIds: [],
                permissions: {
                  learning_paths: true,
                  skill_based: true,
                  assessments: true,
                  create_learning_paths: true,
                  create_skill_based: true,
                  invite_students: true
                }
              });
              setIsTeacherModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={20} />
            Add Teacher
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teachers by name or email..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-aquire-grey-light/50 border-b border-aquire-border">
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Teacher</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Levels</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Assigned Students</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aquire-border">
                {filteredTeachers.map((teacher) => {
                  const teacherAssignedStudents = students.filter(s => s.teacher_id === teacher.id);
                  return (
                    <tr key={teacher.id} className="hover:bg-aquire-grey-light/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-aquire-primary/10 flex items-center justify-center border border-aquire-primary/20 overflow-hidden">
                            {teacher.profile_pic ? (
                              <img src={teacher.profile_pic} alt={teacher.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-aquire-primary font-bold">{teacher.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-aquire-black">{teacher.name}</p>
                            <p className="text-xs text-aquire-grey-med">{teacher.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.levelIds?.map(lId => (
                            <span key={lId} className="px-2 py-0.5 bg-aquire-primary/10 text-aquire-primary text-[8px] font-black rounded-md uppercase tracking-wider">
                              {levels.find(l => l.id === lId)?.name || "N/A"}
                            </span>
                          ))}
                          {(!teacher.levelIds || teacher.levelIds.length === 0) && (
                            <span className="text-xs text-aquire-grey-med italic">No levels</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {teacherAssignedStudents.slice(0, 2).map(s => (
                            <span key={s.id} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider" title={s.name}>
                              {s.name.split(' ')[0]}
                            </span>
                          ))}
                          {teacherAssignedStudents.length > 2 && (
                            <span className="px-2 py-0.5 bg-aquire-grey-light text-aquire-grey-med text-[8px] font-black rounded-md uppercase tracking-wider" title={teacherAssignedStudents.slice(2).map(s => s.name).join(', ')}>
                              +{teacherAssignedStudents.length - 2} others
                            </span>
                          )}
                          {teacherAssignedStudents.length === 0 && (
                            <span className="text-xs text-aquire-grey-med italic">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          teacher.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                          teacher.status === 'inactive' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setTeacherForm({ 
                                name: teacher.name, 
                                email: teacher.email, 
                                levelIds: teacher.levelIds || [],
                                assignedStudentIds: students.filter(s => s.teacher_id === teacher.id).map(s => s.id),
                                permissions: teacher.permissions || {
                                  learning_paths: false,
                                  skill_based: false,
                                  assessments: true,
                                  create_learning_paths: false,
                                  create_skill_based: false,
                                  invite_students: false
                                }
                              });
                              setIsTeacherModalOpen(true);
                            }}
                            className="p-2 hover:bg-aquire-primary/10 text-aquire-primary rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          {teacher.status === 'active' && (
                            <button 
                              onClick={() => handleImpersonate(teacher)}
                              className="p-2 hover:bg-aquire-primary/10 text-aquire-primary rounded-lg transition-all"
                              title="Login As"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => toggleTeacherStatus(teacher.id)}
                            className={`p-2 rounded-lg transition-all ${
                              teacher.status === 'active' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'
                            }`}
                            title={teacher.status === 'active' ? "Deactivate" : "Activate"}
                          >
                            <RefreshCw size={18} />
                          </button>
                          <button 
                            onClick={() => deleteTeacher(teacher.id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTeachers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-aquire-grey-med">
                      No teachers found. Invite your first teacher to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStudents = () => {
    const filteredStudents = students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-xs font-bold uppercase tracking-widest mb-1">
              <span>Organization</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">Students</span>
            </div>
            <h2 className="text-3xl font-bold text-aquire-black">Student Management</h2>
            <p className="text-aquire-grey-med">Manage student accounts, levels, and invitations.</p>
          </div>
          <button 
            onClick={() => {
              setStudentForm({ name: "", email: "", level_id: "" });
              setIsStudentModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={20} />
            Add New Student
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name or email..." 
              className="w-full pl-12 pr-4 py-4 input-field"
            />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-aquire-grey-light/50 border-b border-aquire-border">
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Level</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Assigned Teacher</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-xs font-black text-aquire-grey-dark uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aquire-border">
                {filteredStudents.map((student) => {
                  const assignedTeacher = teachers.find(t => t.id === student.teacher_id);
                  return (
                    <tr key={student.id} className="hover:bg-aquire-grey-light/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-aquire-primary/10 flex items-center justify-center border border-aquire-primary/20 overflow-hidden">
                            {student.profile_pic ? (
                              <img src={student.profile_pic} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-aquire-primary font-bold">{student.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-aquire-black">{student.name}</p>
                            <p className="text-xs text-aquire-grey-med">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                          {levels.find(l => l.id === student.level_id)?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {assignedTeacher ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-aquire-primary/10 flex items-center justify-center border border-aquire-primary/20 overflow-hidden">
                              {assignedTeacher.profile_pic ? (
                                <img src={assignedTeacher.profile_pic} alt={assignedTeacher.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-aquire-primary text-[10px] font-bold">{assignedTeacher.name.charAt(0)}</span>
                              )}
                            </div>
                            <span className="text-sm font-bold text-aquire-black">{assignedTeacher.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-aquire-grey-med italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          student.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                          student.status === 'inactive' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                    <td className="px-6 py-4 text-sm text-aquire-grey-med">
                      {new Date(student.joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingStudent(student);
                            setStudentForm({ name: student.name, email: student.email, level_id: student.level_id, teacher_id: student.teacher_id || "" });
                            setIsStudentModalOpen(true);
                          }}
                          className="p-2 hover:bg-aquire-primary/10 text-aquire-primary rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        {student.status === 'active' && (
                          <button 
                            onClick={() => handleImpersonateStudent(student)}
                            className="p-2 hover:bg-aquire-primary/10 text-aquire-primary rounded-lg transition-all"
                            title="Login As Student"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => toggleStudentStatus(student.id)}
                          className={`p-2 rounded-lg transition-all ${
                            student.status === 'active' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'
                          }`}
                          title={student.status === 'active' ? "Deactivate" : "Activate"}
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button 
                          onClick={() => deleteStudent(student.id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-aquire-grey-med">
                      No students found. Add your first student to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Student Modal */}
        <AnimatePresence>
          {isStudentModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsStudentModalOpen(false)}
                className="absolute inset-0 bg-aquire-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative z-10"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-aquire-black">{editingStudent ? "Edit Student" : "Add New Student"}</h3>
                      <p className="text-aquire-grey-med text-sm">{editingStudent ? "Update student profile and level." : "Send an invitation to join Aquire Academy."}</p>
                    </div>
                    <button 
                      onClick={() => setIsStudentModalOpen(false)}
                      className="p-2 hover:bg-aquire-grey-light rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        value={studentForm.name}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field w-full"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        value={studentForm.email}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                        className="input-field w-full"
                        placeholder="rahul@school.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Level</label>
                      <select 
                        value={studentForm.level_id}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, level_id: e.target.value }))}
                        className="input-field w-full"
                      >
                        <option value="">Select Level</option>
                        {levels.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-aquire-grey-dark uppercase tracking-widest">Assign to Teacher</label>
                      <select 
                        value={studentForm.teacher_id}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, teacher_id: e.target.value }))}
                        className="input-field w-full"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button 
                      onClick={() => setIsStudentModalOpen(false)}
                      className="flex-1 py-4 px-6 border border-aquire-border rounded-2xl font-bold text-aquire-grey-med hover:bg-aquire-grey-light transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveStudent}
                      className="flex-1 py-4 px-6 bg-aquire-primary text-white rounded-2xl font-bold shadow-lg shadow-aquire-primary/20 hover:bg-aquire-primary-hover transition-all"
                    >
                      {editingStudent ? "Save Changes" : "Send Invitation"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="mt-8 pt-8 border-t border-aquire-border flex items-center justify-between">
        <p className="text-aquire-grey-med text-xs font-bold uppercase tracking-widest">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, currentItems.length)} of {currentItems.length}
        </p>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  currentPage === page 
                    ? "bg-aquire-primary text-white shadow-lg shadow-aquire-primary/20" 
                    : "bg-white border border-aquire-border text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-grey-light"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-3 bg-white border border-aquire-border rounded-xl text-aquire-grey-med hover:text-aquire-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const formatTabName = (tab: string) => {
    if (tab === "dashboard") return "Dashboard Overview";
    if (tab === "skills") return "Skill-Based Lessons";
    if (tab === "curriculum") return "Curriculum Builder";
    return tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-aquire-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-aquire-primary/20">
        <LayoutDashboard className="text-aquire-primary w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-aquire-black mb-2">{formatTabName(activeTab)} Section</h2>
      <p className="text-aquire-grey-med max-w-sm">This section is currently under development. Please check back later for updates.</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-aquire-black tracking-tight">
          {formatTabName(activeTab)}
        </h1>
        <p className="text-aquire-grey-med mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </header>

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "curriculum" && renderCurriculum()}
      {activeTab === "skills" && renderSkills()}
      {activeTab === "learning-paths" && renderLearningPaths()}
      {activeTab === "assessments" && renderAssessments()}
      {activeTab === "manage-school" && renderOrganization()}
      {activeTab === "teachers" && renderTeachers()}
      {activeTab === "students" && renderStudents()}
      {activeTab !== "dashboard" && activeTab !== "curriculum" && activeTab !== "skills" && activeTab !== "learning-paths" && activeTab !== "assessments" && activeTab !== "manage-school" && activeTab !== "teachers" && activeTab !== "students" && renderPlaceholder()}

      {/* Modals */}
      <ModuleModal 
        isOpen={isModuleModalOpen}
        onClose={() => {
          setIsModuleModalOpen(false);
          setEditingModule(null);
        }}
        onSave={handleSaveModule}
        editingModule={editingModule}
        levels={levels}
      />

      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setEditingLesson(null);
        }}
        onSave={handleSaveLesson}
        editingLesson={editingLesson}
        modules={modules}
        learningPaths={learningPaths}
        levels={levels}
      />

      <ChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => {
          setIsChapterModalOpen(false);
          setEditingChapter(null);
        }}
        onSave={handleSaveChapter}
        editingChapter={editingChapter}
      />

      <LearningPathModal
        isOpen={isLearningPathModalOpen}
        onClose={() => {
          setIsLearningPathModalOpen(false);
          setEditingPath(null);
        }}
        onSave={handleSaveLearningPath}
        editingPath={editingPath}
        modules={modules}
        lessons={lessons}
        levels={levels}
      />

      <QuestionBankModal
        isOpen={isQuestionBankModalOpen}
        onClose={() => {
          setIsQuestionBankModalOpen(false);
          setEditingBank(null);
        }}
        onSave={handleSaveQuestionBank}
        editingBank={editingBank}
        availableLevels={levels}
      />

      {isPathPreviewOpen && previewPath && (
        isPreviewZigZag ? (
          <LearningPathZigZagPreview 
            path={previewPath}
            lessons={lessons}
            onClose={() => {
              setIsPathPreviewOpen(false);
              setPreviewPath(null);
            }}
          />
        ) : (
          <LearningPathPreview 
            path={previewPath}
            lessons={lessons}
            onClose={() => {
              setIsPathPreviewOpen(false);
              setPreviewPath(null);
            }}
          />
        )
      )}

      {isBankPreviewOpen && previewBank && (
        <QuestionBankPreview
          bank={previewBank}
          onClose={() => {
            setIsBankPreviewOpen(false);
            setPreviewBank(null);
          }}
        />
      )}

      <SkillLessonModal
        isOpen={isSkillLessonModalOpen}
        onClose={() => setIsSkillLessonModalOpen(false)}
        onSave={handleSaveSkillLesson}
        modules={modules}
        lessons={lessons}
        learningPaths={learningPaths}
        levels={levels}
      />

      <CurriculumWizard 
        isOpen={isCurriculumWizardOpen}
        onClose={() => setIsCurriculumWizardOpen(false)}
        onSave={handleSaveCurriculum}
        levels={levels}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={itemToDelete?.id || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
