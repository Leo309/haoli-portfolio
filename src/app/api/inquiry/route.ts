import { Resend } from "resend";
import { getClientIp } from "@/lib/client-ip";
import { formatInquiryEmail, validateInquiry } from "@/lib/inquiry";
import { createRateLimiter } from "@/lib/rate-limit";
import { links } from "@/lib/site";

// 5 inquiries per IP per hour is plenty for a person and stops form spam loops
const limiter = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

// When email can't go out, the visitor still gets a way to reach Hao
function unavailable() {
  return Response.json(
    { error: "The form couldn't send right now. Please email me directly.", fallbackEmail: links.email },
    { status: 503 }
  );
}

export async function POST(req: Request) {
  if (!limiter.check(getClientIp(req.headers)).ok) {
    return Response.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ errors: { need: "Something went wrong reading the form." } }, { status: 400 });
  }

  const result = validateInquiry(body);
  if (!result.ok) return Response.json({ errors: result.errors }, { status: 400 });

  // Pretend success so bots don't learn the honeypot exists
  if (result.isSpam) return Response.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  if (!apiKey || !from) return unavailable();

  const { subject, text } = formatInquiryEmail(result.data);
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: process.env.INQUIRY_TO_EMAIL || links.email,
      replyTo: result.data.email,
      subject,
      text,
    });
    // Resend reports API failures (e.g. an unverified domain) as a value, not an exception
    if (error) {
      console.error("Inquiry email failed:", error);
      return unavailable();
    }
  } catch (error) {
    console.error("Inquiry email failed:", error);
    return unavailable();
  }

  return Response.json({ ok: true });
}
