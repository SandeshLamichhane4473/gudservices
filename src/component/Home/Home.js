import React, { useContext, useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import swal from 'sweetalert';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/Firebase';
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
import { BiAlignJustify } from "react-icons/bi";
import { HiAcademicCap, HiChip, HiFire, HiHome, HiOutlineMail } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiOutlineUserRemove } from "react-icons/hi"
import { HiOutlineFolderAdd } from "react-icons/hi";
import { HiOutlinePaperClip } from "react-icons/hi";
import logo from '../../images/logo512.png'
import Users from './Users';
import Dashboard from './References';
import Logout from './Logout'
import Insurance from './Insurance';
import ViewFiles from './Files/ViewFiles';
import References from './References';
import ImageCrousal from './ImageCrousal';
import { HiCubeTransparent } from 'react-icons/hi';
import Reports from './Files/Reports';
import Valuation from './Valuation/Valuation';
import Construction from './Valuation/Construction';
import { FaFileAlt, FaChartBar, FaCog } from "react-icons/fa"; // react-icons

export default function Home() {
    const [open, setOpen] = useState(true)
    const { user, logout, userRole } = UserAuth()
    const customNavigate = useNavigate();
    const [currentComponet, setcurrentComponent] = useState('');
  const cards = [
    {
      title: "Valuation",
      icon: <FaFileAlt className="w-10 h-10 text-amber-600" />,
      link: "/new",
    },
    {
      title: "Survey",
      icon: <FaChartBar className="w-10 h-10 text-blue-600" />,
      link: "/newins",
    },
    
  ];


    return (
        < div className=' flex bg-gray-200 w-full h-full'>

            <div className={open ? ' fixed left-0 top-0 bg-slate-900 h-screen p-5 pt-8 w-52 duration-300' :
                'fixed bg-slate-950 h-screen p-5 pt-8 w-20 duration-300'}>

                <BsFillArrowLeftCircleFill
                    onClick={() => setOpen(!open)}
                    className={`bg-white  text-slate-950text-sm rounded-full absolute -right-3 top-9 border border-gray-950 cursor-pointer ${!open && "rotate-180"} `}
                />

                <div className='inline-flex'>
                    <img src={logo} className={`bg-amber-300 text-4xl mr-2 ml-1 rounded-full w-8 h-8 cursor-pointer block float-left duration-500 ${open && "rotate-180"}`} alt='logo' />
                    <h1 className={`${!open && "scale-0"} mt-4 text-sm text-yellow-500 origin-left font-bold overflow-hidden duration-300`}>Gud Services</h1>
                </div>


                <ul className='pt-2 '>

                    <li onClick={() => { setcurrentComponent("home") }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        < HiCubeTransparent className={`${!open && "ml-3"}text-sm  `} />
                        <span className={`text-sm   font-bold flex-1 duration-300 ${!open && "hidden"}`}>Explore</span>
                    </li>
                    <li onClick={() => { setcurrentComponent("user-mgmt") }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        <HiOutlineUserGroup className={`${!open && "ml-3"}text-sm  `} />
                        <span className={`text-sm   font-bold flex-1 duration-300 ${!open && "hidden"}`}> Users</span>
                    </li>

                    <li onClick={() => { setcurrentComponent("logout") }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        <HiOutlineUserRemove className={`${!open && "ml-3"}text-sm  `} />
                        <span className={`text-sm font-bold flex-1 duration-300 ${!open && "hidden"}`}> SignOut</span>
                    </li>

                    <li onClick={() => { setcurrentComponent("insurance") }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        <HiOutlineFolderAdd className={`${!open && "ml-3"}text-sm  `} />
                        <span className={`text-sm font-bold flex-1 duration-300 ${!open && "hidden"}`}> Insurance</span>
                    </li>

                    <li onClick={() => { setcurrentComponent("refereces") }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        <HiHome className={`${!open && "ml-3"}text-sm  `} />
                        <span className={`text-sm font-bold flex-1 duration-300 ${!open && "hidden"}`}>Reference</span>
                    </li>

                    <li onClick={() => { setcurrentComponent("files") }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        <HiFire className={`${!open && "ml-3"}text-sm  `} />
                        
                        <span className={`text-sm font-bold flex-1 duration-300 ${!open && "hidden"}`}> Files</span>
                    </li>

                    <li onClick={() => { setcurrentComponent("reports") }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        <HiChip className={`${!open && "ml-3"}text-sm  `} />
                        <span className={`text-sm font-bold flex-1 duration-300 ${!open && "hidden"}`}> Reports</span>
                    </li>

                    <li onClick={() => { setcurrentComponent("valuation") ; }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        <HiOutlinePaperClip className={`${!open && "ml-3"}text-sm  `} />
                        <span className={`text-sm font-bold flex-1 duration-300 ${!open && "hidden"}`}> valuation</span>
                    </li>
                    <li onClick={() => { setcurrentComponent("Construnction") ; }} className={`text-gray-300 text-2xl flex cursor-pointer   p-2  hover:bg-gray-700 rounded-md mt-2`}>
                        <HiAcademicCap className={`${!open && "ml-3"}text-sm  `} />
                        <span className={`text-sm font-bold flex-1 duration-300 ${!open && "hidden"}`}> Construction</span>
                    </li>

                </ul>
            </div>
            <div className={open ? "ml-52 duration-500" : "ml-20 duration-500  "}>
                {

                     
                        currentComponet !== '' && currentComponet === 'user-mgmt' && user.role==='admin' ?
                            <Users />
                            : currentComponet !== '' && currentComponet === 'refereces' && user.role==='admin' || currentComponet !== '' && currentComponet === 'refereces' && user.role==='moderator'?
                                <References /> :
                                currentComponet !== '' && currentComponet === 'logout' ?
                                    <Logout /> :
                                    currentComponet !== '' && currentComponet === 'insurance' && user.role==='admin' ||  currentComponet !== '' && currentComponet === 'insurance' && user.role==='moderator' ?
                                        <Insurance /> :
                                        currentComponet !== '' && currentComponet === 'valuation' && user.role==='admin' || 
                                        currentComponet !== '' && currentComponet === 'valuation' && user.role==='moderator' 
                                                                          ?
                                               <Valuation />:

                                             
                                               currentComponet !== '' && currentComponet === 'Construnction'  ?
                                               <Construction />:
                                        currentComponet !== '' && currentComponet === 'files' && user.role==='admin' || currentComponet !== '' && currentComponet === 'files' && user.role==='moderator'?
                                               <ViewFiles /> :
                                            currentComponet !== '' && currentComponet === 'reports' && user.role==='admin' || 
                                            currentComponet !== '' && currentComponet === 'reports' && user.role==='moderator' ||
                                            currentComponet !== '' && currentComponet === 'reports' &&  user.role==='insurance'?
                                            <Reports/> :
                                            <div>
 
 <div className="flex items-center mt-5 justify-center gap-5 ml-10">
 
    {cards.map((card, index) => (
      <Link
        key={index}
        to={card.link}
        className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-md bg-white hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
      >
        {card.icon}
        <h2 className="mt-4 text-lg font-semibold text-gray-700">
          {card.title}
        </h2>
      </Link>
    ))}
 
 

 
                                                        </div>


  <h1 className='  ml-10 text-2xl text-black mt-10'>अल्छी लाग्यो ?  <a  className="underline text-blue-600" target='_blank' href='https://brahmbodh.netlify.app'>Click Here</a> </h1>
                                            </div>
                }
            </div>
        </div>
    );



}
