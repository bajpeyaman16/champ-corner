import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import crypto from "crypto";

// Razorpay REST API (no SDK needed — keeps Worker runtime happy)
const RZP_BASE = "https://api.razorpay.com/v1";

function basicAuth() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new Error("Razorpay keys not configured");
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export const getRazorpayKey = createServerFn({ method: "GET" }).handler(async () => {
  const id = process.env.RAZORPAY_KEY_ID;
  if (!id) throw new Error("RAZORPAY_KEY_ID missing");
  return { keyId: id };
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        amount: z.number().int().min(100).max(10000000), // paise
        eventId: z.string().min(1).max(120),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const res = await fetch(`${RZP_BASE}/orders`, {
      method: "POST",
      headers: {
        Authorization: basicAuth(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: "INR",
        receipt: `evt_${data.eventId}_${Date.now()}`.slice(0, 40),
      }),
    });
    const json = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      throw new Error(`Razorpay order failed: ${JSON.stringify(json)}`);
    }
    return { orderId: json.id as string, amount: json.amount as number };
  });

export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        orderId: z.string().min(1),
        paymentId: z.string().min(1),
        signature: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("RAZORPAY_KEY_SECRET missing");
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");
    const ok =
      expected.length === data.signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(data.signature));
    if (!ok) throw new Error("Invalid payment signature");
    return { verified: true };
  });
