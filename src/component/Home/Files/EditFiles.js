import React, { useEffect } from 'react';
import { useState } from 'react';
import { HiAcademicCap, HiAnnotation, HiArchive, HiCalculator } from "react-icons/hi";
import { HiOutlineCheck } from "react-icons/hi";
import { HiBadgeCheck } from "react-icons/hi"
import FileDetails from './EditFileDetails';
import SurveyDetails from './SurveyDetails';
 
import FileSubmitDate from './FileSubmitDate';
import VehicleExtraDetails from './VehicleExtraDetails';
export default function EditFiles({ selectedRef, setOpenEditTab, callbackRefNo }) {


    const [activeTabs, setActiveTabs] = useState(1);

    useEffect(() => { }, []);
    
    return (
        <div className='w-full     '>
            <div className='  '>
                <ul className='flex font-sans text-xs cursor-pointer  font-semibold  '>
 
                    <li onClick={() => { setActiveTabs(1) }} className={`${activeTabs === 1 ? "  hover:bg-orange-700 border-b-4 border-blue-600 bg-white  text-black " : " bg-slate-200 text-black"} flex p-3    w-36   first-letter: hover:bg-yellow-700 hover:text-white`}><HiAnnotation className='ml-2 mr-2 mt-1' />  File Details   </li>
                    <li onClick={() => { setActiveTabs(2) }} className={`${activeTabs ===  2 ? "  hover:bg-orange-700 border-b-4 border-blue-600 bg-white  text-black" : " bg-slate-200 text-black"} flex p-3    w-36   hover:bg-yellow-700 hover:text-white`}><HiAnnotation className='ml-2 mr-2 mt-1' />Survey</li>
                    <li onClick={() => { setActiveTabs(3) }} className={`${activeTabs === 3 ? "  hover:bg-orange-700 border-b-4 border-blue-600 bg-white  text-black " : " bg-slate-200 text-black"} flex p-3    w-36   first-letter: hover:bg-yellow-700 hover:text-white`}><HiAnnotation className='ml-2 mr-2 mt-1' /> File and Fees    </li>
                    <li onClick={() => { setActiveTabs(4) }} className={`${activeTabs === 4 ? "  hover:bg-orange-700 border-b-4 border-blue-600 bg-white  text-black" : " bg-slate-200 text-black"} flex p-3    w-36   hover:bg-yellow-700 hover:text-white`}><HiAnnotation className='ml-2 mr-2 mt-1' /> Vehicle Details </li>
                </ul>
            </div>
            {
                activeTabs === 1 ? <FileDetails callbackRefNo={callbackRefNo} setOpenEditTab={setOpenEditTab} selectedRef={selectedRef}></FileDetails> :
                    activeTabs === 2 ? <SurveyDetails callbackRefNo={callbackRefNo} setOpenEditTab={setOpenEditTab} selectedRef={selectedRef}  ></SurveyDetails> :
                        activeTabs === 3 ?
                                <FileSubmitDate callbackRefNo={callbackRefNo} setOpenEditTab={setOpenEditTab} selectedRef={selectedRef} /> :
                                <VehicleExtraDetails callbackRefNo={callbackRefNo} setOpenEditTab={setOpenEditTab} selectedRef={selectedRef} />
            }
            <div>
            </div>
        </div >
    )
}
