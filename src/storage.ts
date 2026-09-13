import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from './content';

const KEY = 'manifest-health-state-v1';

export async function loadState(): Promise<AppState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed?.name || !parsed?.habits) return null;
    return parsed;
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
