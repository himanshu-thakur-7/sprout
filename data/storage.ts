/**
 * Thin JSON persistence layer over AsyncStorage. Everything the app
 * persists goes through here — no network calls anywhere in this module,
 * which is what keeps the app offline-by-default.
 *
 * Chose AsyncStorage over MMKV for this app: it works out of the box in
 * Expo Go with zero native config, and this app's data volume (a handful
 * of habits/circles, a few months of daily completions) is nowhere near
 * where AsyncStorage's async-JSON overhead would matter. If this ever
 * needs synchronous reads or grows much larger, swap the two functions
 * below for `react-native-mmkv` (requires a development build) — nothing
 * outside this file needs to change.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const NAMESPACE = 'quiet-progress:v1:';

export async function readJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(NAMESPACE + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    console.warn(`[storage] failed to read "${key}"`, err);
    return null;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(NAMESPACE + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] failed to write "${key}"`, err);
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(NAMESPACE + key);
  } catch (err) {
    console.warn(`[storage] failed to remove "${key}"`, err);
  }
}

export const STORAGE_KEYS = {
  habits: 'habits',
  completions: 'completions',
  circles: 'circles',
} as const;
