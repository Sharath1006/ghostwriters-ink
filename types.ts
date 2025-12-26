
export interface StoryState {
  image: string | null;
  analysis: {
    mood: string;
    setting: string;
    keyDetails: string[];
  } | null;
  openingParagraph: string | null;
  loading: boolean;
  error: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AnalysisResponse {
  mood: string;
  setting: string;
  keyDetails: string[];
  paragraph: string;
}
