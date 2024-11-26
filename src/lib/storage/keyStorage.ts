const STORAGE_KEY = 'algorand_key';
const STORAGE_MNEMONIC_KEY = 'algorand_mnemonic';

export function storeAlgorandKey(address: string, mnemonic: string): void {
  localStorage.setItem(STORAGE_KEY, address);
  localStorage.setItem(STORAGE_MNEMONIC_KEY, mnemonic);
}

export function getStoredAlgorandKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function getStoredMnemonic(): string | null {
  return localStorage.getItem(STORAGE_MNEMONIC_KEY);
}

export function clearStoredAlgorandKey(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_MNEMONIC_KEY);
}