import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  getDocs,
  where,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseconfig";
import { Timestamp } from "firebase-admin/firestore";
import { notifyParent } from "./notify_parents";

export async function GET(req: NextRequest) {
  const timeNow = Date.now();
  const threeHoursAgo = new Date(timeNow - 3 * 3600 * 1000);

  const allUsersQuery = query(
    collection(db, "users"),
    where("last_active", "<", threeHoursAgo),
    where("last_notifed", ">", threeHoursAgo)
  );

  const allUsers = await getDocs(allUsersQuery).then((users) => [
    ...users.docs.map((u) => {
      return {
        id: u.id,
        mode: u.data()["mode_name"],
        name: u.data()["name"],
        lastActive: u.data()["last_active"],
      };
    }),
  ]);

  for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
    var currentUser = allUsers[userIndex];

    const user = currentUser;
    var userId = user.id; //"NAOd8lfxMxanusqpBunEj3SjU922";
    if (
      user.mode == "Daily Routine" &&
      user.lastActive.toDate().getTime() < timeNow - 3 * 3600 * 1000
    ) {
      var inActiveDuration = formatDuration(user.lastActive, timeNow);
      await updateDoc(doc(db, "users", userId), {
        last_notifed: serverTimestamp(),
      });

      await notifyParent(user, inActiveDuration);
    }
  }

  return NextResponse.json({ message: "perfect" });
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
