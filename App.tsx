import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { Onboarding, StepId } from './src/Onboarding';
import { Goals, Insights, OverlayScreen, Profile, Today } from './src/screens';
import { AppState, GoalKey, Overlay, Tab } from './src/content';
import { Answers, buildPlan, createState, sampleAnswers } from './src/onboardingModel';
import { Draft, clearAll, loadDraft, loadState, saveDraft, saveState } from './src/storage';
import { styles } from './src/theme';

function Dashboard({
  state,
  setState,
  onReset,
}: {
  state: AppState;
  setState: (next: AppState) => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<Tab>('Today');
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  const update = (patch: Partial<AppState>) => setState({ ...state, ...patch });

  const toggleHabit = (index: number) =>
    update({ habits: state.habits.map((habit, i) => (i === index ? { ...habit, done: !habit.done } : habit)) });

  const content = useMemo(() => {
    if (tab === 'Today') {
      return <Today state={state} onToggle={toggleHabit} onMood={(mood) => update({ mood })} onOpen={setOverlay} />;
    }
    if (tab === 'Goals') {
      return (
        <Goals
          state={state}
          onSelectGoal={(goal: GoalKey) => {
            const next = buildPlan({ ...state.answers, goal });
            update({
              goal,
              customHeadline: '',
              answers: { ...state.answers, goal },
              habits: next.habits.map((habit, index) => ({ ...habit, done: state.habits[index]?.done ?? false })),
            });
          }}
          onAddIntention={(title) =>
            update({
              customHeadline: title,
              intentions: [{ id: `${Date.now()}`, title, copy: 'Written in your words' }, ...state.intentions],
            })
          }
          onSelectIntention={(title) => update({ customHeadline: title })}
        />
      );
    }
    if (tab === 'Insights') return <Insights state={state} onOpen={setOverlay} />;
    return <Profile state={state} onOpen={setOverlay} onReset={onReset} />;
  }, [tab, state, onReset]);

  const icons: Record<Tab, string> = { Today: '⌂', Goals: '◎', Insights: '▥', You: '○' };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.appShell}>
        {overlay ? (
          <OverlayScreen
            overlay={overlay}
            state={state}
            onClose={() => setOverlay(null)}
            onToggle={toggleHabit}
            onSaveReflection={(reflection) => update({ reflection })}
            onRenameHabit={(index, title) =>
              update({ habits: state.habits.map((habit, i) => (i === index ? { ...habit, title } : habit)) })
            }
            onSetReminder={(reminder) => update({ reminder, answers: { ...state.answers, reminder } })}
          />
        ) : (
          content
        )}
        {!overlay && (
          <View style={styles.tabBar}>
            {(['Today', 'Goals', 'Insights', 'You'] as Tab[]).map((item) => (
              <Pressable
                key={item}
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === item }}
                accessibilityLabel={`${item} tab`}
                onPress={() => setTab(item)}
                style={styles.tab}
              >
                <Text style={[styles.tabIcon, tab === item && styles.tabActive]}>{icons[item]}</Text>
                <Text style={[styles.tabText, tab === item && styles.tabActive]}>{item}</Text>
                {tab === item && <View style={styles.tabIndicator} />}
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AppState | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    Promise.all([loadState(), loadDraft()]).then(([saved, savedDraft]) => {
      setState(saved);
      setDraft(savedDraft);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) void saveState(state);
  }, [state, ready]);

  // Persist onboarding progress so a closed tab does not cost the answers.
  const onProgress = useCallback(
    (step: StepId, answers: Answers) => {
      void saveDraft({ step, answers });
    },
    [],
  );

  const finish = useCallback((answers: Answers, sessionDone: boolean) => {
    const next = createState(answers);
    setState({ ...next, firstSessionDone: sessionDone });
    setDraft(null);
    void saveDraft(null);
  }, []);

  const skip = useCallback(() => {
    setState(createState(sampleAnswers));
    setDraft(null);
    void saveDraft(null);
  }, []);

  const reset = useCallback(() => {
    setState(null);
    setDraft(null);
    void clearAll();
  }, []);

  if (!ready) {
    return <View style={styles.webBackdrop} />;
  }

  return (
    <View style={styles.webBackdrop}>
      {state ? (
        <Dashboard state={state} setState={setState} onReset={reset} />
      ) : (
        <Onboarding
          initialAnswers={draft?.answers}
          initialStep={draft?.step}
          onFinish={finish}
          onSkip={skip}
          onProgress={onProgress}
        />
      )}
    </View>
  );
}
