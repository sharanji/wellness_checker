import { db } from "@/firebaseconfig";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    var usrData: any = [];
    var users: Array<any> = await getDocs(
      query(
        collection(
          db,
          "screen_status",
          "wagU0Pyvpka1lAsWBDSHVstt0nr1",
          "records"
        )
      )
    ).then((userDocs) =>
      userDocs.docs.map((u) => {
        return {
          id: u.id,
          ...(u.data() as any),
        };
      })
    );

    for (let i = 0; i < users.length; i++) {
      const element = users[i];
      usrData.push(element);
    }
    return NextResponse.json(usrData);
  } catch (error) {
    console.error("Error fetching screen status records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
