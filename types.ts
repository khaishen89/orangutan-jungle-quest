
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface FunFact {
  title: string;
  fact: string;
  emoji: string;
}

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  date: string;
  level: string;
}

export enum GameState {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  FACTS = 'FACTS',
  LEADERBOARD = 'LEADERBOARD',
  GAME_OVER = 'GAME_OVER'
}
