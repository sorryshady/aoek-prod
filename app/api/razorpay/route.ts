import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const generateSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables.",
    );
  }
  return crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  try {
    const { action, payload } = await request.json();

    if (!action || !payload) {
      return NextResponse.json(
        { error: "Action and payload are required in the request body." },
        { status: 400 },
      );
    }

    switch (action) {
      case "create-order": {
        const { amount } = payload;

        if (typeof amount !== "number" || amount <= 0) {
          return NextResponse.json(
            {
              error:
                "Invalid amount provided. Amount must be a positive number.",
            },
            { status: 400 },
          );
        }

        const order = await razorpay.orders.create({
          amount: amount * 100, // Convert to paise
          currency: "INR",
          receipt: "receipt_" + Math.random().toString(36).substring(7),
        });

        return NextResponse.json({ orderId: order.id }, { status: 200 });
      }

      case "verify-payment": {
        const { orderCreationId, razorpayPaymentId, razorpaySignature } =
          payload;

        if (!orderCreationId || !razorpayPaymentId || !razorpaySignature) {
          return NextResponse.json(
            {
              error:
                "orderCreationId, razorpayPaymentId, and razorpaySignature are required.",
            },
            { status: 400 },
          );
        }

        const signature = generateSignature(orderCreationId, razorpayPaymentId);

        if (signature !== razorpaySignature) {
          return NextResponse.json(
            { message: "Payment verification failed", isOk: false },
            { status: 400 },
          );
        }

        return NextResponse.json(
          { message: "Payment verified successfully", isOk: true },
          { status: 200 },
        );
      }

      case "retrieve-payment-details": {
        const { paymentId } = payload;

        if (!paymentId) {
          return NextResponse.json(
            { error: "paymentId is required to fetch payment details." },
            { status: 400 },
          );
        }

        const payment = await razorpay.payments.fetch(paymentId);
        return NextResponse.json({ payment }, { status: 200 });
      }

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action provided. Supported actions: create-order, verify-payment, retrieve-payment-details.",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Error in Razorpay API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
