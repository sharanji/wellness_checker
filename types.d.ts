import { Timestamp } from "firebase-admin/firestore";

declare global {
  interface Event {
    timestamp: Timestamp;
    status: string;
  }
}
