import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { auth, db } from "../config/firebaseConfig"; // Firebase configuration
import { usePushNotifications } from "../hooks/usePushNotifications";

// Define the shape of the Auth context
interface AuthContextType {
  user: FirebaseUser | null;
  userData: any | null; // Firestore user data
  login: (email: string, password: string) => Promise<FirebaseUser | null>;
  signUp: (email: string, password: string, username: string) => Promise<FirebaseUser | null>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any | null>(null); // Firestore user data
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState); // Track app state

  usePushNotifications(user?.uid);

  // Set the user's online status
  const setOnlineStatus = async (userId: string, online: boolean) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      online,
      lastActive: serverTimestamp(), // Update last active time
    });
  };

  // Fetch user from Firestore
  const fetchUserFromFirestore = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data()); // Set the user data from Firestore
      } else {
        console.error("No such user in Firestore!");
      }
    } catch (error) {
      console.error("Error fetching user from Firestore:", error);
    }
  };

  // Handle app state changes
  const handleAppStateChange = (nextAppState: AppStateStatus, uid?: string) => {
    if (nextAppState === "active" && uid) {
      setOnlineStatus(uid, true); // Mark user as online
    } else if (uid) {
      setOnlineStatus(uid, false); // Mark user as offline
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser || null);
      setLoading(false);

      if (currentUser) {
        await setOnlineStatus(currentUser.uid, true); // Mark user as online
        await fetchUserFromFirestore(currentUser.uid); // Fetch the user from Firestore
        AppState.addEventListener("change", nextAppState => handleAppStateChange(nextAppState, currentUser.uid)); // Listen for app state changes
      } else {
        setUserData(null); // Clear user data on logout
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    await fetchUserFromFirestore(userCredential.user.uid); // Fetch Firestore user data after login
    return userCredential.user;
  };

  // Sign-up function that creates the user in Firebase Authentication and Firestore
  const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUserInFirestore(user, username); // Create user in Firestore with username
    setUser(user);
    await fetchUserFromFirestore(user.uid); // Fetch Firestore user data after signup
    return user;
  };

  // Function to create a new user in Firestore
  const createUserInFirestore = async (user: FirebaseUser, username: string) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        userID: user.uid,
        username: username,
        email: user.email,
        online: true,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user in Firestore:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      if (user?.uid) {
        await setOnlineStatus(user.uid, false);
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { pushToken: "" }); // Clear the push token on logout
      }
      setUser(null);
      setUserData(null); // Clear Firestore user data on logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <AuthContext.Provider value={{ user, userData, login, signUp, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
