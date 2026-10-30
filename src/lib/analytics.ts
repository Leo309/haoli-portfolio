import { track } from "@vercel/analytics";

// The handful of actions that tell Hao whether the site is doing its job
export type EventName =
  | "work_with_me_click"
  | "resume_click"
  | "contact_email_copy"
  | "contact_email_open"
  | "ask_open"
  | "ask_question";

export function trackEvent(name: EventName, props?: Record<string, string>): void {
  // Custom events need a paid Vercel plan; on Hobby this is a harmless no-op
  track(name, props);
}
