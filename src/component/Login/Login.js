import React, { useEffect, useRef, useState } from 'react'
import image1 from '../../images/image1.jpg'
import logo192 from '../../images/logo512.png'
import GoogleButton from 'react-google-button'
import { FidgetSpinner } from 'react-loader-spinner'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { query, where, getDoc, getDocs } from 'firebase/firestore'
import { auth } from '../../firebase/Firebase'
import swal from 'sweetalert'
import { db } from '../../firebase/Firebase'
import { doc, setDoc, Timestamp, collection } from "firebase/firestore";
import { usersRef } from '../../firebase/Firebase';

import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserAuth } from '../../context/AuthContext'
export default function Login() {
    const myNavigate = useNavigate();
    const { user, googleLogin, loading, isUserAlreadyExist } = UserAuth();

    useEffect(() => {
        if (user != null) {
            myNavigate('/home')
        }

    }, [user]);

    async function signInwithGoogle() {
        try {
            await googleLogin();

        } catch (e) {
            swal({
                title: e,
                icon: "error",
                buttons: false,
                timer: 3000
            })
        }
        return;

        /// 
        try {

            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                    isUserAlreadyExist(user);
                })
        } catch (e) {
            swal({ icon: "error", title: e, timer: 4000 })
        }
    }
    // lets alredy check


    return (
        <div
            className="   bg-inherit  w-full   justify-center items-center flex"
            style={{
                // backgroundImage: 'url(' + image1 + ')',
                backgroundSize: "cover",
                height: "100vh",
                width: "100wh",
                color: "#f5f5f5"
            }}
        >

            <div className='' />
            <div className='text-8xl   md:w-1/3  p-10  rounded-md   text-blue-950  bg-white shadow-md   text-orange-900'>
                <h2 className='text-5xl mt-6 mb-6 pl-6 font-serif font-bold'>Gud Engineering Services </h2>
                <div className='align-center flex justify-center mt-6'>

                    <img src={logo192} className='h-48 w-48 border-solid border-2 border-sky-500  rounded-full' /></div>
                <p className='text-3xl  mt-10 mb-10 text-orange-950 align-center flex justify-center  '><span>Login</span> !!</p>
                <p>{user && user.email}</p>
                <div className='align-center flex justify-center  mt-25 mb-30'>
                    {
                        loading ?
                            <FidgetSpinner
                                visible={true}
                                height="80"
                                width="80"
                                user ariaLabel="dna-loading"
                                wrapperStyle={{}}
                                wrapperClass="dna-wrapper"
                                ballColors={['#ff0000', '#00ff00', '#0000ff']}
                                backgroundColor="#F4442E"
                            /> :

                            < GoogleButton
                                className=' w-full flex items-center justify-center hover:bg-red-800'
                                // can also be written as disabled={true} for clarity
                                onClick={signInwithGoogle}
                            />
                    }
                </div>
            </div>


        </div>

    )
};
