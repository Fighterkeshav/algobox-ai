export interface AlgoStep {
  index: number;
  type: string;
  state: Record<string, any>;
  description: string;
}

export interface AlgoRun {
  id: string;
  algorithmId: string;
  steps: AlgoStep[];
  completed: boolean;
  createdAt: string;
}

export interface VisualAlgorithm {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  defaultInput: Record<string, any>;
}

export interface TimelineState {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
}

export interface VisualRendererProps {
  step: AlgoStep;
  algorithm: string;
}

export interface TimelineControllerProps {
  steps: AlgoStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}