import { db } from "@/firebaseconfig";
import { doc, getDoc, query } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { inAppNotify } from "../sendalert/inapp_notify";
import { DocumentData } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const jsonBody = await req.json();

  var members: any = await getDoc(
    doc(db, "trackable_users", jsonBody["parentId"])
  ).then((m) => m.data());

  for (let i = 0; i < members["members"].length; i++) {
    const memberId = members["members"][i];
    var userInfo = await getDoc(doc(db, "users", memberId)).then((m) =>
      m.data()
    );
    await inAppNotify(
      userInfo!["notificationToken"],
      "Message from your Tracker",
      jsonBody["message"],
      "#FFFFFF"
    );
  }

  return NextResponse.json({ message: "Message sent successfully!" });
}
