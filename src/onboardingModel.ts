import { AppState, GoalKey, Habit, goalCopy } from './content';

/* ------------------------------------------------------------------ *
 * Answer shape
 * ------------------------------------------------------------------ */

export type AnchorKey = 'morning' | 'midday' | 'evening';
export type EffortKey = 'tiny' | 'steady' | 'full';

export type Answers = {
  goal: GoalKey;
  motivations: string[];
  obstacles: string[];
  sleep: number; // index into sleepBands
  active: number; // index into activeBands
  stress: number; // index into stressBands
  anchor: AnchorKey;
  effort: EffortKey;
  name: string;
  reminder: string; // '' means reminders are off
  committed: boolean;
};

export const emptyAnswers: Answers = {
  goal: 'energy',
  motivations: [],
  obstacles: [],
  sleep: 2,
  active: 1,
  stress: 1,
  anchor: 'morning',
  effort: 'steady',
  name: '',
  reminder: '7:30 AM',
  committed: false,
};

/* ------------------------------------------------------------------ *
 * Question content
 * ------------------------------------------------------------------ */

export type Option = { key: string; label: string; hint?: string; icon?: string };

export const motivationOptions: Option[] = [
  { key: 'family', icon: '◇', label: 'Keep up with people I love', hint: 'Kids, partner, friends, parents' },
  { key: 'afternoon', icon: '↗', label: 'Stop crashing mid-afternoon', hint: 'Steadier energy through the day' },
  { key: 'confidence', icon: '✦', label: 'Feel at home in my body', hint: 'Strength and confidence, not a number' },
  { key: 'checkup', icon: '✚', label: 'A checkup got my attention', hint: 'Something I want to stay ahead of' },
  { key: 'longevity', icon: '∞', label: 'Be around for the long haul', hint: 'Playing a decades-long game' },
  { key: 'pressure', icon: '≈', label: 'Carry stress better', hint: 'Less running on empty' },
];

export const obstacleOptions: Option[] = [
  { key: 'time', icon: '◷', label: 'There is never enough time', hint: 'The day fills up before I get to me' },
  { key: 'restart', icon: '↺', label: 'I start strong, then stop', hint: 'Week two is where it fades' },
  { key: 'evening', icon: '◐', label: 'I am wiped out by evening', hint: 'Nothing left after work' },
  { key: 'sleep', icon: '☾', label: 'Short sleep drags everything', hint: 'Hard to begin when rest is thin' },
  { key: 'stress', icon: '⚡', label: 'Stress runs my schedule', hint: 'Plans lose to whatever is urgent' },
  { key: 'start', icon: '?', label: 'I do not know where to start', hint: 'Too much conflicting advice' },
];

export const sleepBands: Option[] = [
  { key: 's1', label: 'Under 5 hours', hint: 'That is a real deficit to work around' },
  { key: 's2', label: '5 to 6 hours', hint: 'Below what most adults need' },
  { key: 's3', label: '6 to 7 hours', hint: 'Close, and often a little short' },
  { key: 's4', label: '7 to 8 hours', hint: 'Inside the usual healthy range' },
  { key: 's5', label: 'More than 8 hours', hint: 'Plenty of time in bed' },
];

export const activeBands: Option[] = [
  { key: 'a1', label: 'Rarely', hint: 'Movement is not in the week yet' },
  { key: 'a2', label: '1 to 2 days', hint: 'It happens when it happens' },
  { key: 'a3', label: '3 to 4 days', hint: 'A rhythm is already forming' },
  { key: 'a4', label: '5 or more days', hint: 'Movement is part of who you are' },
];

export const stressBands: Option[] = [
  { key: 't1', label: 'Mostly calm', hint: 'Stress passes through' },
  { key: 't2', label: 'Manageable', hint: 'Busy, but steady' },
  { key: 't3', label: 'Often stretched', hint: 'The weeks run hot' },
  { key: 't4', label: 'Near my limit', hint: 'Not much slack anywhere' },
];

export const anchorOptions: Array<Option & { key: AnchorKey }> = [
  { key: 'morning', icon: '☀', label: 'Morning', hint: 'Before the day starts making demands' },
  { key: 'midday', icon: '◑', label: 'Midday', hint: 'A break that resets the afternoon' },
  { key: 'evening', icon: '☾', label: 'Evening', hint: 'Once the day has wound down' },
];

export const effortOptions: Array<Option & { key: EffortKey }> = [
  { key: 'tiny', label: 'About 5 minutes', hint: 'Small enough that a bad day cannot break it', icon: '·' },
  { key: 'steady', label: 'About 15 minutes', hint: 'Enough to feel like something real', icon: '◦' },
  { key: 'full', label: 'About 30 minutes', hint: 'I have the room and I want the full version', icon: '○' },
];

export const effortMinutes: Record<EffortKey, number> = { tiny: 5, steady: 15, full: 30 };

export const reminderOptions = ['6:30 AM', '7:30 AM', '12:30 PM', '6:00 PM', '9:00 PM'];

/** The reminder time we pre-select, based on the window the user said they control. */
export const defaultReminderFor: Record<AnchorKey, string> = {
  morning: '7:30 AM',
  midday: '12:30 PM',
  evening: '9:00 PM',
};

export const anchorLabel: Record<AnchorKey, string> = {
  morning: 'Morning',
  midday: 'Midday',
  evening: 'Evening',
};

/* ------------------------------------------------------------------ *
 * Derived plan
 * ------------------------------------------------------------------ */

export type Projection = { week: string; value: number }[];

export type Plan = {
  headline: string;
  habits: Habit[];
  readiness: number;
  readinessLabel: string;
  strengths: string[];
  focusNote: string;
  obstaclePlan: { obstacle: string; answer: string }[];
  projection: Projection;
  minutes: number;
  targetDate: string;
};

const obstacleAnswers: Record<string, { obstacle: string; answer: string }> = {
  time: {
    obstacle: 'There is never enough time',
    answer: 'Your plan lives in one short window you already control. Nothing here asks you to rebuild your schedule.',
  },
  restart: {
    obstacle: 'You start strong, then stop',
    answer: 'Week two is where most plans break, so yours never escalates. The same three actions, all month.',
  },
  evening: {
    obstacle: 'You are wiped out by evening',
    answer: 'Nothing demanding lands after dinner. Your evening is a two-minute close, not a workout.',
  },
  sleep: {
    obstacle: 'Short sleep drags everything',
    answer: 'A wind-down cue comes first, because rest is what makes every other habit cheaper to keep.',
  },
  stress: {
    obstacle: 'Stress runs your schedule',
    answer: 'One 60-second reset is always available, so a hard day can still end as a kept day.',
  },
  start: {
    obstacle: 'You do not know where to start',
    answer: 'You get exactly three actions. No menu, no research, no decisions to make at 7am.',
  },
};

const scaledFocus: Record<GoalKey, Record<EffortKey, string>> = {
  energy: {
    tiny: 'Step outside for 5 minutes of daylight',
    steady: 'Take a 15-minute walk outdoors',
    full: 'Take a 30-minute walk outdoors',
  },
  sleep: {
    tiny: 'Dim the lights 5 minutes before bed',
    steady: 'Screen-free wind-down for 15 minutes',
    full: 'A full 30-minute wind-down routine',
  },
  strength: {
    tiny: 'One 5-minute bodyweight set',
    steady: 'A 15-minute strength session',
    full: 'A 30-minute strength session',
  },
  calm: {
    tiny: '5 minutes of slow breathing',
    steady: 'A 15-minute quiet reset',
    full: 'A 30-minute unhurried reset',
  },
  explore: {
    tiny: '5 minutes of movement you enjoy',
    steady: '15 minutes of movement you enjoy',
    full: '30 minutes of movement you enjoy',
  },
};

function focusHabit(answers: Answers): Habit {
  const minutes = effortMinutes[answers.effort];
  return {
    id: 'focus',
    title: scaledFocus[answers.goal][answers.effort],
    when: `${anchorLabel[answers.anchor]} · ${minutes} min`,
    why: goalCopy[answers.goal].why,
    done: false,
  };
}

function supportHabit(answers: Answers): Habit {
  if (answers.obstacles.includes('sleep') || answers.goal === 'sleep') {
    return {
      id: 'winddown',
      title: 'Set a wind-down alarm 30 minutes before bed',
      when: 'Evening · 1 min',
      why: 'A cue to stop the day is usually easier to keep than a rule about the bedtime itself.',
      done: false,
    };
  }
  if (answers.obstacles.includes('stress') || answers.goal === 'calm') {
    return {
      id: 'reset',
      title: 'One 60-second breathing reset',
      when: 'Anytime · 1 min',
      why: 'A short, repeatable pause you can take between meetings without rearranging your day.',
      done: false,
    };
  }
  if (answers.obstacles.includes('evening')) {
    return {
      id: 'fuel',
      title: 'Eat something with protein before 3pm',
      when: 'Midday · 5 min',
      why: 'Steadier fuel earlier is one common reason evenings feel less depleted.',
      done: false,
    };
  }
  return {
    id: 'water',
    title: 'Drink a full glass of water on waking',
    when: 'Morning · 1 min',
    why: 'A simple opening cue that makes the rest of the routine easier to remember.',
    done: false,
  };
}

const closingHabit: Habit = {
  id: 'reflect',
  title: 'Two-minute evening check-in',
  when: 'Evening · 2 min',
  why: 'Noticing one thing that went well makes the next day’s choice measurably easier.',
  done: false,
};

function formatTarget(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
}

export function buildPlan(answers: Answers): Plan {
  const minutes = effortMinutes[answers.effort];

  // A starting picture of what you already have, not a grade.
  const sleepScore = [4, 10, 16, 22, 18][answers.sleep] ?? 14;
  const activeScore = [4, 10, 17, 22][answers.active] ?? 12;
  const stressScore = [22, 17, 10, 5][answers.stress] ?? 12;
  const clarityScore = answers.motivations.length >= 2 ? 16 : answers.motivations.length === 1 ? 11 : 6;
  const commitScore = answers.committed ? 8 : 4;
  const readiness = Math.max(24, Math.min(96, sleepScore + activeScore + stressScore + clarityScore + commitScore));

  const readinessLabel =
    readiness >= 75 ? 'Strong base' : readiness >= 55 ? 'Solid start' : readiness >= 40 ? 'Room to grow' : 'Early days';

  const strengths: string[] = [];
  if (answers.sleep >= 3) strengths.push('Your sleep is already in a healthy range');
  if (answers.active >= 2) strengths.push('You move most weeks — that is the hard part');
  if (answers.stress <= 1) strengths.push('Stress is not running your schedule');
  if (answers.motivations.length >= 2) strengths.push('You named more than one reason this matters');
  if (answers.obstacles.length > 0) strengths.push('You named what gets in the way, instead of hoping');
  if (strengths.length === 0) strengths.push('You answered honestly — that is the actual start');

  const obstaclePlan = answers.obstacles
    .map((key) => obstacleAnswers[key])
    .filter((item): item is { obstacle: string; answer: string } => Boolean(item))
    .slice(0, 3);

  const growth = 6 + Math.round((100 - readiness) / 9);
  const at = (multiplier: number) => Math.min(97, readiness + Math.round(growth * multiplier));
  const projection: Projection = [
    { week: 'Now', value: readiness },
    { week: 'Wk 1', value: at(0.7) },
    { week: 'Wk 2', value: at(1.2) },
    { week: 'Wk 3', value: at(1.7) },
    { week: 'Wk 4', value: at(2.1) },
  ];

  return {
    headline: goalCopy[answers.goal].headline,
    habits: [focusHabit(answers), supportHabit(answers), closingHabit],
    readiness,
    readinessLabel,
    strengths: strengths.slice(0, 3),
    focusNote: `${anchorLabel[answers.anchor]}s, about ${minutes} minutes.`,
    obstaclePlan,
    projection,
    minutes,
    targetDate: formatTarget(28),
  };
}

/** A mid-quiz observation drawn from what the person has said so far. */
export function midQuizInsight(answers: Answers): { tag: string; title: string; body: string } {
  if (answers.obstacles.includes('restart')) {
    return {
      tag: 'WHAT WE HEARD',
      title: 'Starting is not your problem',
      body: 'You have started before. That means the fix is not more motivation — it is a plan small enough to survive a bad week. Yours will not grow on you in week two.',
    };
  }
  if (answers.obstacles.includes('time')) {
    return {
      tag: 'WHAT WE HEARD',
      title: 'Time is the real constraint',
      body: 'So we will not pretend otherwise. The rest of these questions are about finding one window you already own, rather than adding a new one.',
    };
  }
  if (answers.obstacles.includes('sleep')) {
    return {
      tag: 'WHAT WE HEARD',
      title: 'Sleep comes first for a reason',
      body: 'When rest is short, every other habit costs more. Your plan will start there rather than stacking on top of a deficit.',
    };
  }
  if (answers.motivations.includes('checkup')) {
    return {
      tag: 'WHAT WE HEARD',
      title: 'Thanks for sharing that',
      body: 'A checkup that gets your attention is a real reason to start, and it is a good one. Keep talking with your clinician — this plan sits alongside their advice, never in place of it.',
    };
  }
  return {
    tag: 'WHAT WE HEARD',
    title: 'Naming it out loud matters',
    body: 'Most people skip this part and jump straight to a routine. Writing down why it matters is what you come back to in week three, when the novelty is gone.',
  };
}

/* ------------------------------------------------------------------ *
 * App state
 * ------------------------------------------------------------------ */

/**
 * The Insights "pattern" card. Derived from the user's own answers so it cannot
 * contradict their plan (e.g. praising morning walks to someone on an evening
 * wind-down plan).
 */
export function patternInsight(answers: Answers): { title: string; body: string } {
  const anchorWord = anchorLabel[answers.anchor].toLowerCase();

  if (answers.goal === 'sleep') {
    return {
      title: 'Your wind-down is the lever',
      body: `A consistent ${anchorWord} cue before bed is what most people notice first. Treat steadier mornings as a clue, not a diagnosis.`,
    };
  }
  if (answers.goal === 'calm') {
    return {
      title: 'Short resets beat long ones',
      body: `A couple of slow minutes in your ${anchorWord} tends to do more than a rare long session. Notice how the hour after feels.`,
    };
  }
  if (answers.goal === 'strength') {
    return {
      title: 'Frequency is doing the work',
      body: `Showing up in the ${anchorWord} most days matters more than any single hard session. Consistency is the pattern to watch.`,
    };
  }
  if (answers.active <= 1) {
    return {
      title: 'Starting small is the pattern',
      body: `You told us movement is occasional right now, so your plan leans on one ${anchorWord} action. That is the thing to protect.`,
    };
  }
  return {
    title: `Your ${anchorWord}s are carrying this`,
    body: `You picked the ${anchorWord} because you already control it. Anchoring to a window you own is the strongest predictor of a habit lasting.`,
  };
}

export function createState(answers: Answers): AppState {
  const plan = buildPlan(answers);
  return {
    name: answers.name.trim() || 'Friend',
    goal: answers.goal,
    customHeadline: '',
    intentions: [],
    habits: plan.habits,
    mood: 3,
    reflection: '',
    startedAt: new Date().toISOString(),
    day: 1,
    answers,
    reminder: answers.reminder,
    committed: answers.committed,
    firstSessionDone: false,
  };
}

export const sampleAnswers: Answers = {
  goal: 'energy',
  motivations: ['afternoon', 'family'],
  obstacles: ['time', 'restart'],
  sleep: 2,
  active: 1,
  stress: 2,
  anchor: 'morning',
  effort: 'steady',
  name: 'Alex',
  reminder: '7:30 AM',
  committed: true,
};
