import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { Option, Projection } from './onboardingModel';
import { colors } from './theme';
import { onb } from './onboardingTheme';

/* ------------------------------------------------------------------ *
 * Motion preference — honoured by every animation in the flow.
 * ------------------------------------------------------------------ */

export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (alive) setReduce(value);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => setReduce(Boolean(value)));
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);
  return reduce;
}

/** Cross-fades and slides each step in. Keyed by step id so it replays on change. */
export function StepTransition({ stepKey, reduceMotion, children }: { stepKey: string; reduceMotion: boolean; children: React.ReactNode }) {
  const progress = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    progress.setValue(reduceMotion ? 1 : 0);
    if (reduceMotion) return;
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [stepKey, reduceMotion, progress]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: progress,
        transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ *
 * Progress
 * ------------------------------------------------------------------ */

export function ProgressTrack({
  ratio,
  leftLabel,
  rightLabel,
  reduceMotion,
}: {
  ratio: number;
  leftLabel: string;
  rightLabel: string;
  reduceMotion: boolean;
}) {
  const [width, setWidth] = useState(0);
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const target = Math.max(0, Math.min(1, ratio)) * width;
    if (reduceMotion || width === 0) {
      fill.setValue(target);
      return;
    }
    const animation = Animated.timing(fill, {
      toValue: target,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [ratio, width, reduceMotion, fill]);

  return (
    <View style={onb.trackWrap}>
      <View
        style={onb.track}
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
        accessibilityRole="progressbar"
        accessibilityValue={{ now: Math.round(ratio * 100), min: 0, max: 100 }}
      >
        <Animated.View style={[onb.trackFill, { width: fill }]} />
      </View>
      <View style={onb.trackLabelRow}>
        <Text style={onb.trackLabel}>{leftLabel}</Text>
        <Text style={onb.trackLabel}>{rightLabel}</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Choice inputs
 * ------------------------------------------------------------------ */

export function OptionRow({
  option,
  selected,
  multi = false,
  onPress,
}: {
  option: Option;
  selected: boolean;
  multi?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={option.hint ? `${option.label}. ${option.hint}` : option.label}
      onPress={onPress}
      style={({ pressed }) => [onb.option, selected && onb.optionOn, pressed && { opacity: 0.85 }]}
    >
      {option.icon ? (
        <View style={[onb.optionIcon, selected && onb.optionIconOn]}>
          <Text style={[onb.optionIconText, selected && onb.optionIconTextOn]}>{option.icon}</Text>
        </View>
      ) : null}
      <View style={onb.optionCopy}>
        <Text style={onb.optionLabel}>{option.label}</Text>
        {option.hint ? <Text style={onb.optionHint}>{option.hint}</Text> : null}
      </View>
      <View style={[onb.mark, multi && onb.markSquare, selected && onb.markOn]}>
        {selected ? multi ? <Text style={onb.markGlyph}>✓</Text> : <View style={onb.markDot} /> : null}
      </View>
    </Pressable>
  );
}

export function GridPicker<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<Option & { key: T }>;
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <View style={onb.grid}>
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={option.hint ? `${option.label}. ${option.hint}` : option.label}
            onPress={() => onChange(option.key)}
            style={({ pressed }) => [onb.gridItem, selected && onb.gridItemOn, pressed && { opacity: 0.85 }]}
          >
            <Text style={[onb.gridIcon, selected && { color: colors.blue }]}>{option.icon}</Text>
            <Text style={onb.gridLabel}>{option.label}</Text>
            {option.hint ? <Text style={onb.gridHint}>{option.hint}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/** A 1-to-n band picker with a caption that explains the selected band. */
export function ScalePicker({
  bands,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  bands: Option[];
  value: number;
  onChange: (index: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  const active = bands[value] ?? bands[0];
  return (
    <View>
      <View style={onb.scaleRow}>
        {bands.map((band, index) => {
          const selected = index === value;
          return (
            <Pressable
              key={band.key}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${band.label}. ${band.hint ?? ''}`}
              onPress={() => onChange(index)}
              style={({ pressed }) => [onb.scaleCell, selected && onb.scaleCellOn, pressed && { opacity: 0.85 }]}
            >
              <Text style={[onb.scaleCellNum, selected && onb.scaleCellNumOn]}>{index + 1}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={onb.trackLabelRow}>
        <Text style={onb.trackLabel}>{lowLabel}</Text>
        <Text style={onb.trackLabel}>{highLabel}</Text>
      </View>
      <View style={[onb.scaleCaption, { marginTop: 14 }]} accessibilityLiveRegion="polite">
        <Text style={onb.scaleCaptionTitle}>{active.label}</Text>
        {active.hint ? <Text style={onb.scaleCaptionBody}>{active.hint}</Text> : null}
      </View>
    </View>
  );
}

export function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <View style={onb.chipRow}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={`Remind me at ${option}`}
            onPress={() => onChange(option)}
            style={({ pressed }) => [onb.chip, selected && onb.chipOn, pressed && { opacity: 0.85 }]}
          >
            <Text style={[onb.chipText, selected && onb.chipTextOn]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Hold-to-commit — effort makes the promise mean something.
 * An always-visible tap alternative keeps it usable without a steady hold.
 * ------------------------------------------------------------------ */

export function HoldToCommit({
  done,
  onDone,
  reduceMotion,
}: {
  done: boolean;
  onDone: () => void;
  reduceMotion: boolean;
}) {
  const [width, setWidth] = useState(0);
  const fill = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    if (done) fill.setValue(width);
  }, [done, width, fill]);

  const start = () => {
    // width <= 0 means onLayout has not landed yet; committing here would fire instantly.
    if (done || width <= 0) return;
    setHolding(true);
    Animated.timing(fill, {
      toValue: width,
      duration: reduceMotion ? 500 : 1500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      setHolding(false);
      if (finished) onDone();
    });
  };

  const cancel = () => {
    if (done) return;
    setHolding(false);
    fill.stopAnimation(() => {
      Animated.timing(fill, { toValue: 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
    });
  };

  return (
    <View>
      <View style={onb.holdWrap} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        <Animated.View style={[onb.holdFill, { width: fill }]} />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: done }}
          accessibilityLabel={done ? 'Committed' : 'Press and hold to commit'}
          accessibilityHint={done ? undefined : 'Hold for one and a half seconds, or use the commit button below'}
          onPressIn={start}
          onPressOut={cancel}
          style={onb.holdInner}
        >
          <Text style={[onb.holdLabel, done && onb.holdLabelOn]}>
            {done ? '✓  I am committed' : holding ? 'Keep holding…' : 'Press and hold to commit'}
          </Text>
          <Text style={[onb.holdSub, done && onb.holdSubOn]}>
            {done ? 'Day 1 starts now' : 'One and a half seconds — long enough to mean it'}
          </Text>
        </Pressable>
      </View>
      {!done && (
        <Pressable accessibilityRole="button" onPress={onDone} style={onb.ghost}>
          <Text style={onb.ghostText}>Commit without holding</Text>
        </Pressable>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * The loader — real work, named out loud, so the result feels earned.
 * ------------------------------------------------------------------ */

export function Analyzing({
  tasks,
  onDone,
  reduceMotion,
}: {
  tasks: string[];
  onDone: () => void;
  reduceMotion: boolean;
}) {
  const [percent, setPercent] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  const settled = useRef(false);

  useEffect(() => {
    const total = reduceMotion ? 1200 : 3600;
    const tick = 60;
    const started = Date.now();
    const timer = setInterval(() => {
      const ratio = Math.min(1, (Date.now() - started) / total);
      setPercent(Math.round(ratio * 100));
      if (ratio >= 1 && !settled.current) {
        settled.current = true;
        clearInterval(timer);
        setTimeout(onDone, 420);
      }
    }, tick);
    return () => clearInterval(timer);
  }, [onDone, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, spin]);

  const doneCount = Math.min(tasks.length, Math.floor((percent / 100) * tasks.length + 0.0001));

  return (
    <View style={onb.analyzeWrap}>
      <View style={onb.dialOuter}>
        <Animated.View
          style={[
            onb.dialArc,
            { transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] },
          ]}
        />
        <Text style={onb.dialValue}>{percent}%</Text>
        <Text style={onb.dialCaption}>BUILDING</Text>
      </View>
      <Text style={onb.analyzeTitle}>Turning your answers into a plan</Text>
      <View accessibilityLiveRegion="polite" style={{ alignSelf: 'stretch' }}>
        {tasks.map((task, index) => {
          const complete = index < doneCount;
          return (
            <View key={task} style={onb.taskRow}>
              <View style={[onb.taskDot, complete && onb.taskDotOn]}>
                {complete ? <Text style={onb.taskDotGlyph}>✓</Text> : null}
              </View>
              <Text style={[onb.taskText, complete && onb.taskTextOn]} numberOfLines={2}>
                {task}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Projection
 * ------------------------------------------------------------------ */

export function ProjectionChart({ projection }: { projection: Projection }) {
  const max = Math.max(...projection.map((point) => point.value), 100);
  return (
    <View style={onb.chart} accessibilityLabel={projection.map((p) => `${p.week}: ${p.value}`).join(', ')}>
      {projection.map((point, index) => (
        <View key={point.week} style={onb.chartCol}>
          <Text style={[onb.chartTick, { marginTop: 0, marginBottom: 6, fontWeight: '900' }]}>{point.value}</Text>
          <View
            style={[
              onb.chartBar,
              { height: Math.max(6, (point.value / max) * 84) },
              index === 0 && onb.chartBarNow,
              index === projection.length - 1 && onb.chartBarLast,
            ]}
          />
          <Text style={onb.chartTick}>{point.week}</Text>
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * First real action — a guided minute, before any dashboard.
 * ------------------------------------------------------------------ */

const PHASES: Array<{ label: string; seconds: number; scale: number }> = [
  { label: 'Breathe in', seconds: 4, scale: 1 },
  { label: 'Hold', seconds: 2, scale: 1 },
  { label: 'Breathe out', seconds: 6, scale: 0.68 },
];

export function BreathSession({
  seconds = 60,
  onComplete,
  reduceMotion,
}: {
  seconds?: number;
  onComplete: () => void;
  reduceMotion: boolean;
}) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const scale = useRef(new Animated.Value(0.68)).current;
  const deadline = useRef<number | null>(null);
  const finished = remaining <= 0;

  // Deadline-based clock: a throttled or backgrounded tab still reports the true
  // remaining time, instead of drifting the way a decrementing counter does.
  useEffect(() => {
    if (!running || finished) {
      deadline.current = null;
      return;
    }
    deadline.current = Date.now() + remaining * 1000;
    const tick = () => {
      if (deadline.current == null) return;
      setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    };
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
    // `remaining` is intentionally omitted: it is the seed for the deadline, and
    // re-running on every tick would keep pushing the deadline forward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, finished]);

  // Phase is derived from the clock rather than tracked by its own timer, so the
  // label can never drift out of sync with the countdown.
  const elapsed = seconds - remaining;
  const cycle = PHASES.reduce((total, item) => total + item.seconds, 0);
  const position = elapsed % cycle;
  let phase = 0;
  let boundary = 0;
  for (let index = 0; index < PHASES.length; index += 1) {
    boundary += PHASES[index].seconds;
    if (position < boundary) {
      phase = index;
      break;
    }
  }

  useEffect(() => {
    if (!running || finished || reduceMotion) return;
    const current = PHASES[phase];
    Animated.timing(scale, {
      toValue: current.scale,
      duration: current.seconds * 1000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [phase, running, finished, reduceMotion, scale]);

  useEffect(() => {
    if (finished && running) setRunning(false);
  }, [finished, running]);

  // The session is logged the moment it actually finishes — the footer CTA then
  // just moves on, rather than asking the user to confirm work they already did.
  const reported = useRef(false);
  useEffect(() => {
    if (finished && !reported.current) {
      reported.current = true;
      onComplete();
    }
  }, [finished, onComplete]);

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[onb.hero, { height: 250, marginBottom: 8 }]}>
        <View style={onb.orbitLarge} />
        <Animated.View style={[onb.heroCircle, { transform: [{ scale: reduceMotion ? 1 : scale }] }]}>
          <Text style={[onb.heroSymbol, { fontSize: 30, fontWeight: '900' }]}>
            {finished ? '✓' : running ? `${remaining}` : '✦'}
          </Text>
        </Animated.View>
      </View>
      <Text
        style={[onb.scaleCaptionTitle, { fontSize: 20, marginBottom: 6 }]}
        accessibilityLiveRegion="polite"
      >
        {finished ? 'That is one session done' : running ? PHASES[phase].label : 'A guided minute'}
      </Text>
      <Text style={[onb.lead, { textAlign: 'center', marginBottom: 14 }]}>
        {finished
          ? 'You did the thing the app is for, before you ever saw a dashboard.'
          : running
            ? 'Follow the circle. In for four, hold for two, out for six.'
            : 'Sixty seconds of slow breathing. No equipment, no setup.'}
      </Text>
      {!finished && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={running ? 'Pause the session' : 'Start the guided minute'}
          onPress={() => setRunning((value) => !value)}
          style={({ pressed }) => [onb.chip, { minWidth: 190, alignItems: 'center' }, running && onb.chipOn, pressed && { opacity: 0.85 }]}
        >
          <Text style={[onb.chipText, running && onb.chipTextOn]}>{running ? 'Pause' : 'Start the minute'}</Text>
        </Pressable>
      )}
      {finished && <View style={{ height: 4 }} />}
    </View>
  );
}
