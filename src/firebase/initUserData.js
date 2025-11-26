import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function initUserData(uid) {

  const defaultBodyParts = [
    { id: "Chest", workoutNames: ["Chest Press", "Bench Press"] },
    { id: "Back", workoutNames: ["Deadlift"] },
    { id: "Legs", workoutNames: ["Squat"] },
  ];

  for (const part of defaultBodyParts) {
    await setDoc(
      doc(db, "users", uid, "bodyParts", part.id),
      { workoutNames: part.workoutNames }
    );
  }
  console.log("Initial data created");
}