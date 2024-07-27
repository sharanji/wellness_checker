import { db } from "@/firebaseconfig";
import { Timestamp } from "firebase-admin/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { inAppNotify } from "../../sendalert/inapp_notify";
import { calculateScreenOnTime, usersScreenTime } from "../../utils";

export async function GET(req: NextRequest, res: NextResponse) {
  var userScreentime = await usersScreenTime(3);

  // send notications to parents:
  userScreentime.forEach((usr) => {
    usr.currentUserParent.forEach(async (parent) => {
      if (usr.mode == "Daily Routine" || usr.mode == "Travel") {
        var parentInfo = await getDoc(doc(db, "users", parent)).then((doc) =>
          doc.data()
        );

        await inAppNotify(
          parentInfo!["notificationToken"],
          "Screen Usage Alert!",
          `${usr.name} not reached a mobile Usage of 3 hours yet!`,
          "#FFFF00"
        );
      }
    });
  });

  return NextResponse.json(userScreentime);
}
