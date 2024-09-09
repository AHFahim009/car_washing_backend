/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import axios from "axios";

// Payment creation controller
const createPayment = asyncHandler(async (req, res) => {
  const { amount, customerName, customerEmail } = req.body;

  // if (!amount || !customerName || !customerEmail) {
  //   return sendResponse(res, {
  //     message: "All fields are required.",
  //     statusCode: 400, // Bad Request
  //     success: false,
  //     data: null,
  //   });
  // }

  const baseUrl = "http://localhost:8000/api/";

  const formData = {
    cus_name: customerName || "unknown",
    cus_email: customerEmail,
    cus_phone: "019312456",
    currency: "BDT",
    desc: "Online payment",
    amount,
    tran_id: `TRANS_${Date.now()}`,
    signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
    store_id: "aamarpaytest",
    success_url: `${baseUrl}success/callback`,
    fail_url: `${baseUrl}fail/callback`,
    cancel_url: `${baseUrl}cancel/callback`,

    type: "json", // This is required for JSON request
  };
  console.log("form ", formData);

  try {
    const { data } = await axios.post(
      "https://sandbox.aamarpay.com/jsonpost.php",
      formData
    );
    console.log(data);

    sendResponse(res, {
      message: "Payment request sent successfully.",
      data: { redirectUrl: data.payment_url },
      statusCode: 200, // OK
      success: true,
    });
  } catch (error) {
    console.error("Payment request error:", error);
    sendResponse(res, {
      message: "Failed to create payment request. Please try again later.",
      statusCode: 500,
      success: false,
      data: null,
    });
  }
});

// Success callback handler
const handleSuccessCallback = asyncHandler(async (req, res) => {
  const { pay_status, pg_txnid, amount } = req.body; // Use req.query for query parameters

  if (pay_status === "Successful") {
    // Send success response or save booking data
    res.redirect(
      `https://car-washing-frontend-git-main-ahfahim009s-projects.vercel.app/payment-callback?status=${pay_status}&tran_id=${pg_txnid}&amount=${amount}`
    );
  } else {
    // Handle other statuses if needed
    res.redirect(
      `https://car-washing-frontend-git-main-ahfahim009s-projects.vercel.app/payment-callback/?status=${pay_status}&tran_id=${pg_txnid}&amount=${amount}`
    );
  }
});

// Failure callback handler
const handleFailCallback = asyncHandler(async (req, res) => {
  const {
    pay_status,
    cus_name,
    cus_phone,
    cus_email,
    currency,
    pay_time,
    amount,
  } = req.body;
  console.error("Payment failed:", { amount });

  return sendResponse(res, {
    message:
      "Payment failed. Please check your payment details or try again later.",
    statusCode: 400,
    success: false,
    data: {
      amountAttempted: amount,
    },
  });
});

// Cancellation callback handler
const handleCancelCallback = asyncHandler(async (req, res) => {
  const { status, tran_id, amount } = req.body;

  return sendResponse(res, {
    message: "Payment was canceled. If this was an error, please try again.",
    statusCode: 200,
    success: true,
    data: {
      transactionId: tran_id,
      amountAttempted: amount,
      paymentStatus: status,
    },
  });
});

export const AamarPayControllers = {
  createPayment,
  handleSuccessCallback,
  handleFailCallback,
  handleCancelCallback,
};
