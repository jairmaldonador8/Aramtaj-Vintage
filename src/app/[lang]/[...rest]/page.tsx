import { notFound } from "next/navigation";

/** Unknown paths under /en or /es render the localized not-found page with the site's layout. */
export const instant = false; // nothing to prerender: always resolved at request time

export default function CatchAll() {
  notFound();
}
