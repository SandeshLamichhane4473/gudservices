import React, { useEffect } from "react";
import { useState } from "react";
import { HiPencilAlt, HiTrash, HiRefresh, HiCheck, HiOutlineCheckCircle, HiStop } from "react-icons/hi";
import swal from "sweetalert";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase/Firebase";
import { updateDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { UserAuth } from "../../../context/AuthContext";
import Stepper from 'react-stepper-horizontal';
import { setDoc } from "firebase/firestore";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";

export default function ValuationChecker({value, checkerCallback,     valuationObject,maintenanceInfo=[] }) {
  const { user  } = UserAuth();

  
 
 
    
    useEffect(() => {


    
  }, []);
  
   
 
    
 
//******************  DELETE MAINTENANCE ID */
 
    return (
      <>
       {value ? (
       <>
       <div className="z-40  ml-4 text-black  bg-gray-200  overflow-y-scroll w-full h-full  overflow-x-scroll   top-0 left-0 fixed">
        <div className="flex">
       <button className=" mt-2   p-1 rounded-lg shadow-lg ml-3 mb-2 bg-red-200 hover:bg-red-300 text-white"  onClick={()=>{checkerCallback(false);
             
       }}>Close</button>
      
      </div>


      <div className=" h-5/6 overflow-y-auto">
           
           <ul className="px-5">

{
  /*
       clientOrcompanyName: "",
        clientAddress: "",
        clientPhone:"",
        ownerName:"",
        ownerAddress:"",
        ownerPhone:"",

        clientMaker:"",
        clientChecker:"",
        clientUpdateStatus:""

  */
}

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 ">
              <span className=" font-semibold w-96">Valuation File No</span>
              <span>{valuationObject.valuationFileNo}</span> 
            </div>
            </li>
            
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Client or Company Name</span>
              <span>{valuationObject.clientOrcompanyName}</span> 
            </div>
            </li>


            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Client Address</span>
              <span>{valuationObject.clientAddress}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Client Phone</span>
              <span>{valuationObject.clientPhone}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Owner Name</span>
              <span>{valuationObject.ownerName}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Owner Address</span>
              <span>{valuationObject.ownerAddress}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Owner Phone</span>
              <span>{valuationObject.ownerPhone}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Client Maker</span>
              <span>{valuationObject.clientMaker}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Client Checker</span>
              <span>{valuationObject.clientChecker}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Status</span>
              <span>{valuationObject.clientUpdateStatus}</span> 
            </div>
            </li>
           

           
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">-----------</span>
              <span>---------- </span> 
            </div>
            </li>


            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Property Type</span>
              <span>{valuationObject.propertyType && valuationObject.propertyType}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Bank Name</span>
              <span>{valuationObject.bankName && valuationObject.bankName}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Bank Branch</span>
              <span>{valuationObject.bankBranch && valuationObject.bankBranch}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Lat Long</span>
              <span>{valuationObject.latlong && valuationObject.latlong}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Other Maker</span>
              <span>{valuationObject.otherMaker && valuationObject.otherMaker}</span> 
            </div>
            </li>

            
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Other Checker</span>
              <span>{valuationObject.otherChecker && valuationObject.otherChecker}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Other Status</span>
              <span>{valuationObject.otherUpdateStatus && valuationObject.otherUpdateStatus}</span> 
            </div>
            </li>
     
           
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">-----------</span>
              <span>---------- </span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Total Received Amount From Customer </span>
              <span>{valuationObject.totalIncome && valuationObject.totalIncome}</span> 
            </div>
            </li>
           
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">FMV value </span>
              <span>{valuationObject.fmvValue && valuationObject.fmvValue}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Amount of Bill</span>
              <span>{valuationObject.amountofBill && valuationObject.amountofBill}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Two Page Maker</span>
              <span>{valuationObject.twopageMaker && valuationObject.twopageMaker}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Book Value</span>
              <span>{valuationObject.bookValue && valuationObject.bookValue}</span> 
            </div>
            </li>
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Book Maker</span>
              <span>{valuationObject.bookMaker && valuationObject.bookMaker}</span> 
            </div>
            </li>
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Book Close Date</span>
              <span>{valuationObject.bookCloseDate && valuationObject.bookCloseDate}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Maker</span>
              <span>{valuationObject.costMaker && valuationObject.costMaker}</span> 
            </div>
            </li>
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Checker</span>
              <span>{valuationObject.costChecker && valuationObject.costChecker}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Status</span>
              <span>{valuationObject.costUpdateStatus && valuationObject.costUpdateStatus}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">-----------</span>
              <span>---------- </span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Close Remarks</span>
              <span>{valuationObject.closeRemarks && valuationObject.closeRemarks}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Close Maker</span>
              <span>{valuationObject.closeMaker && valuationObject.closeMaker}</span> 
            </div>
            </li>

            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Close Checker</span>
              <span>{valuationObject.closeChecker && valuationObject.closeChecker}</span> 
            </div>
            </li>
            <li className="py-1 px-2 text-sm bg-white">
             <div  className="grid grid-cols-2 gap-4 bg-white">
              <span className=" font-semibold w-96">Close Status</span>
              <span>{valuationObject.closeUpdateStatus && valuationObject.closeUpdateStatus}</span> 
            </div>
            </li>

            


           {
            /*     closeRemarks:"",
       closeMaker:"",
       closeChecker:"",
       closeUpdateStatus:""  */
           }
           
            


          </ul>

       </div>
</div>


     
      </>
           
             
        ) : null}
      </>
    );


    

  }
  