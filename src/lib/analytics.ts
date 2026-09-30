type Props = Record<string, string | number | boolean | null | undefined>;

/**
 * Thin analytics interface. Console + localStorage stub for now.
 * Swap the body later for a real provider without touching call sites.
 */
export function track(event: string, props: Props = {}): void {
  const payload = {
    event,
    props,
    ts: new Date().toISOString(),
  };

  if (typeof window === "undefined") {
    console.info("[genzlab:track]", payload);
    return;
  }

  try {
    console.info("[genzlab:track]", payload);
    const key = "genzlab_analytics";
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
    const next = [...existing, payload].slice(-100);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
}
