import { db } from "@/firebaseconfig";
import { Timestamp } from "firebase-admin/firestore";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { sendAlert } from "../../sendalert/sendAlert";
import { calculateScreenOnTime, usersScreenTime } from "../../utils";


export async function GET(req: NextRequest, res: NextResponse) {

    var userScreentime = await usersScreenTime(2);

    // send notications to parents:
    userScreentime.forEach(usr => {
        if (usr.mode == "Daily Routine") {
            usr.currentUserParent.forEach(async parent => {
                var parentInfo = await getDoc(doc(db, 'users', parent)).then((doc) => doc.data());

                await sendAlert(parentInfo!['notificationToken'], 'Screen Usage Alert!', `${usr.name} not reached a mobile Usage of 2 hours yet!`, "#FFFF00")
            });
        }
    });


    return NextResponse.json(
        userScreentime
    )
}