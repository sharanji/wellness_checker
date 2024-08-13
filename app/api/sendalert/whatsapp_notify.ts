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
    "EAAGMpaYCvZCoBO511WVp66P4JTk8gQ9Hk5tlFnwnSJfQGDoXiF3zhyY8zJxRzMFQ0FtRzkyZCAd9minuVwuDKVSdqIM6gaZCkjsMVxTxmNH8efvjU5DR5R9w3xs2Eyn54JZCZByqjsTK1xZCAED9aHLnG8l2XvgyPFhRpxZBdH4kULmZCMuQLCEECT4cXOi2NfGFu5lXuomYOCZAdvsXqkA8ZD";

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
        " ,  ```" +
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
