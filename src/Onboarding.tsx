import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from './Button';
import { GoalKey, goalCopy, goals } from './content';
import { styles } from './theme';

function Progress({ step }: { step: number }) {
  return (
    <View style={styles.progressRow} accessibilityLabel={`Onboarding step ${step + 1} of 4`}>
      {[0, 1, 2, 3].map((item) => (
        <View key={item} style={[styles.progressPill, item <= step && styles.progressActive]} />
      ))}
    </View>
  );
}

export function Onboarding({
  onFinish,
  onSkip,
}: {
  onFinish: (goal: GoalKey, name: string) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<GoalKey>('energy');
  const [name, setName] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.onboarding}>
        <View style={styles.brandRow}>
          <View style={styles.logoMark}><View style={styles.logoDot} /></View>
          <Text style={styles.brand}>MANIFEST HEALTH</Text>
          <Text style={styles.stepLabel}>{step + 1}/4</Text>
        </View>
        <Progress step={step} />

        {step === 0 && (
          <View style={styles.flexBody}>
            <View style={styles.heroArt}>
              <View style={styles.orbitLarge} />
              <View style={styles.orbitSmall} />
              <View style={styles.heroCircle}><Text style={styles.heroSymbol}>✦</Text></View>
              <View style={[styles.spark, { top: 24, left: 40 }]} />
              <View style={[styles.spark, { right: 48, bottom: 35 }]} />
            </View>
            <Text style={styles.eyebrow}>YOUR HEALTH, WITH INTENTION</Text>
            <Text style={styles.display}>Picture it. Plan it. Live it.</Text>
            <Text style={styles.lead}>Turn the way you want to feel into small, science-informed actions you can actually keep.</Text>
            <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skip}>
              <Text style={styles.skipText}>I already have a plan</Text>
            </Pressable>
          </View>
        )}

        {step === 1 && (
          <ScrollView style={styles.flexBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPad}>
            <Text style={styles.eyebrow}>CHOOSE YOUR FOCUS</Text>
            <Text style={styles.title}>What do you want to gain?</Text>
            <Text style={styles.lead}>Pick what would make the biggest difference right now. You can change this later.</Text>
            <View style={styles.choiceList}>
              {goals.map((item) => (
                <Pressable
                  key={item.key}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: goal === item.key }}
                  accessibilityLabel={`${item.title}. ${item.copy}`}
                  onPress={() => setGoal(item.key)}
                  style={[styles.choice, goal === item.key && styles.choiceSelected]}
                >
                  <View style={[styles.choiceIcon, goal === item.key && styles.choiceIconSelected]}>
                    <Text style={[styles.choiceIconText, goal === item.key && styles.whiteText]}>{item.icon}</Text>
                  </View>
                  <View style={styles.choiceCopy}>
                    <Text style={styles.choiceTitle}>{item.title}</Text>
                    <Text style={styles.choiceBody}>{item.copy}</Text>
                  </View>
                  <View style={[styles.radio, goal === item.key && styles.radioSelected]}>
                    {goal === item.key && <View style={styles.radioDot} />}
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}

        {step === 2 && (
          <View style={styles.flexBody}>
            <Text style={styles.eyebrow}>MAKE IT YOURS</Text>
            <Text style={styles.title}>What should we call you?</Text>
            <Text style={styles.lead}>A personal plan feels better when it sounds like it belongs to you.</Text>
            <Text style={styles.inputLabel}>FIRST NAME</Text>
            <TextInput
              accessibilityLabel="First name"
              autoCapitalize="words"
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#94A1B3"
              style={styles.input}
              value={name}
            />
            <View style={styles.promiseCard}>
              <Text style={styles.promiseIcon}>✓</Text>
              <View style={styles.promiseCopy}>
                <Text style={styles.promiseTitle}>Private by design</Text>
                <Text style={styles.promiseBody}>This prototype keeps your choices on this device.</Text>
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <ScrollView style={styles.flexBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPad}>
            <Text style={styles.eyebrow}>YOUR STARTING PLAN</Text>
            <Text style={styles.title}>Small steps. Real momentum.</Text>
            <Text style={styles.lead}>We turned your intention into a simple daily rhythm.</Text>
            <View style={styles.planHero}>
              <Text style={styles.planLabel}>YOUR NORTH STAR</Text>
              <Text style={styles.planTitle}>{goalCopy[goal].headline}</Text>
              <View style={styles.planRule} />
              <Text style={styles.planQuote}>“I am becoming someone who protects their health, one choice at a time.”</Text>
            </View>
            <View style={styles.miniRow}>
              <View style={styles.miniCard}>
                <Text style={styles.miniNumber}>01</Text>
                <Text style={styles.miniTitle}>Daily action</Text>
                <Text style={styles.miniBody}>{goalCopy[goal].habit}</Text>
              </View>
              <View style={styles.miniCard}>
                <Text style={styles.miniNumber}>02</Text>
                <Text style={styles.miniTitle}>Quick check-in</Text>
                <Text style={styles.miniBody}>Notice energy and mood</Text>
              </View>
            </View>
            <Text style={styles.disclaimer}>
              Manifest Health supports general wellness and is not medical advice. Talk with a qualified professional about health concerns.
            </Text>
          </ScrollView>
        )}

        <View style={styles.bottomActions}>
          {step > 0 && (
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => setStep((value) => value - 1)} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
          )}
          <View style={styles.actionFill}>
            <Button
              label={step === 3 ? 'Open my dashboard' : 'Continue'}
              onPress={() => (step === 3 ? onFinish(goal, name.trim() || 'Alex') : setStep((value) => value + 1))}
            />
          </View>
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
