import { NextRequest, NextResponse } from 'next/server';
import { collection, query, getDocs, orderBy, where, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import admin, { initializeApp } from 'firebase-admin';
import { getMessaging, getToken } from "firebase/messaging";
import { app, db } from "@/firebaseconfig";
import { Timestamp } from 'firebase-admin/firestore';
import firebase from 'firebase/compat/app';
import qs from 'qs';
import { sendAlert } from "../sendalert/sendAlert";

interface Event {
    timestamp: Timestamp;
    status: string;
}


function calculateScreenOnTime(events: Array<{ timestamp: Timestamp, status: string }>): number {
    events.sort((a, b) => {
        return a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime();
    });

    let totalOnTime: number = 0;

    let previousDate: Date | null = null;
    let previousStatus: string | null = null;

    for (let event of events) {
        let timestamp: Date = event.timestamp.toDate();
        let currentStatus: string = event.status;

        if (previousDate !== null && previousStatus === "Screen On") {
            totalOnTime += timestamp.getTime() - previousDate.getTime();
        }

        previousDate = timestamp;
        previousStatus = currentStatus;
    }

    if (previousDate != null && previousStatus === "Screen On") {
        totalOnTime += Timestamp.now().toDate().getTime() - previousDate.getTime();
    }

    return totalOnTime;
}

function formatDuration(durationMillis: number): string {
    let seconds: number = Math.floor(durationMillis / 1000) % 60;
    let minutes: number = Math.floor(durationMillis / (1000 * 60)) % 60;
    let hours: number = Math.floor(durationMillis / (1000 * 60 * 60));

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

function padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
}


export async function GET(req: NextRequest) {
    // const josnBody = await req.json();

    const rawParams = req.url.split('?')[1];
    const params = qs.parse(rawParams);

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);


    var userId: any = params['userId'];//"NAOd8lfxMxanusqpBunEj3SjU922";
    const screenStatusQuery = query(
        collection(db, 'screen_status', userId, 'records'), // Access the user's records collection
        where('timestamp', '>', twentyFourHoursAgo),// Filter by timestamp
        orderBy('timestamp', 'asc')
    );

    var response = await getDocs(screenStatusQuery);

    var screenTime = calculateScreenOnTime([
        ...response.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })),
    ]);

    var hoursInuseage = Math.floor(screenTime / (1000 * 60 * 60));
    var userInfo = await getDoc(doc(db, 'users', userId)).then((doc) => doc.data());

    const userDocRef = doc(db, 'user_notifications', userId);
    const notificationsSubcollectionRef = collection(userDocRef, 'notifications');

    if (hoursInuseage >= 6) {
        await sendAlert(userInfo!['notificationToken'], 'Screen Usage Alert!', "Excess Screen Time of 6 Hour", "#FF0000");
        await addDoc(notificationsSubcollectionRef, { message: "Excess Screen Time of 6 Hour", timestamp: serverTimestamp() });
    }
    else if (hoursInuseage >= 0) {
        await sendAlert(userInfo!['notificationToken'], 'Screen Usage Alert!', "Running high,  3 Hour of screen time ,slow down", "#FF0000");
        await addDoc(notificationsSubcollectionRef, { message: "Running high,  3 Hour of screen time ,slow down", timestamp: serverTimestamp() });
    }

    return NextResponse.json({
        message: "User Fetch Successfull",
        screenTime: formatDuration(screenTime),
        data: userId,
        userInfo: userInfo
    });
}