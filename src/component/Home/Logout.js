import React, { useState } from 'react'
import { UserAuth } from '../../context/AuthContext'
import swal from 'sweetalert'
import { FidgetSpinner } from 'react-loader-spinner';
export default function Logout() {
    const { user, logout, userRole } = UserAuth()
    const [loading, setLoading] = useState(false);
    async function handleLogout() {
        try {
            await logout();
            swal({
                title: "Successfull Logged out",
                // icon:"success",
                timer: 3000,


            })
        } catch (e) {
            swal({
                title: e,
                icon: "error",
                timer: 3000
            })
        }
    }

    function capitalizeFirstWord(word=""){
   
        return  word.charAt(0).toUpperCase() + word.slice(1);


    }

    return (
        <div className='w-full h-full'>
            <div className='text-yellow-500 text-1xl p-6 font-bold   w-auto  bottom-2  border-2 '>
                <h1 className=' overflow-clip'>Are you want to logout ?  </h1>
            </div>


                    <div className=' border-dashed border-2   mt-5  p-5 rounded-lg bg-gray-300'>
                        <div className='bg-white mt-7 border-2 border-gray-500 text-black px-3 py-5'>
            {/* create div */}
         
                <h1 className='font-normal text-base  '>Once you logout, you need <span className='text-pink-700 font-bold'>Authorization again...</span> </h1>
                <div className='flex'>
                    <div className='w-28  font-bold '> Name : </div>
                    <span> {user && capitalizeFirstWord( user.name)}</span>
                </div>

                <div className='flex'>
                    <div className='w-28   font-bold '> Email : </div>
                    <span> {user &&  capitalizeFirstWord( user.email)}</span>
                </div>

                <div className='flex'>
                    <div className='w-28  font-bold '> Role : </div>
                    <span className=' '> {user &&capitalizeFirstWord(user.role)}</span>
                </div>
                <div className='flex'>
                    <div className='w-28   font-bold  overflow-hidden whitespace-nowrap '> <p>Insurance :  </p> </div>
                    <span className='uppercase'> { user && capitalizeFirstWord (user.insurance)}</span>
                </div>
                <div className='flex'>
                    <div className='w-28  font-bold '> Photo : </div>
                     <img src={user.photourl}  alt='Profile image' className='w-28 h-28' />
                </div>
                <div className='flex'>
                    <div className='w-28   font-bold  overflow-hidden whitespace-nowrap '> <p>Status :  </p> </div>
                    <span className='uppercase'> { user &&  user.status==="true"?"Active":"In-Active"}</span>
                </div>
                <>
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
                            />
                            :

                            <div className='flex'>
                                <button onClick={() => { handleLogout() }} class=" p-2 mt-5 mb-9   bg-red-700   text-white  hover:text-black text-sm hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                    Confirm Logout
                                </button>

                            </div>
                    }
                </>
            </div>
   </div>
  </div>


     
    )
}
