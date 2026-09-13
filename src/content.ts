export type GoalKey = 'energy' | 'sleep' | 'strength' | 'calm';
export type Tab = 'Today' | 'Goals' | 'Insights' | 'You';
export type Overlay =
  | { kind: 'guide' }
  | { kind: 'habit'; index: number }
  | { kind: 'reflection' }
  | { kind: 'settings'; topic: string }
  | { kind: 'editHabits' }
  | { kind: 'details' };

export type Habit = {
  id: string;
  title: string;
  when: string;
  why: string;
  done: boolean;
};

export type Intention = {
  id: string;
  title: string;
  copy: string;
};

export type AppState = {
  name: string;
  goal: GoalKey;
  customHeadline: string;
  intentions: Intention[];
  habits: Habit[];
  mood: number;
  reflection: string;
  startedAt: string;
  day: number;
};

export const goals: Array<{ key: GoalKey; icon: string; title: string; copy: string }> = [
  { key: 'energy', icon: '↗', title: 'More energy', copy: 'Feel steady from morning to night' },
  { key: 'sleep', icon: '◒', title: 'Better sleep', copy: 'Build a calmer wind-down routine' },
  { key: 'strength', icon: '+', title: 'Feel stronger', copy: 'Move consistently and build confidence' },
  { key: 'calm', icon: '≈', title: 'Less stress', copy: 'Create more room to reset and breathe' },
];

export const goalCopy: Record<GoalKey, { headline: string; habit: string; when: string; why: string }> = {
  energy: {
    headline: 'Feel energized every day',
    habit: '10-minute morning walk',
    when: 'Morning · 10 min',
    why: 'A short walk after waking can help your body clock and daytime alertness.',
  },
  sleep: {
    headline: 'Wake up feeling restored',
    habit: 'Screen-free wind-down',
    when: 'Evening · 15 min',
    why: 'Dim light and fewer screens before bed can make it easier to settle.',
  },
  strength: {
    headline: 'Build everyday strength',
    habit: '20-minute strength session',
    when: 'Afternoon · 20 min',
    why: 'Regular, modest movement is often easier to keep than rare intense workouts.',
  },
  calm: {
    headline: 'Make calm your baseline',
    habit: '5-minute breathing reset',
    when: 'Anytime · 5 min',
    why: 'Slow breathing can give your nervous system a short, repeatable pause.',
  },
};

export const defaultHabits = (goal: GoalKey): Habit[] => [
  { id: 'focus', title: goalCopy[goal].habit, when: goalCopy[goal].when, why: goalCopy[goal].why, done: false },
  { id: 'water', title: 'Drink a full glass of water', when: 'Anytime · 1 min', why: 'A simple cue that helps you pause and start the day with care.', done: false },
  { id: 'reflect', title: 'Two-minute evening reflection', when: 'Evening · 2 min', why: 'Noticing one helpful choice can make the next one easier.', done: false },
];

export const guideSteps = [
  { step: '01', title: 'Get outdoor light early', body: 'A few minutes of outdoor light soon after waking can support daytime alertness and your sleep-wake rhythm.' },
  { step: '02', title: 'Keep the first action tiny', body: 'Ten minutes of walking, one glass of water, or two minutes of breathing counts. Consistency beats intensity here.' },
  { step: '03', title: 'Protect a wind-down window', body: 'Dimmer light and fewer stimulating screens in the last hour of the day can make rest feel more available.' },
  { step: '04', title: 'Notice, then adjust', body: 'If a habit does not fit, change the time or shrink it. The goal is a rhythm you can keep, not a perfect streak.' },
];

export const settingsCopy: Record<string, { title: string; body: string }> = {
  'Personal details': {
    title: 'Personal details',
    body: 'Your name stays on this device in this prototype. A later version can add accounts if you want sync across phones.',
  },
  'Reminders & routine': {
    title: 'Reminders & routine',
    body: 'This clickable template does not send notifications yet. The intended design is one gentle reminder for your first action, never medical alerts.',
  },
  'Privacy & data': {
    title: 'Privacy & data',
    body: 'Choices are stored locally on this device. There is no cloud account, no health-record upload, and no advertising profile in this prototype.',
  },
  'Health guidance preferences': {
    title: 'Health guidance preferences',
    body: 'Manifest Health shares general wellness education. It does not diagnose, treat, or replace care from a qualified professional.',
  },
  'Help & support': {
    title: 'Help & support',
    body: 'Use Replay onboarding to walk the template again. For real health questions, talk with a clinician who knows your history.',
  },
};

export function createState(name: string, goal: GoalKey): AppState {
  return {
    name,
    goal,
    customHeadline: '',
    intentions: [],
    habits: defaultHabits(goal),
    mood: 3,
    reflection: '',
    startedAt: new Date().toISOString(),
    day: 1,
  };
}

export function headlineFor(state: AppState): string {
  return state.customHeadline.trim() || goalCopy[state.goal].headline;
}
