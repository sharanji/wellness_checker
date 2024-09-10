import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  getDocs,
  where,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseconfig";
import { notifyParent } from "./notify_parents";

export async function GET(req: NextRequest) {
  const timeNow = Date.now();
  const threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

  const allUsersQuery = query(
    collection(db, "users"),
    where("last_active", "<", Timestamp.fromDate(threeHoursAgo))
  );

  const allUsers = await getDocs(allUsersQuery).then((users) => [
    ...users.docs.map((u) => {
      var userData = u.data();
      return {
        id: u.id,
        mode: userData["mode_name"],
        name: userData["name"],
        lastActive: userData["last_active"] as Timestamp,
        lastNotified: userData["last_notifed"] as Timestamp,
      };
    }),
  ]);

  var notifiedUsers: Array<string> = [];

  for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
    var currentUser = allUsers[userIndex];

    const user = currentUser;
    var userId = user.id;
    if (
      user.lastNotified == undefined ||
      (user.lastNotified.toDate().getTime() < threeHoursAgo.getTime() &&
        user.lastActive.toDate().getTime() < threeHoursAgo.getTime())
    ) {
      notifiedUsers.push(user.name);
      var inActiveDuration = formatDuration(user.lastActive, timeNow);
      await updateDoc(doc(db, "users", userId), {
        last_notifed: serverTimestamp(),
      });

      await notifyParent(user, inActiveDuration);
    }
  }

  return NextResponse.json({ message: "perfect", notifiedUsers });
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
