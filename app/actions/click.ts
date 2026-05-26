"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export async function incrementClickCount(userId: string, linkId: string) {
  try {
    if (!userId || !linkId) {
      throw new Error("Missing userId or linkId");
    }

    const linkRef = doc(db, "users", userId, "links", linkId);
    await updateDoc(linkRef, {
      clickCount: increment(1)
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error incrementing click count:", error);
    return { success: false, error: "Failed to increment click count" };
  }
}
