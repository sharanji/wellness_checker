import { db } from "@/firebaseconfig";
import { Timestamp } from "firebase-admin/firestore";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export function calculateScreenOnTime(events: Array<{ timestamp: Timestamp, status: string }>): number {
    // events.sort((a, b) => {
    //     return a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime();
    // });

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


export async function usersScreenTime(minScreenTime: number) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const allUsersQuery = query(
        collection(db, 'users')
    );

    const allUsers = await getDocs(allUsersQuery).then((users) => [...users.docs.map((u) => {
        return { id: u.id, mode: u.data()['mode_name'], name: u.data()['name'], lastActive: u.data()['last_active'], token: u.data()['notificationToken'] }
    })]);

    var userScreentime = [];

    for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {

        var currentUser = allUsers[userIndex];


        const user = currentUser;
        var userId = user.id;//"NAOd8lfxMxanusqpBunEj3SjU922";

        const screenStatusQuery = query(
            collection(db, 'screen_status', userId, 'records'), // Access the user's records collection
            where('timestamp', '>', twentyFourHoursAgo),// Filter by timestamp
            orderBy('timestamp', 'asc')
        );
        var response = await getDocs(screenStatusQuery);

        var screenTime = calculateScreenOnTime([
            ...response.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })),
        ]);

        var parentQuery = query(collection(db, 'trackable_users'), where('members', "array-contains", userId))
        var currentUserParent = await getDocs(parentQuery);

        if (screenTime / 1000 < (minScreenTime * 60 * 60)) {
            userScreentime.push({
                name: currentUser.name,
                notifyToken: currentUser.token,
                userId: userId,
                screenTime: screenTime,
                mode: currentUser.mode,
                currentUserParent: [
                    ...currentUserParent.docs.map((p) => p.id)
                ]
            });
        }

    }
    return userScreentime;
}