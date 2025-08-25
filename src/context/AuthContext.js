import { createContext, useContext } from "react";
import { onAuthStateChanged, signOut, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, } from "../firebase/Firebase";
import { collection, query, where, doc, setDoc, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const AuthContext = React.createContext()

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState("user")

    useEffect(() => {

        const unsubscirbe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            //   alert(currentUser.email);

            // if (currentUser.email !== null) {
            //     getCurrentRole(currentUser.email)
            // }

          if (currentUser && currentUser.email) {
            getCurrentRole(currentUser.email);
        }

        });
        return () => {
            unsubscirbe();
        }
    }, [])


    const googleLogin = async () => {
        setLoading(true)
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        isUserAlreadyExist(user);
        setLoading(false)
        setTimeout(() => { ; }, 4000)

    }

    const logout = () => {
        setUser({})
        return auth.signOut();
    }

    const setUserData = (_docData) => {

        if (_docData) {

            setUserRole(_docData.role);
            setUser(_docData);
        }

    }

    return (
        <AuthContext.Provider value={{ user, googleLogin, logout, loading, isUserAlreadyExist, setUserData, userRole }}>
            {children}
        </AuthContext.Provider>
    );
    async function isUserAlreadyExist(_user) {
        try {
            const userRefs = collection(db, "users")
            const _data = query(userRefs, where('email', "==", _user.email));
            const querySnapshot = await getDocs(_data);
            if (querySnapshot.docs.length < 1) {
                AddCredentialtoDb(_user);

            } else {
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    setUserRole(docData.role);
                    swal({
                        title: "Successfull Login",
                        icon: "success",
                        buttons: false,
                        timer: 2000
                    })
                    return;
                });

            }
            //ihere its a new user

        } catch (e) {
            swal({
                title: e,
                icon: "error",
                buttons: false,
                timer: 3000
            })
        }
    }

    async function AddCredentialtoDb(_user) {
        //puts info
        try {  //    ,, ,, 
            const docData = {
                name: _user.displayName,
                phone: _user.phoneNumber,
                email: _user.email,
                role: "user",
                photourl: _user.photoURL,
                date: Date.now(),//Timestamp.fromDate(new Date("December 10, 1815")),
            };
            await setDoc(doc(db, "users", _user.email), docData);
            setUserRole("user");
            swal({
                title: "Welcome to the Gud Engineering ",
                icon: "success",
                buttons: false,
                timer: 3000
            })
        }
        catch (e) {
            swal({
                title: e,
                icon: "error",
                buttons: false,
                timer: 3000
            })
        }
    }



    async function getCurrentRole(_email) {

        try {
            const userRefs = collection(db, "users")
            const _data = query(userRefs, where('email', "==", _email));
            const querySnapshot = await getDocs(_data);
            if (querySnapshot.docs.length >= 1) {
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    setUserRole(docData.role);
                    setUser(docData);
                    return;
                });
            }

        }
        catch (e) {
            alert("unable to catch up the role" + user.email)
        }
    }


}

export function UserAuth() {
    return useContext(AuthContext);
} 