import type { Answers } from './onboardingModel';

export type GoalKey = 'energy' | 'sleep' | 'strength' | 'calm' | 'explore';
export type Tab = 'Today' | 'Goals' | 'Insights' | 'You';
export type Overlay =
  | { kind: 'guide' }
  | { kind: 'habit'; index: number }
  | { kind: 'reflection' }
  | { kind: 'settings'; topic: string }
  | { kind: 'editHabits' }
  | { kind: 'plan' }
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
  /** Everything the onboarding learned, kept so the app can stay personal. */
  answers: Answers;
  reminder: string;
  committed: boolean;
  firstSessionDone: boolean;
};

export const goals: Array<{ key: GoalKey; icon: string; title: string; copy: string }> = [
  { key: 'energy', icon: '↗', title: 'More energy', copy: 'Feel steady from morning to night' },
  { key: 'sleep', icon: '◒', title: 'Better sleep', copy: 'Build a calmer wind-down routine' },
  { key: 'strength', icon: '+', title: 'Feel stronger', copy: 'Move consistently and build confidence' },
  { key: 'calm', icon: '≈', title: 'Less stress', copy: 'Create more room to reset and breathe' },
  { key: 'explore', icon: '?', title: 'Still figuring it out', copy: 'Start somewhere small and find out' },
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
  explore: {
    headline: 'Find what actually helps you',
    habit: 'One small thing, noticed',
    when: 'Anytime · 10 min',
    why: 'Starting broad is fine. Repetition teaches you more than picking the perfect first thing.',
  },
};

export const guideSteps = [
  { step: '01', title: 'Get outdoor light early', body: 'A few minutes of outdoor light soon after waking can support daytime alertness and your sleep-wake rhythm.' },
  { step: '02', title: 'Keep the first action tiny', body: 'Ten minutes of walking, one glass of water, or two minutes of breathing counts. Consistency beats intensity here.' },
  { step: '03', title: 'Protect a wind-down window', body: 'Dimmer light and fewer stimulating screens in the last hour of the day can make rest feel more available.' },
  { step: '04', title: 'Notice, then adjust', body: 'If a habit does not fit, change the time or shrink it. The goal is a rhythm you can keep, not a perfect streak.' },
];

export const settingsCopy: Record<string, { title: string; body: string }> = {
  'Personal details': {
    title: 'Personal details',
    body: 'Your name and answers stay on this device in this prototype. A later version can add accounts if you want sync across phones.',
  },
  'Reminders & routine': {
    title: 'Reminders & routine',
    body: 'You chose your reminder during onboarding, and you can turn it off at any time. The intended design is one gentle nudge for your first action — never medical alerts, never a guilt trip for a missed day.',
  },
  'Privacy & data': {
    title: 'Privacy & data',
    body: 'Choices are stored locally on this device. There is no cloud account, no health-record upload, and no advertising profile. Health answers are never shared with third parties for marketing or data mining.',
  },
  'Health guidance preferences': {
    title: 'Health guidance preferences',
    body: 'Manifest Health shares general wellness education. It does not diagnose, treat, or replace care from a qualified professional. Plans are capped at gentle, non-restrictive targets on purpose.',
  },
  'Help & support': {
    title: 'Help & support',
    body: 'Use Replay onboarding to walk the flow again. For real health questions, talk with a clinician who knows your history.',
  },
};

export function headlineFor(state: AppState): string {
  return state.customHeadline.trim() || goalCopy[state.goal].headline;
}
