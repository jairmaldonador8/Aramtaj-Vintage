import "server-only";
import { cacheLife } from "next/cache";

/**
 * USD→MXN rate for the optional peso display. Prices are set in USD; pesos are
 * an approximate conversion shown only when the visitor picks MXN.
 *
 * Source: Frankfurter (free, no key; central-bank reference rates), refreshed
 * daily. Fallback: USD_MXN_RATE env var. If neither is available, MXN is hidden.
 */
export async function getUsdMxnRate(): Promise<number | null> {
  "use cache";
  cacheLife("days");
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?base=USD&symbols=MXN", {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const rate = Number((await res.json())?.rates?.MXN);
      if (rate > 5 && rate < 60) return rate;
    }
  } catch {
    // network unavailable — use the fallback below
  }
  const fallback = Number(process.env.USD_MXN_RATE);
  return fallback > 5 && fallback < 60 ? fallback : null;
}
