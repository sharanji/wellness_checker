import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(res: NextRequest) {
  const url = "https://graph.facebook.com/v17.0/116480298220877/messages";
  const token =
    "EAAGMpaYCvZCoBOwmULQjZBDwt1WZBfFMerRXMl6hRbNCtJpMRAlBZAv33ln04P5C8uu6mLnuZCsrZA7LOHVbQlG6B9jHzwfvkh6ZAoagri7HPakw5kMIDmKze5DVbbo7rAMkBnED3nZCzE5Nx5ZBwsjcu2ilLYi5pHNdbZBdtMOzFkcwdWA6q7uGZC5A3GpjshsOZA6EspIBPB7ytdaMUyNIE0gZD";
  var waId = "+919910008462";

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
      body: "Hello Praveen , ```Abishek``` is Inactive for _3 Hours and 7 Minutes_.\nClick the link below to See detailed analytics.\nhttp://sharanji.vercelapp.com/imok?123",
    },
  };

  try {
    var response = await axios.post(url, data, { headers });
    return NextResponse.json({ msg: "msg sent", response: response.data });
  } catch (error: any) {
    return NextResponse.json({ msg: error.toString() });
  }
}
