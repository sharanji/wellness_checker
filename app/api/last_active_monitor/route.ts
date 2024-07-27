import { NextRequest, NextResponse } from "next/server";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/firebaseconfig";
import { Timestamp } from "firebase-admin/firestore";
import { notifyParent } from "./notify_parents";

export async function GET(req: NextRequest) {
  const timeNow = Date.now();

  const allUsersQuery = query(collection(db, "users"));

  const allUsers = await getDocs(allUsersQuery).then((users) => [
    ...users.docs.map((u) => {
      return {
        id: u.id,
        mode: u.data()["mode_name"],
        name: u.data()["name"],
        lastActive: u.data()["last_active"],
        token: u.data()["notificationToken"],
        whatsappNumber: u.data()["whatsappNumber"],
      };
    }),
  ]);

  var data: any = [];

  for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
    var currentUser = allUsers[userIndex];

    const user = currentUser;
    var userId = user.id; //"NAOd8lfxMxanusqpBunEj3SjU922";
    if (
      user.mode == "Daily Routine" &&
      user.lastActive.toDate().getTime() < timeNow - 3 * 3600 * 1000
    ) {
      var inActiveDuration = formatDuration(user.lastActive, timeNow);

      data.push(await notifyParent(user, inActiveDuration));
    }
  }

  return NextResponse.json(data);
}

function formatDuration(a: Timestamp, b: number): string {
  var durationMillis = b - a.toDate().getTime();

  let seconds: number = Math.floor(durationMillis / 1000) % 60;
  let minutes: number = Math.floor(durationMillis / (1000 * 60)) % 60;
  let hours: number = Math.floor(durationMillis / (1000 * 60 * 60));

  return `${padTo2Digits(hours)} Hours ${padTo2Digits(
    minutes
  )} Minutes ${padTo2Digits(seconds)} seconds`;
}

function padTo2Digits(num: number): string {
  return num.toString().padStart(2, "0");
}
