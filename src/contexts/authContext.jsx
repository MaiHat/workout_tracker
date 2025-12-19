import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { initUserData } from "../firebase/initUserData";
import { onAuthStateChanged, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        signOut, 
        sendPasswordResetEmail,
        updateProfile,
        updateEmail,
        updatePassword,
        deleteUser
     } from "firebase/auth";

const AuthContext = React.createContext();

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [username, setUserName] = useState("Guest");
    const [showProfile, setShowProfile] = useState(true);
    const user = auth.currentUser;

    async function signup(email, password) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; //user情報をuserの中に入れている

        // ★ ユーザー作成直後に初期セットアップ
        await initUserData(user.uid);
        return user;
        console.log(user);
        }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password); 
    }

    function logout() {
        setUserName("Guest");
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    async function updateUserName(username) {
        if (!auth.currentUser) {
          throw new Error("No current user found.");
        }
        await updateProfile(auth.currentUser, { displayName: username });
        setUserName(username);
    }

    function changeEmail(email) {
        return updateEmail(auth.currentUser, email);
    }

    function changePassword(password) {
        return updatePassword(user, password);
    }

    function deleteUser(user) {
        return deleteUser(user);
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
           if(user) { 
                setCurrentUser(user);
                setUserName(user.displayName || "Guest");
            } else {
                setUserName("Guest");
            }
            setLoading(false);
            });
        return unsubscribe;
    }, [])
    

    const value = {
        currentUser,
        showProfile,
        username,
        updateUserName,
        signup,
        login,
        logout,
        loading,
        resetPassword,
        changeEmail,
        changePassword,
        deleteUser

    }; 

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}

export { AuthProvider, useAuth };