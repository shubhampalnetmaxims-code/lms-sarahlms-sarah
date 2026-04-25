export interface ContentBlock {
  id: string;
  type: 'reading' | 'video' | 'short_answer' | 'mcq' | 'fill_blanks' | 'true_false' | 'drag_drop' | 'long_text';
  data: any;
}

export interface Chapter {
  id: string;
  name: string;
  content: string;
  blocks: ContentBlock[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  levelIds: string[];
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  levelId: string;
  name: string;
  description: string;
  successKPIs?: string[];
  learningIntentions?: string[];
  successCriteria?: string[];
  thumbnail: string;
  chapters: Chapter[];
  createdAt: string;
  isSkillLesson?: boolean;
  learningPathId?: string;
  starNumber?: number;
  assignedStudentIds?: string[];
  rewardStars?: number;
}

export interface PathStarData {
  star: number;
  mainLessonId: string | null;
  skillLessonIds: string[];
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  levelIds: string[];
  stars: number;
  starLessons: (string | null)[];
  starsData?: PathStarData[];
  createdAt: string;
}

export interface QuestionBankItem {
  id: string;
  type: 'mcq' | 'true_false' | 'fill_blanks' | 'short_answer' | 'long_text' | 'section';
  question: string;
  description?: string;
  options?: any[];
  correctAnswer?: any;
  answers?: string[];
  expectedAnswer?: string;
  keywords?: string;
  marks: number;
  required: boolean;
  image?: string;
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  levelIds: string[];
  questions: QuestionBankItem[];
  createdAt: string;
}

export interface Organization {
  name: string;
  logo: string;
  address: string;
  email: string;
  phone: string;
  updated: string;
}

export interface TeacherPermissions {
  learning_paths: boolean;
  skill_based: boolean;
  assessments: boolean;
  create_learning_paths: boolean;
  create_skill_based: boolean;
  invite_students: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
  profile_pic?: string;
  invitation_token?: string;
  token_expires?: string;
  password_hash?: string;
  levelIds: string[];
  permissions: TeacherPermissions;
}

export interface Invitation {
  token: string;
  email: string;
  name: string;
  expires: string;
  used: boolean;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  level_id: string;
  teacher_id?: string;
  profile_pic?: string;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
  invitation_token?: string;
  token_expires?: string;
  password_hash?: string;
  progress?: number;
}
