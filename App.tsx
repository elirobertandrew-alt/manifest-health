import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { Onboarding } from './src/Onboarding';
import { Goals, Insights, OverlayScreen, Profile, Today } from './src/screens';
import { AppState, GoalKey, Overlay, Tab, createState, defaultHabits } from './src/content';
import { loadState, saveState } from './src/storage';
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

  const update = (patch: Partial<AppState> | ((current: AppState) => AppState)) => {
    setState(typeof patch === 'function' ? patch(state) : { ...state, ...patch });
  };

  const content = useMemo(() => {
    if (tab === 'Today') {
      return (
        <Today
          state={state}
          onToggle={(index) =>
            update({
              habits: state.habits.map((habit, i) => (i === index ? { ...habit, done: !habit.done } : habit)),
            })
          }
          onMood={(mood) => update({ mood })}
          onOpen={setOverlay}
        />
      );
    }
    if (tab === 'Goals') {
      return (
        <Goals
          state={state}
          onSelectGoal={(goal: GoalKey) =>
            update({
              goal,
              customHeadline: '',
              habits: defaultHabits(goal).map((habit, index) => ({ ...habit, done: state.habits[index]?.done ?? false })),
            })
          }
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
            onToggle={(index) =>
              update({
                habits: state.habits.map((habit, i) => (i === index ? { ...habit, done: !habit.done } : habit)),
              })
            }
            onSaveReflection={(reflection) => update({ reflection })}
            onRenameHabit={(index, title) =>
              update({
                habits: state.habits.map((habit, i) => (i === index ? { ...habit, title } : habit)),
              })
            }
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

  useEffect(() => {
    loadState().then((saved) => {
      setState(saved);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) {
      void saveState(state);
    }
  }, [state, ready]);

  if (!ready) {
    return <View style={styles.webBackdrop} />;
  }

  return (
    <View style={styles.webBackdrop}>
      {state ? (
        <Dashboard state={state} setState={setState} onReset={() => setState(null)} />
      ) : (
        <Onboarding
          onFinish={(goal, name) => setState(createState(name, goal))}
          onSkip={() => setState(createState('Alex', 'energy'))}
        />
      )}
    </View>
  );
}
