
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

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
