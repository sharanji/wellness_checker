import { db } from "@/firebaseconfig";
import { Timestamp } from "firebase-admin/firestore";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { sendAlert } from "../../sendalert/sendAlert";
import { calculateScreenOnTime, usersScreenTime } from "../../utils";


export async function GET(req: NextRequest, res: NextResponse) {

    var userScreentime = await usersScreenTime(6);

    // send notications to parents:
    userScreentime.forEach(usr => {

        usr.currentUserParent.forEach(async parent => {
            var parentInfo = await getDoc(doc(db, 'users', parent)).then((doc) => doc.data());

            await sendAlert(parent, parentInfo!['notificationToken'], `${usr.name} not reached a mobile Usage of 6 hours yet!`, "#FFFF00")
        });
    });


    return NextResponse.json(
        userScreentime
    )
}