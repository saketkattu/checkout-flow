/** Simulates realistic government API network latency */
export function mockDelay(ms?: number): Promise<void> {
  const delay = ms ?? 800 + Math.random() * 700;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
