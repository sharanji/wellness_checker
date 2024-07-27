import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function whatsappNotify(
  waId: string,
  userName: string,
  parentName: string,
  duration: string
) {
  const url = "https://graph.facebook.com/v17.0/116480298220877/messages";
  const token =
    "EAAGMpaYCvZCoBO0O3mIAbVvtsVnJdOlmJanVmmwyZBN3gLe6SbHorBF7RVnIPju0qtK0oLI0vNWmLBXv2X0ZAMG0ZABPPPyMCBYcMTLAsDUkhM71H5ymh2TMNMGOJICrY6VD7VdYLokWhdpljggvaiG9jMATdgG4ZAbHcAjW6xvbzOyXhl1FHUB1kjFqzljVhZCpoK7nwNTEUBr8NmYmAZD";
  waId = "+91" + waId;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: waId,
    type: "text",
    text: {
      preview_url: false,
      body:
        "Hello " +
        parentName +
        " ```" +
        userName +
        "``` is Inactive for _" +
        duration +
        "_.\nClick the link below to See detailed analytics.\nhttp://sharanji.vercelapp.com/imok?123",
    },
  };

  try {
    await axios.post(url, data, { headers });
  } catch (error: any) {
    console.log(error);
  }
}
