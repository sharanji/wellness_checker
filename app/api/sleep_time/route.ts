import { db } from "@/firebaseconfig";
import { Timestamp } from "firebase-admin/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { List } from "postcss/lib/list";
import { formatDuration } from "../utils";

export async function GET(req: NextRequest) {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  var users: Array<any> = await getDocs(query(collection(db, "users"))).then(
    (userDocs) =>
      userDocs.docs.map((u) => {
        return {
          id: u.id,
          count: u.data()["count"],
          sleepStart: u.data()["sleepStart"],
          sleepEnd: u.data()["sleepEnd"],
        };
      })
  );
  var usrData: any = [];

  for (let i = 0; i < users.length; i++) {
    var uId = users[i].id;
    var records: any = await getDocs(
      query(
        collection(db, "screen_status", uId, "records"),
        where("timestamp", ">", twentyFourHoursAgo),
        orderBy("timestamp", "asc")
      )
    );

    var sleepHrs = sleepTime([...records.docs.map((r: any) => r.data())]);

    if (isNaN(users[i].sleepStart)) {
      users[i].sleepStart = 0;
    }
    if (isNaN(users[i].sleepEnd)) {
      users[i].sleepEnd = 0;
    }

    // Calculate the new average sleep start hour
    var newAvgSleepStart =
      (users[i].sleepStart * users[i].count + sleepHrs.sleepStartHour) /
      (users[i].count + 1);

    var newAvgSleepEnd =
      (users[i].sleepEnd * users[i].count + sleepHrs.sleepEndHour) /
      (users[i].count + 1);

    var avgSleephrs = {
      sleepStart: newAvgSleepStart,
      sleepEnd: newAvgSleepEnd,
    };

    if (avgSleephrs.sleepStart != null && avgSleephrs.sleepEnd != null) {
      await updateDoc(doc(db, "users", uId), {
        ...avgSleephrs,
        count: increment(1),
      });
    }
  }

  return NextResponse.json({ message: "hlo", users, usrData });
}

function sleepTime(datas: Array<{ timestamp: Timestamp; status: string }>) {
  var sleepStart = undefined;
  var sleepEnd = undefined;
  var duration = 0;
  let i = 0;

  while (i < datas.length) {
    if (datas[i].status == "Screen Off") {
      var start: any = datas[i].timestamp;
      var end: any = datas[i].timestamp;

      while (i < datas.length) {
        if (datas[i].status == "Screen On") {
          end = datas[i].timestamp;
          break;
        }
        i++;
      }

      let currduration = end.toDate().getTime() - start.toDate().getTime();
      if (currduration > duration) {
        duration = currduration;
        sleepStart = start;
        sleepEnd = end;
      }
    }

    i++;
  }

  return {
    sleepStartHour: sleepStart ? sleepStart.toDate().getHours() : undefined,
    sleepEndHour: sleepEnd ? sleepEnd.toDate().getHours() : undefined,
  };
}
