const STORAGE_KEY = 'algorand_key';
const STORAGE_MNEMONIC_KEY = 'algorand_mnemonic';

export function storeAlgorandKey(address: string, mnemonic: string): void {
  console.log("Storing Algorand key for address:", address);
  localStorage.setItem(STORAGE_KEY, address);
  localStorage.setItem(STORAGE_MNEMONIC_KEY, mnemonic);
}

export function getStoredAlgorandKey(): string | null {
  const address = localStorage.getItem(STORAGE_KEY);
  console.log("Retrieved stored Algorand address:", address);
  return address;
}

export function getStoredMnemonic(): string | null {
  const mnemonic = localStorage.getItem(STORAGE_MNEMONIC_KEY);
  console.log("Retrieved stored mnemonic");
  return mnemonic;
}

export function clearStoredAlgorandKey(): void {
  console.log("Clearing stored Algorand credentials");
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_MNEMONIC_KEY);
}