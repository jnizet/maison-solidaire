export function todayToIso() {
  return new Date().toISOString().slice(0, 10);
}
