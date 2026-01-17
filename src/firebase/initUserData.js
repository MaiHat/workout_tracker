import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function createInitUserData(uid, userName, email) {

  await setDoc(doc(db, "users", uid), {
    name: userName,
    email: email,
    createdAt: serverTimestamp(),
  });

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
  console.log("init user data created");
}