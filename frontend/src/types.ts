
export const Difficulty = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Player {
  id: string;
  socketId: string;
  name: string;
  score: number;
  isHost: boolean;
}

export interface QuizRoom {
  id: string;
  topic: string;
  difficulty: Difficulty;
  timePerQuestion: number;
  numQuestions: number;
  numOptions: number;
  questions: Question[];
  players: Player[];
  status: 'waiting' | 'active' | 'completed';
  currentQuestionIndex: number;
  timeLeft: number;
  createdAt: number;
  completedAt?: number;
}

export interface CreateQuizParams {
  topic: string;
  numQuestions: number;
  numOptions: number;
  difficulty: Difficulty;
  timePerQuestion: number;
}
