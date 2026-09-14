import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from './Button';
import { goals } from './content';
import {
  activeBands,
  anchorLabel,
  anchorOptions,
  defaultReminderFor,
  AnchorKey,
  Answers,
  buildPlan,
  effortMinutes,
  effortOptions,
  EffortKey,
  emptyAnswers,
  midQuizInsight,
  motivationOptions,
  obstacleOptions,
  reminderOptions,
  sleepBands,
  stressBands,
} from './onboardingModel';
import {
  Analyzing,
  BreathSession,
  ChipRow,
  GridPicker,
  HoldToCommit,
  OptionRow,
  ProgressTrack,
  ProjectionChart,
  ScalePicker,
  StepTransition,
  useReduceMotion,
} from './onboardingWidgets';
import { colors } from './theme';
import { onb } from './onboardingTheme';

/* ------------------------------------------------------------------ *
 * Flow definition
 *
 * Four acts, twenty screens, roughly three minutes. Structure follows
 * the pattern shared by Headspace, Calm, Noom and MyFitnessPal:
 *   hook → one question per screen → compute and reveal → first real action
 * Nothing asks for a permission or an account before the plan exists.
 * ------------------------------------------------------------------ */

export type StepId =
  | 'welcome'
  | 'breath'
  | 'goal'
  | 'motivation'
  | 'proof'
  | 'obstacles'
  | 'sleep'
  | 'active'
  | 'stress'
  | 'insight'
  | 'anchor'
  | 'effort'
  | 'name'
  | 'loader'
  | 'plan'
  | 'expect'
  | 'reminder'
  | 'commit'
  | 'session'
  | 'done';

export const STEP_ORDER: StepId[] = [
  'welcome',
  'breath',
  'goal',
  'motivation',
  'proof',
  'obstacles',
  'sleep',
  'active',
  'stress',
  'insight',
  'anchor',
  'effort',
  'name',
  'loader',
  'plan',
  'expect',
  'reminder',
  'commit',
  'session',
  'done',
];

const ACT: Record<StepId, string> = {
  welcome: 'WELCOME',
  breath: 'WELCOME',
  goal: 'ABOUT YOU',
  motivation: 'ABOUT YOU',
  proof: 'ABOUT YOU',
  obstacles: 'ABOUT YOU',
  sleep: 'ABOUT YOU',
  active: 'ABOUT YOU',
  stress: 'ABOUT YOU',
  insight: 'ABOUT YOU',
  anchor: 'ABOUT YOU',
  effort: 'ABOUT YOU',
  name: 'YOUR PLAN',
  loader: 'YOUR PLAN',
  plan: 'YOUR PLAN',
  expect: 'YOUR PLAN',
  reminder: 'YOUR FIRST DAY',
  commit: 'YOUR FIRST DAY',
  session: 'YOUR FIRST DAY',
  done: 'YOUR FIRST DAY',
};

/** Screens that carry no progress chrome. */
const BARE: StepId[] = ['welcome', 'breath', 'loader'];

const LOADER_TASKS = [
  'Reading your answers',
  'Checking your sleep and movement baseline',
  'Sizing the plan to the time you have',
  'Writing your three daily actions',
];

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export function Onboarding({
  initialAnswers,
  initialStep,
  onFinish,
  onSkip,
  onProgress,
}: {
  initialAnswers?: Answers;
  initialStep?: StepId;
  onFinish: (answers: Answers, sessionDone: boolean) => void;
  onSkip: () => void;
  onProgress?: (step: StepId, answers: Answers) => void;
}) {
  const reduceMotion = useReduceMotion();
  const [answers, setAnswers] = useState<Answers>(initialAnswers ?? emptyAnswers);
  const [step, setStep] = useState<StepId>(initialStep && initialStep !== 'loader' ? initialStep : 'welcome');
  const [sessionDone, setSessionDone] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const index = STEP_ORDER.indexOf(step);
  const plan = useMemo(() => buildPlan(answers), [answers]);

  const patch = useCallback((next: Partial<Answers>) => setAnswers((current) => ({ ...current, ...next })), []);

  const go = useCallback((next: StepId) => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    setStep(next);
  }, []);

  const advance = useCallback(() => {
    const at = STEP_ORDER.indexOf(step);
    if (at < STEP_ORDER.length - 1) go(STEP_ORDER[at + 1]);
  }, [step, go]);

  const back = useCallback(() => {
    const at = STEP_ORDER.indexOf(step);
    // Never walk backwards into the loader — it would rebuild the plan.
    const target = STEP_ORDER[at - 1] === 'loader' ? STEP_ORDER[at - 2] : STEP_ORDER[at - 1];
    if (target) go(target);
  }, [step, go]);

  /** Single-select screens advance on their own, after the tap registers. */
  const pickThenAdvance = useCallback(
    (next: Partial<Answers>) => {
      patch(next);
      if (autoTimer.current) clearTimeout(autoTimer.current);
      autoTimer.current = setTimeout(advance, reduceMotion ? 60 : 260);
    },
    [patch, advance, reduceMotion],
  );

  useEffect(() => () => (autoTimer.current ? clearTimeout(autoTimer.current) : undefined), []);

  // Reset scroll and announce each new screen.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    const position = BARE.includes(step) ? '' : ` Step ${index + 1} of ${STEP_ORDER.length}.`;
    AccessibilityInfo.announceForAccessibility?.(`${ACT[step]}.${position}`);
  }, [step, index]);

  useEffect(() => {
    onProgress?.(step, answers);
  }, [step, answers, onProgress]);

  const toggle = (list: string[], key: string, max = 3) => {
    if (list.includes(key)) return list.filter((item) => item !== key);
    if (list.length >= max) return [...list.slice(1), key];
    return [...list, key];
  };

  const bare = BARE.includes(step);
  const minutes = effortMinutes[answers.effort];

  /* ---------------------------------------------------------------- *
   * Footer configuration per screen
   * ---------------------------------------------------------------- */

  const footer: { label: string; enabled: boolean; note?: string; ghost?: { label: string; onPress: () => void } } | null =
    (() => {
      switch (step) {
        case 'welcome':
          return {
            label: 'Build my plan',
            enabled: true,
            note: 'Six quick questions. About two minutes. No account needed.',
            ghost: { label: 'I already have a plan', onPress: onSkip },
          };
        case 'breath':
          return { label: 'I am ready', enabled: true };
        case 'goal':
        case 'anchor':
        case 'effort':
        case 'sleep':
        case 'active':
        case 'stress':
          return { label: 'Next', enabled: true };
        case 'motivation':
          return {
            label: answers.motivations.length ? 'That is my why' : 'Pick at least one',
            enabled: answers.motivations.length > 0,
          };
        case 'proof':
          return { label: 'Keep going', enabled: true };
        case 'obstacles':
          return { label: answers.obstacles.length ? 'Plan around these' : 'None of these', enabled: true };
        case 'insight':
          return { label: 'Makes sense', enabled: true };
        case 'name':
          return {
            label: 'See my plan',
            enabled: true,
            note: 'Your answers stay on this device. Nothing is uploaded, sold, or used for ads.',
          };
        case 'plan':
          return { label: 'This looks right', enabled: true };
        case 'expect':
          return { label: 'I am in', enabled: true };
        case 'reminder':
          return {
            label: answers.reminder ? `Remind me at ${answers.reminder}` : 'Continue without reminders',
            enabled: true,
            note: answers.reminder
              ? 'One nudge a day for your first action. Never an alert about your health.'
              : 'You can turn reminders on later from your profile.',
            ghost: answers.reminder
              ? { label: 'Not now', onPress: () => { patch({ reminder: '' }); advance(); } }
              : undefined,
          };
        case 'commit':
          return {
            label: answers.committed ? 'Start day one' : 'Commit to continue',
            enabled: answers.committed,
            ghost: answers.committed ? undefined : { label: 'Skip the pledge', onPress: advance },
          };
        case 'session':
          return {
            label: sessionDone ? 'Log it and continue' : 'Skip for now',
            enabled: true,
            note: sessionDone ? undefined : 'Doing one minute now is the single best predictor of coming back tomorrow.',
          };
        case 'done':
          return { label: 'Open my dashboard', enabled: true };
        default:
          return null;
      }
    })();

  const onPrimary = () => {
    if (step === 'done') {
      onFinish(answers, sessionDone);
      return;
    }
    advance();
  };

  /* ---------------------------------------------------------------- *
   * Screen bodies
   * ---------------------------------------------------------------- */

  const body = (() => {
    switch (step) {
      case 'welcome':
        return (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Hero reduceMotion={reduceMotion} />
            <Text style={onb.eyebrow}>MANIFEST HEALTH</Text>
            <Text style={onb.display} accessibilityRole="header">Feel steadier in two weeks.</Text>
            <Text style={onb.lead}>
              Tell us how you want to feel. We turn it into three small daily actions sized to the time you actually have —
              then you do the first one before you ever see a dashboard.
            </Text>
          </View>
        );

      case 'breath':
        return (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Hero reduceMotion={reduceMotion} breathing />
            <Text style={[onb.question, { textAlign: 'center' }]} accessibilityRole="header">First, one slow breath.</Text>
            <Text style={[onb.lead, { textAlign: 'center' }]}>
              The next few questions are about your body and your week. Give yourself one unhurried breath before you answer
              them — it tends to produce honest answers rather than aspirational ones.
            </Text>
          </View>
        );

      case 'goal':
        return (
          <Question
            eyebrow="QUESTION 1 OF 6"
            title="What do you want to gain?"
            lead="Pick the one that would make the biggest difference right now. You can change it any time."
          >
            <View style={onb.list}>
              {goals.map((goal) => (
                <OptionRow
                  key={goal.key}
                  option={{ key: goal.key, label: goal.title, hint: goal.copy, icon: goal.icon }}
                  selected={answers.goal === goal.key}
                  onPress={() => pickThenAdvance({ goal: goal.key })}
                />
              ))}
            </View>
          </Question>
        );

      case 'motivation':
        return (
          <Question
            eyebrow="QUESTION 2 OF 6"
            title="Why does this matter right now?"
            lead="Pick up to three. This is the part you come back to in week three, when the novelty has worn off."
          >
            <View style={onb.list}>
              {motivationOptions.map((option) => (
                <OptionRow
                  key={option.key}
                  option={option}
                  multi
                  selected={answers.motivations.includes(option.key)}
                  onPress={() => patch({ motivations: toggle(answers.motivations, option.key) })}
                />
              ))}
            </View>
            <Text style={onb.helper}>
              {answers.motivations.length >= 3
                ? 'Three is the maximum — tapping another will replace your first.'
                : `${3 - answers.motivations.length} more you can pick.`}
            </Text>
          </Question>
        );

      case 'proof':
        return (
          <Question eyebrow="WHY SMALL WORKS" title="The plans people keep are almost embarrassingly small.">
            <View style={onb.statRow}>
              <View style={onb.statCell}>
                <Text style={onb.statValue}>3</Text>
                <Text style={onb.statLabel}>daily actions in your plan — not thirty</Text>
              </View>
              <View style={onb.statCell}>
                <Text style={onb.statValue}>{minutes} min</Text>
                <Text style={onb.statLabel}>the most it will ask of you in a day</Text>
              </View>
            </View>
            <View style={[onb.quoteCard, { marginTop: 16 }]}>
              <Text style={onb.quoteText}>
                “I had four abandoned habit apps before this. The difference was that it never asked me to do more the
                following week. Same three things, every day, and by week three I stopped negotiating with myself.”
              </Text>
              <Text style={onb.quoteWho}>— the pattern we designed for</Text>
            </View>
            <Text style={onb.helper}>
              Illustrative, not a testimonial or a clinical claim. Manifest Health offers general wellness education only.
            </Text>
          </Question>
        );

      case 'obstacles':
        return (
          <Question
            eyebrow="QUESTION 3 OF 6"
            title="What has gotten in the way before?"
            lead="Be blunt. Naming the obstacle is how your plan gets built around it instead of into it."
          >
            <View style={onb.list}>
              {obstacleOptions.map((option) => (
                <OptionRow
                  key={option.key}
                  option={option}
                  multi
                  selected={answers.obstacles.includes(option.key)}
                  onPress={() => patch({ obstacles: toggle(answers.obstacles, option.key) })}
                />
              ))}
            </View>
            <WhyWeAsk text="Every obstacle you pick changes an actual line in your plan. You will see exactly which one, two screens from now." />
          </Question>
        );

      case 'sleep':
        return (
          <Question
            eyebrow="QUESTION 4 OF 6"
            title="On a normal night, how much sleep do you get?"
            lead="A rough range is fine. Nobody knows this number precisely."
          >
            <ScalePicker
              bands={sleepBands}
              value={answers.sleep}
              onChange={(value) => patch({ sleep: value })}
              lowLabel="LESS"
              highLabel="MORE"
            />
            <WhyWeAsk text="Sleep sets the price of every other habit. If it is short, your plan starts there rather than stacking on top of a deficit." />
          </Question>
        );

      case 'active':
        return (
          <Question
            eyebrow="QUESTION 5 OF 6"
            title="How many days a week do you move on purpose?"
            lead="Walks count. Gardening counts. It does not have to look like exercise."
          >
            <ScalePicker
              bands={activeBands}
              value={answers.active}
              onChange={(value) => patch({ active: value })}
              lowLabel="RARELY"
              highLabel="MOST DAYS"
            />
            <WhyWeAsk text="This sets the size of your first action. Starting above your current baseline is the most common reason plans get abandoned in week two." />
          </Question>
        );

      case 'stress':
        return (
          <Question
            eyebrow="QUESTION 6 OF 6"
            title="How has your stress been lately?"
            lead="There is no wrong answer here, and it does not change what you are allowed to do."
          >
            <ScalePicker
              bands={stressBands}
              value={answers.stress}
              onChange={(value) => patch({ stress: value })}
              lowLabel="CALM"
              highLabel="AT MY LIMIT"
            />
            <WhyWeAsk text="High stress does not disqualify anything — it changes how much slack your plan needs. Stretched weeks get a one-minute version of every action." />
          </Question>
        );

      case 'insight': {
        const insight = midQuizInsight(answers);
        return (
          <Question eyebrow={insight.tag} title={insight.title}>
            <Text style={[onb.lead, { fontSize: 16, lineHeight: 25 }]}>{insight.body}</Text>
            <View style={onb.proofCard}>
              <Text style={onb.proofTag}>SO FAR WE HAVE</Text>
              <ProofLine text={`Your focus: ${goals.find((goal) => goal.key === answers.goal)?.title.toLowerCase()}`} />
              <ProofLine text={`${answers.motivations.length} reason${answers.motivations.length === 1 ? '' : 's'} it matters to you`} />
              <ProofLine
                text={
                  answers.obstacles.length
                    ? `${answers.obstacles.length} obstacle${answers.obstacles.length === 1 ? '' : 's'} to design around`
                    : 'No specific obstacles to design around'
                }
              />
              <ProofLine text={`Your sleep and movement baseline`} />
            </View>
            <Text style={onb.helper}>Two questions left. They are about logistics, not about you.</Text>
          </Question>
        );
      }

      case 'anchor':
        return (
          <Question
            eyebrow="LOGISTICS"
            title="When can you protect a few minutes?"
            lead="Pick the window you already control, not the one you wish you had."
          >
            <GridPicker
              options={anchorOptions}
              value={answers.anchor}
              onChange={(key: AnchorKey) =>
                pickThenAdvance({ anchor: key, reminder: defaultReminderFor[key] })
              }
            />
            <WhyWeAsk text="Attaching an action to a window you already own beats willpower. This is the single strongest predictor of whether a habit survives the first month." />
          </Question>
        );

      case 'effort':
        return (
          <Question
            eyebrow="LOGISTICS"
            title="How much time, honestly?"
            lead="Pick the amount you could still manage on a bad day. It is not a ceiling — you can always do more."
          >
            <View style={onb.list}>
              {effortOptions.map((option) => (
                <OptionRow
                  key={option.key}
                  option={option}
                  selected={answers.effort === option.key}
                  onPress={() => pickThenAdvance({ effort: option.key as EffortKey })}
                />
              ))}
            </View>
            <WhyWeAsk text="We size your plan to your worst realistic day, not your best. That is why it survives week two." />
          </Question>
        );

      case 'name':
        return (
          <Question
            eyebrow="LAST THING"
            title="What should we call you?"
            lead="A plan is easier to keep when it sounds like it belongs to someone. First name is plenty."
          >
            <Text style={onb.inputLabel}>FIRST NAME</Text>
            <TextInput
              accessibilityLabel="First name"
              autoCapitalize="words"
              autoCorrect={false}
              onBlur={() => setNameFocused(false)}
              onChangeText={(value) => patch({ name: value })}
              onFocus={() => setNameFocused(true)}
              onSubmitEditing={advance}
              placeholder="Your name"
              placeholderTextColor="#94A1B3"
              returnKeyType="done"
              style={[onb.input, nameFocused && onb.inputFocus]}
              value={answers.name}
            />
            <View style={onb.promise}>
              <Text style={onb.promiseIcon}>✓</Text>
              <View style={onb.promiseCopy}>
                <Text style={onb.promiseTitle}>Stored on this device only</Text>
                <Text style={onb.promiseBody}>
                  No account, no cloud sync, no health data shared with third parties for advertising or data mining. You can
                  delete everything from your profile in one tap.
                </Text>
              </View>
            </View>
            <Text style={onb.helper}>Leave it blank if you would rather not say — we will just say “Friend”.</Text>
          </Question>
        );

      case 'loader':
        return <Analyzing tasks={LOADER_TASKS} onDone={advance} reduceMotion={reduceMotion} />;

      case 'plan':
        return (
          <View>
            <Text style={onb.eyebrow}>{answers.name.trim() ? `${answers.name.trim().toUpperCase()}’S PLAN` : 'YOUR PLAN'}</Text>
            <Text style={[onb.question, { marginBottom: 16 }]} accessibilityRole="header">{plan.headline}</Text>

            <View style={onb.scoreCard}>
              <Text style={onb.scoreKicker}>STARTING POINT</Text>
              <View style={onb.scoreRow}>
                <Text style={onb.scoreValue}>{plan.readiness}</Text>
                <Text style={onb.scoreOutOf}>/100</Text>
                <Text style={onb.scoreLabel}>{plan.readinessLabel}</Text>
              </View>
              <Text style={onb.scoreBody}>
                This is a picture of what you already have to work with — your sleep, your movement, your stress and your
                reasons. It is a baseline, not a grade, and it is the number we expect to move.
              </Text>
            </View>

            <View style={onb.chartCard}>
              <View style={onb.chartHead}>
                <Text style={onb.chartTitle}>If you keep the rhythm</Text>
                <Text style={onb.chartTag}>BY {plan.targetDate.toUpperCase()}</Text>
              </View>
              <Text style={onb.chartBody}>
                Four weeks of {plan.focusNote.toLowerCase()} Projected from your own answers — not a promise, and not a
                clinical prediction.
              </Text>
              <ProjectionChart projection={plan.projection} />
              <Text style={onb.chartFoot}>
                Illustrative projection based on the baseline you described. Real progress is uneven, and a missed day costs
                far less than the chart suggests.
              </Text>
            </View>

            <Text style={onb.sectionTitle}>Your three daily actions</Text>
            {plan.habits.map((habit, order) => (
              <View key={habit.id} style={onb.planRow}>
                <Text style={onb.planIndex}>{`0${order + 1}`}</Text>
                <View style={onb.planCopy}>
                  <Text style={onb.planTitle}>{habit.title}</Text>
                  <Text style={onb.planWhen}>{habit.when}</Text>
                </View>
              </View>
            ))}

            <View style={[onb.proofCard, { marginTop: 12 }]}>
              <Text style={onb.proofTag}>WHAT YOU ALREADY HAVE GOING</Text>
              {plan.strengths.map((strength) => (
                <ProofLine key={strength} text={strength} />
              ))}
            </View>

            {plan.obstaclePlan.length > 0 && (
              <>
                <Text style={onb.sectionTitle}>How we planned around your obstacles</Text>
                {plan.obstaclePlan.map((item) => (
                  <View key={item.obstacle} style={onb.answerCard}>
                    <Text style={onb.answerObstacle}>{item.obstacle}</Text>
                    <Text style={onb.answerBody}>{item.answer}</Text>
                  </View>
                ))}
              </>
            )}

            <Text style={onb.helper}>
              Manifest Health supports general wellness and is not medical advice, diagnosis, or treatment. Talk with a
              qualified professional about any health concern, and keep following their guidance over ours.
            </Text>
          </View>
        );

      case 'expect':
        return (
          <Question eyebrow="BEFORE YOU START" title="What this will actually feel like.">
            <Pillar
              index="01"
              title="Week one feels too easy"
              body={`${minutes} minutes will feel like it cannot possibly be enough. That is the design. Easy is what makes it repeatable.`}
            />
            <Pillar
              index="02"
              title="Week two is where it usually dies"
              body="The novelty is gone and nothing visible has changed yet. Your plan does not get harder here — that is specifically why it holds."
            />
            <Pillar
              index="03"
              title="You will miss days"
              body="Everyone does. A missed day is a missed day, not a failed plan. There is no streak to shame you and nothing resets to zero."
            />
            <View style={onb.quoteCard}>
              <Text style={onb.quoteText}>
                The thing we are competing with is not another app. It is the start-and-stop cycle — the ambitious plan in
                January that is gone by February, repeated for years.
              </Text>
              <Text style={onb.quoteWho}>That cycle is the enemy. Small and boring is how you beat it.</Text>
            </View>
          </Question>
        );

      case 'reminder':
        return (
          <Question
            eyebrow="ONE NUDGE A DAY"
            title="Want a reminder for your first action?"
            lead={`You said ${anchorLabel[answers.anchor].toLowerCase()}s work best. Pick a time and we will nudge you once — nothing else.`}
          >
            <ChipRow options={reminderOptions} value={answers.reminder} onChange={(value) => patch({ reminder: value })} />
            <View style={[onb.answerCard, { marginTop: 18 }]}>
              <Text style={onb.answerObstacle}>WHAT YOU WILL ACTUALLY GET</Text>
              <Text style={onb.answerBody}>
                One reminder a day at your chosen time, for your first action only. No streak warnings, no guilt messages, no
                marketing, and never an alert about your health. Turn it off in one tap from your profile.
              </Text>
            </View>
            <Text style={onb.helper}>
              This prototype does not send real notifications — it records the preference so you can see where the ask
              belongs. A shipped build would only raise the system permission prompt after you tap the button below.
            </Text>
          </Question>
        );

      case 'commit':
        return (
          <Question eyebrow="MAKE IT REAL" title="One promise, in your own words.">
            <View style={onb.pledge}>
              <Text style={onb.pledgeMark}>“</Text>
              <Text style={onb.pledgeText}>
                I, <Text style={onb.pledgeName}>{answers.name.trim() || 'Friend'}</Text>, am starting today. Not on Monday,
                not in January. I will do {minutes} minutes{' '}
                {anchorLabel[answers.anchor].toLowerCase() === 'midday' ? 'at midday' : `in the ${anchorLabel[answers.anchor].toLowerCase()}`}, and
                when I miss a day I will start again the next one.
              </Text>
            </View>
            <HoldToCommit
              done={answers.committed}
              onDone={() => patch({ committed: true })}
              reduceMotion={reduceMotion}
            />
            <Text style={onb.helper}>
              This is not a contract and nothing is shared. It exists because deciding once, deliberately, is measurably
              easier to act on than deciding every morning.
            </Text>
          </Question>
        );

      case 'session':
        return (
          <Question eyebrow="YOUR FIRST MINUTE" title="Do one thing now, before the dashboard.">
            <BreathSession
              onComplete={() => setSessionDone(true)}
              reduceMotion={reduceMotion}
            />
            <View style={{ marginTop: 6 }} />
            {!sessionDone && (
              <WhyWeAsk text="Finishing one real action in the first session is the clearest signal that a plan will still be alive next week. It is the whole reason this screen comes before the app." />
            )}
          </Question>
        );

      case 'done':
        return (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={[onb.scoreCard, { alignItems: 'center', paddingVertical: 30 }]}>
              <Text style={[onb.scoreValue, { fontSize: 64 }]}>1</Text>
              <Text style={onb.scoreKicker}>DAY ONE, ON THE BOARD</Text>
            </View>
            <Text style={onb.question} accessibilityRole="header">You are set up, {answers.name.trim() || 'Friend'}.</Text>
            <Text style={onb.lead}>
              {sessionDone
                ? 'You already did a session, so today counts. Tomorrow your three actions are waiting — nothing more.'
                : 'Your three actions are waiting on Today. Start with the first one whenever your window comes around.'}
            </Text>
            <View style={onb.proofCard}>
              <Text style={onb.proofTag}>WHAT IS SET UP</Text>
              <ProofLine text={`${plan.habits.length} daily actions, sized to ${minutes} minutes`} />
              <ProofLine text={answers.reminder ? `A single reminder at ${answers.reminder}` : 'No reminders, as you asked'} />
              <ProofLine text={answers.committed ? 'Your promise, made deliberately' : 'Your plan, ready when you are'} />
              <ProofLine text={sessionDone ? 'One session already completed' : 'Your first session, waiting on Today'} />
            </View>
          </View>
        );

      default:
        return null;
    }
  })();

  /* ---------------------------------------------------------------- *
   * Chrome
   * ---------------------------------------------------------------- */

  const showBack = index > 0 && step !== 'loader';

  return (
    <SafeAreaView style={onb.shell}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={onb.header}>
          <View style={onb.headerRow}>
            {showBack ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Go back one step" onPress={back} style={onb.backHit}>
                <Text style={onb.backGlyph}>←</Text>
              </Pressable>
            ) : (
              <View style={onb.headerSpacer} />
            )}
            <View style={onb.brandRow}>
              <View style={onb.logoMark}>
                <View style={onb.logoDot} />
              </View>
              <Text style={onb.brand}>MANIFEST HEALTH</Text>
            </View>
            {step === 'welcome' ? (
              <Pressable accessibilityRole="button" onPress={onSkip} style={onb.skipHit}>
                <Text style={onb.skipText}>Skip</Text>
              </Pressable>
            ) : (
              <View style={onb.headerSpacer} />
            )}
          </View>
        </View>

        {!bare && (
          <ProgressTrack
            ratio={index / (STEP_ORDER.length - 1)}
            leftLabel={ACT[step]}
            rightLabel={`STEP ${index + 1} OF ${STEP_ORDER.length}`}
            reduceMotion={reduceMotion}
          />
        )}

        <View style={onb.stage}>
          <StepTransition stepKey={step} reduceMotion={reduceMotion}>
            {step === 'loader' ? (
              body
            ) : (
              <ScrollView
                ref={scrollRef}
                style={onb.scroll}
                contentContainerStyle={[onb.scrollPad, bare && { flexGrow: 1 }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {body}
              </ScrollView>
            )}
          </StepTransition>
        </View>

        {footer && (
          <View style={onb.footer}>
            <Button label={footer.label} onPress={onPrimary} disabled={!footer.enabled} secondary={!footer.enabled} />
            {footer.ghost && (
              <Pressable accessibilityRole="button" onPress={footer.ghost.onPress} style={onb.ghost}>
                <Text style={onb.ghostText}>{footer.ghost.label}</Text>
              </Pressable>
            )}
            {footer.note && <Text style={onb.footerNote}>{footer.note}</Text>}
          </View>
        )}
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ *
 * Small presentational pieces
 * ------------------------------------------------------------------ */

function Question({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <View>
      <Text style={onb.eyebrow}>{eyebrow}</Text>
      <Text style={onb.question} accessibilityRole="header" accessibilityLiveRegion="polite">
        {title}
      </Text>
      {lead ? <Text style={onb.lead}>{lead}</Text> : null}
      {children}
    </View>
  );
}

function WhyWeAsk({ text }: { text: string }) {
  return (
    <View style={[onb.answerCard, { marginTop: 18, backgroundColor: colors.cream, borderColor: 'transparent' }]}>
      <Text style={onb.answerObstacle}>WHY WE ASK</Text>
      <Text style={onb.answerBody}>{text}</Text>
    </View>
  );
}

function ProofLine({ text }: { text: string }) {
  return (
    <View style={onb.proofRow}>
      <Text style={onb.proofGlyph}>✓</Text>
      <Text style={onb.proofText}>{text}</Text>
    </View>
  );
}

function Pillar({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <View style={onb.pillarRow}>
      <Text style={onb.pillarNum}>{index}</Text>
      <View style={onb.pillarCopy}>
        <Text style={onb.pillarTitle}>{title}</Text>
        <Text style={onb.pillarBody}>{body}</Text>
      </View>
    </View>
  );
}

function Hero({ reduceMotion, breathing = false }: { reduceMotion: boolean; breathing?: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: breathing ? 4000 : 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: breathing ? 6000 : 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion, breathing]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, breathing ? 1.14 : 1.05] });

  return (
    <View style={onb.hero} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={[onb.orbitLarge, { transform: [{ scale }] }]} />
      <View style={onb.orbitSmall} />
      <Animated.View style={[onb.heroCircle, { transform: [{ scale }] }]}>
        <Text style={onb.heroSymbol}>✦</Text>
      </Animated.View>
      <View style={[onb.spark, { top: 22, left: 38 }]} />
      <View style={[onb.spark, { right: 44, bottom: 32 }]} />
    </View>
  );
}
