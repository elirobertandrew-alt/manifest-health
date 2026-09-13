import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from './Button';
import { AppState, GoalKey, Habit, Overlay, goals, guideSteps, headlineFor, settingsCopy } from './content';
import { styles } from './theme';

function Ring({ value }: { value: number }) {
  return (
    <View style={styles.ring}>
      <View style={styles.ringInner}>
        <Text style={styles.ringValue}>{value}%</Text>
        <Text style={styles.ringLabel}>TODAY</Text>
      </View>
    </View>
  );
}

export function Today({
  state,
  onToggle,
  onMood,
  onOpen,
}: {
  state: AppState;
  onToggle: (index: number) => void;
  onMood: (value: number) => void;
  onOpen: (overlay: Overlay) => void;
}) {
  const doneCount = state.habits.filter((habit) => habit.done).length;
  const progress = Math.round((doneCount / Math.max(state.habits.length, 1)) * 100);
  const complete = doneCount === state.habits.length && state.habits.length > 0;

  return (
    <ScrollView style={styles.content} contentContainerStyle={styles.dashboardPad} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.kicker}>GOOD MORNING</Text>
          <Text style={styles.dashTitle}>Hi, {state.name.trim() || 'there'}.</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => onOpen({ kind: 'details' })} style={styles.avatar}>
          <Text style={styles.avatarText}>{state.name.slice(0, 1).toUpperCase()}</Text>
          <View style={styles.online} />
        </Pressable>
      </View>

      <View style={styles.momentumCard}>
        <View style={styles.momentumCopy}>
          <Text style={styles.cardKicker}>TODAY’S MOMENTUM</Text>
          <Text style={styles.momentumTitle}>{doneCount} of {state.habits.length} actions complete</Text>
          <Text style={styles.momentumBody}>Every action is a vote for the health you want.</Text>
        </View>
        <Ring value={progress} />
      </View>

      {complete && (
        <View style={styles.celebrate} accessibilityLiveRegion="polite">
          <Text style={styles.celebrateTitle}>That’s a full day of small wins.</Text>
          <Text style={styles.celebrateBody}>Protect the rhythm tomorrow. You do not need to add more just because today went well.</Text>
        </View>
      )}

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Your daily rhythm</Text>
        <Pressable accessibilityRole="button" onPress={() => onOpen({ kind: 'editHabits' })}>
          <Text style={styles.sectionMeta}>EDIT</Text>
        </Pressable>
      </View>
      <View style={styles.habitCard}>
        {state.habits.map((habit, index) => (
          <Pressable
            key={habit.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: habit.done }}
            accessibilityLabel={habit.title}
            onPress={() => onToggle(index)}
            style={[styles.habitRow, index < state.habits.length - 1 && styles.rowBorder]}
          >
            <View style={[styles.check, habit.done && styles.checkDone]}>
              <Text style={styles.checkText}>{habit.done ? '✓' : ''}</Text>
            </View>
            <View style={styles.habitCopy}>
              <Text style={[styles.habitTitle, habit.done && styles.strike]}>{habit.title}</Text>
              <Text style={styles.habitTime}>{habit.when}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Learn about ${habit.title}`} onPress={() => onOpen({ kind: 'habit', index })}>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>How do you feel?</Text>
        <Text style={styles.sectionMeta}>QUICK CHECK-IN</Text>
      </View>
      <View style={styles.moodCard}>
        <Text style={styles.moodQuestion}>Your energy right now</Text>
        <View style={styles.moodRow}>
          {['Low', 'Flat', 'Okay', 'Good', 'Great'].map((label, index) => (
            <Pressable
              key={label}
              accessibilityRole="radio"
              accessibilityState={{ checked: state.mood === index }}
              accessibilityLabel={`${label} energy`}
              onPress={() => onMood(index)}
              style={styles.moodItem}
            >
              <View style={[styles.moodDot, state.mood === index && styles.moodActive]}>
                <Text style={[styles.moodFace, state.mood === index && styles.whiteText]}>{['–', '·', '○', '⌒', '✦'][index]}</Text>
              </View>
              <Text style={[styles.moodLabel, state.mood === index && styles.moodLabelActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.coachCard}>
        <View style={styles.coachBadge}><Text style={styles.whiteText}>M</Text></View>
        <View style={styles.coachCopy}>
          <Text style={styles.coachKicker}>TODAY’S HEALTH NOTE</Text>
          <Text style={styles.coachTitle}>Light changes your body clock</Text>
          <Text style={styles.coachBody}>A few minutes of outdoor light soon after waking can support daytime alertness and your sleep-wake rhythm.</Text>
          <Pressable accessibilityRole="button" onPress={() => onOpen({ kind: 'guide' })}>
            <Text style={styles.coachLink}>Read the 2-minute guide →</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.footerNote}>General wellness guidance only · Not medical advice</Text>
    </ScrollView>
  );
}

export function Goals({
  state,
  onSelectGoal,
  onAddIntention,
  onSelectIntention,
}: {
  state: AppState;
  onSelectGoal: (key: GoalKey) => void;
  onAddIntention: (title: string) => void;
  onSelectIntention: (title: string) => void;
}) {
  const [custom, setCustom] = useState('');
  const progressWidth = `${Math.min(100, Math.round((state.day / 30) * 100))}%` as const;

  return (
    <ScrollView style={styles.content} contentContainerStyle={styles.dashboardPad} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>YOUR DIRECTION</Text>
      <Text style={styles.dashTitle}>Health goals</Text>
      <Text style={styles.pageLead}>Name what you want to gain, then shape it into something you can practice.</Text>
      <View style={styles.goalFeature}>
        <Text style={styles.goalFeatureLabel}>CURRENT NORTH STAR</Text>
        <Text style={styles.goalFeatureTitle}>{headlineFor(state)}</Text>
        <Text style={styles.goalFeatureBody}>A gentle 30-day focus built around consistency, not perfection.</Text>
        <View style={styles.goalProgress}><View style={[styles.goalProgressFill, { width: progressWidth }]} /></View>
        <Text style={styles.goalProgressText}>DAY {state.day} OF 30</Text>
      </View>
      <Text style={styles.sectionTitle}>Choose a new focus</Text>
      <View style={styles.goalGrid}>
        {goals.map((item) => (
          <Pressable
            key={item.key}
            accessibilityRole="radio"
            accessibilityState={{ checked: state.goal === item.key && !state.customHeadline }}
            accessibilityLabel={`${item.title}. ${item.copy}`}
            onPress={() => onSelectGoal(item.key)}
            style={[styles.goalTile, state.goal === item.key && !state.customHeadline && styles.goalTileActive]}
          >
            <Text style={[styles.goalTileIcon, state.goal === item.key && styles.blueText]}>{item.icon}</Text>
            <Text style={styles.goalTileTitle}>{item.title}</Text>
            <Text style={styles.goalTileBody}>{item.copy}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.inputLabel}>OR WRITE IT IN YOUR WORDS</Text>
      <TextInput
        accessibilityLabel="Custom health intention"
        value={custom}
        onChangeText={setCustom}
        placeholder="I want to feel..."
        placeholderTextColor="#94A1B3"
        style={styles.input}
      />
      <Button
        label="Add this intention"
        disabled={!custom.trim()}
        secondary={!custom.trim()}
        onPress={() => {
          onAddIntention(custom.trim());
          setCustom('');
        }}
      />
      {state.intentions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No custom intentions yet</Text>
          <Text style={styles.emptyBody}>Write the feeling you want — more ease in the afternoon, calmer evenings, stronger walks — and it becomes part of your plan.</Text>
        </View>
      ) : (
        state.intentions.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Use intention ${item.title}`}
            onPress={() => onSelectIntention(item.title)}
            style={[styles.customChip, state.customHeadline === item.title && styles.customChipActive]}
          >
            <Text style={styles.customChipTitle}>{item.title}</Text>
            <Text style={styles.goalTileBody}>{item.copy}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

export function Insights({
  state,
  onOpen,
}: {
  state: AppState;
  onOpen: (overlay: Overlay) => void;
}) {
  const bars = [38, 55, 48, 72, 64, 84, 76];
  const empty = state.habits.every((habit) => !habit.done) && !state.reflection;

  return (
    <ScrollView style={styles.content} contentContainerStyle={styles.dashboardPad} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>LOOKING BACK</Text>
      <Text style={styles.dashTitle}>Your patterns</Text>
      <Text style={styles.pageLead}>Notice what helps without turning wellbeing into a scorecard.</Text>
      {empty ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Your week is still forming</Text>
          <Text style={styles.emptyBody}>Complete a daily action or start a reflection and this view will fill with gentle patterns — not grades.</Text>
        </View>
      ) : (
        <>
          <View style={styles.streakCard}>
            <Text style={styles.streakNumber}>{state.day}</Text>
            <View>
              <Text style={styles.streakTitle}>day gentle streak</Text>
              <Text style={styles.streakBody}>Your longest yet — keep it kind.</Text>
            </View>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Daily energy</Text>
              <Text style={styles.greenText}>check-in {['Low', 'Flat', 'Okay', 'Good', 'Great'][state.mood]}</Text>
            </View>
            <View style={styles.chart}>
              {bars.map((height, index) => (
                <View key={index} style={styles.barWrap}>
                  <View style={[styles.bar, { height }, index === 5 && styles.barHighlight]} />
                  <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
      <View style={styles.insightCard}>
        <Text style={styles.insightTag}>PATTERN FOUND</Text>
        <Text style={styles.insightTitle}>Morning movement is working</Text>
        <Text style={styles.insightBody}>People often notice steadier afternoons after a short outdoor walk. Treat that as a clue, not a diagnosis.</Text>
      </View>
      <View style={styles.insightCardWhite}>
        <Text style={styles.insightTagBlue}>WEEKLY REFLECTION</Text>
        <Text style={styles.insightTitle}>{state.reflection ? 'Your latest note' : 'What felt easier this week?'}</Text>
        <Text style={styles.insightBody}>{state.reflection || 'Take a quiet moment to notice progress that numbers may miss.'}</Text>
        <Button label={state.reflection ? 'Edit reflection' : 'Start reflection'} onPress={() => onOpen({ kind: 'reflection' })} secondary />
      </View>
    </ScrollView>
  );
}

export function Profile({
  state,
  onOpen,
  onReset,
}: {
  state: AppState;
  onOpen: (overlay: Overlay) => void;
  onReset: () => void;
}) {
  const started = new Date(state.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return (
    <ScrollView style={styles.content} contentContainerStyle={styles.dashboardPad} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>YOUR SPACE</Text>
      <Text style={styles.dashTitle}>{state.name}'s profile</Text>
      <View style={styles.profileHero}>
        <View style={styles.profileAvatar}><Text style={styles.profileInitial}>{state.name.slice(0, 1).toUpperCase()}</Text></View>
        <Text style={styles.profileName}>{state.name}</Text>
        <Text style={styles.profileSince}>Building healthy momentum since {started}</Text>
      </View>
      {Object.keys(settingsCopy).map((item) => (
        <Pressable
          key={item}
          accessibilityRole="button"
          accessibilityLabel={item}
          onPress={() => onOpen({ kind: 'settings', topic: item })}
          style={styles.settingsRow}
        >
          <Text style={styles.settingsText}>{item}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>A note about your wellbeing</Text>
        <Text style={styles.disclaimerBody}>Manifest Health offers general wellness education. It does not diagnose, treat, or replace care from a qualified health professional.</Text>
      </View>
      <Button label="Replay onboarding" onPress={onReset} secondary />
    </ScrollView>
  );
}

function Sheet({
  title,
  kicker,
  onClose,
  children,
}: {
  title: string;
  kicker: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <View style={styles.sheet}>
      <View style={styles.sheetHead}>
        <Text style={styles.sheetKicker}>{kicker}</Text>
        <Text style={styles.sheetTitle}>{title}</Text>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>← Back to app</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.dashboardPad} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

function ReflectionSheet({
  value,
  onClose,
  onSave,
}: {
  value: string;
  onClose: () => void;
  onSave: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <Sheet title="Weekly reflection" kicker="LOOKING BACK" onClose={onClose}>
      <Text style={styles.lead}>What felt even a little easier this week?</Text>
      <TextInput
        accessibilityLabel="Weekly reflection"
        multiline
        value={draft}
        onChangeText={setDraft}
        placeholder="One sentence is enough."
        placeholderTextColor="#94A1B3"
        style={[styles.input, { minHeight: 140 }]}
      />
      <Button
        label="Save reflection"
        onPress={() => {
          onSave(draft.trim());
          onClose();
        }}
      />
      <Text style={styles.footerNote}>{draft.trim() ? 'This stays on the device.' : 'Empty is okay. You can come back later.'}</Text>
    </Sheet>
  );
}

function HabitEditor({ habit, onRename }: { habit: Habit; onRename: (title: string) => void }) {
  const [title, setTitle] = useState(habit.title);
  return (
    <View style={styles.article}>
      <Text style={styles.articleStep}>{habit.when}</Text>
      <TextInput
        accessibilityLabel={`Edit ${habit.title}`}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Button label="Update action" secondary onPress={() => onRename(title.trim() || habit.title)} />
    </View>
  );
}

export function OverlayScreen({
  overlay,
  state,
  onClose,
  onToggle,
  onSaveReflection,
  onRenameHabit,
}: {
  overlay: Overlay;
  state: AppState;
  onClose: () => void;
  onToggle: (index: number) => void;
  onSaveReflection: (value: string) => void;
  onRenameHabit: (index: number, title: string) => void;
}) {
  if (overlay.kind === 'guide') {
    return (
      <Sheet title="2-minute health guide" kicker="WELLNESS NOTE" onClose={onClose}>
        {guideSteps.map((item) => (
          <View key={item.step} style={styles.article}>
            <Text style={styles.articleStep}>STEP {item.step}</Text>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleBody}>{item.body}</Text>
          </View>
        ))}
        <Text style={styles.footerNote}>Educational only. This is not a treatment plan.</Text>
      </Sheet>
    );
  }

  if (overlay.kind === 'habit') {
    const habit = state.habits[overlay.index];
    return (
      <Sheet title={habit.title} kicker={habit.when} onClose={onClose}>
        <View style={styles.article}>
          <Text style={styles.articleTitle}>Why this helps</Text>
          <Text style={styles.articleBody}>{habit.why}</Text>
        </View>
        <Button
          label={habit.done ? 'Mark incomplete' : 'Mark complete'}
          onPress={() => {
            onToggle(overlay.index);
            onClose();
          }}
        />
      </Sheet>
    );
  }

  if (overlay.kind === 'reflection') {
    return <ReflectionSheet value={state.reflection} onClose={onClose} onSave={onSaveReflection} />;
  }

  if (overlay.kind === 'settings') {
    const copy = settingsCopy[overlay.topic];
    return (
      <Sheet title={copy.title} kicker="YOUR SPACE" onClose={onClose}>
        <View style={styles.article}>
          <Text style={styles.articleBody}>{copy.body}</Text>
        </View>
      </Sheet>
    );
  }

  if (overlay.kind === 'editHabits') {
    return (
      <Sheet title="Edit daily rhythm" kicker="TODAY" onClose={onClose}>
        {state.habits.map((habit, index) => (
          <HabitEditor key={habit.id} habit={habit} onRename={(title) => onRenameHabit(index, title)} />
        ))}
        <Text style={styles.footerNote}>Keep actions small enough that a busy day can still hold them.</Text>
      </Sheet>
    );
  }

  return (
    <Sheet title={state.name} kicker="PROFILE" onClose={onClose}>
      <View style={styles.article}>
        <Text style={styles.articleTitle}>{headlineFor(state)}</Text>
        <Text style={styles.articleBody}>Day {state.day} of a 30-day focus. Your choices stay on this device in the prototype.</Text>
      </View>
    </Sheet>
  );
}
