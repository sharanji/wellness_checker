import { db } from "@/firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { inAppNotify } from "../sendalert/inapp_notify";
import { whatsappNotify } from "../sendalert/whatsapp_notify";

export async function notifyParent(user: any, inActiveDuration: string) {
  var parentQuery = query(
    collection(db, "trackable_users"),
    where("members", "array-contains", user.id)
  );
  var currentUserParent = await getDocs(parentQuery);
  var parents = [...currentUserParent.docs.map((p) => p.id)];

  for (let i = 0; i < parents.length; i++) {
    var parentId: string = parents[i];

    var parentInfo = await getDoc(doc(db, "users", parentId)).then((doc) =>
      doc.data()
    );

    try {
      await inAppNotify(
        parentInfo!["notificationToken"],
        "Inactive Alert",
        `${user.name} is inactive for ${inActiveDuration}`,
        "#FFFF00"
      );
    } catch (e) {}

    try {
      await whatsappNotify(
        parentInfo!["whatsapp_number"],
        user.name,
        parentInfo!["name"],
        inActiveDuration
      );
    } catch (e) {}

    return parentInfo;
  }
}
