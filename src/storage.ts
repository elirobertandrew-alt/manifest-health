import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from './content';
import { Answers, emptyAnswers } from './onboardingModel';
import type { StepId } from './Onboarding';

const KEY = 'manifest-health-state-v2';
const DRAFT_KEY = 'manifest-health-onboarding-v2';
const LEGACY_KEYS = ['manifest-health-state-v1'];

export type Draft = { step: StepId; answers: Answers };

export async function loadState(): Promise<AppState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed?.name || !Array.isArray(parsed?.habits)) return null;
    // Tolerate states written by an older build of the app.
    return {
      ...parsed,
      answers: { ...emptyAnswers, ...(parsed.answers ?? {}) },
      reminder: parsed.reminder ?? '',
      committed: Boolean(parsed.committed),
      firstSessionDone: Boolean(parsed.firstSessionDone),
    };
  } catch {
    return null;
  }
}

export async function saveState(state: AppState | null): Promise<void> {
  try {
    if (!state) {
      await AsyncStorage.removeItem(KEY);
      return;
    }
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Prototype storage is best-effort.
  }
}

/** Keeps a half-finished onboarding so closing the app does not cost the answers. */
export async function loadDraft(): Promise<Draft | null> {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed?.step || !parsed?.answers) return null;
    return { step: parsed.step, answers: { ...emptyAnswers, ...parsed.answers } };
  } catch {
    return null;
  }
}

export async function saveDraft(draft: Draft | null): Promise<void> {
  try {
    if (!draft || draft.step === 'welcome') {
      await AsyncStorage.removeItem(DRAFT_KEY);
      return;
    }
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Prototype storage is best-effort.
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KEY, DRAFT_KEY, ...LEGACY_KEYS]);
  } catch {
    // Prototype storage is best-effort.
  }
}
