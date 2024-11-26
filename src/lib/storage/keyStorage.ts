const STORAGE_KEY = 'algorand_private_key';

export function storeAlgorandKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function getStoredAlgorandKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}