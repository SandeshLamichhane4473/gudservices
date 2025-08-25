import React, { useEffect } from "react";
import { useState } from "react";
import { HiPencilAlt, HiTrash, HiRefresh } from "react-icons/hi";
import swal from "sweetalert";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase/Firebase";
import { updateDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { UserAuth } from "../../../context/AuthContext";

export default function Modal({ value, callback, constructionId,maintenanceInfo=[] }) {
  const { user  } = UserAuth();
    const [showModal, setShowModal] = React.useState(false);
    const [loading, setLoading] =useState(false);

    const [allVehicleInfo, setAllVehicleInfo]= useState([]);
    const [allMaintenanceInfo, setAllMaintenanceInfo]= useState([]);

    const [vehicleForm, setVehicleForm]= useState({ 
      maintenanceId:"",
      vehicleNo:"",
      engineNo:"",
      changingNo: "",
      modelNo:"",
      makeYear:"",
      repairMaintenace:"",
      repairMaintenaceworkAmount:"",
      vehicleRemarks:""
    });
    
    useEffect(() => {

      
     
 
     
  }, []);
  
  setTimeout(() => {
  //  setAllMaintenanceInfo(maintenanceInfo)
         
  }, 1500);
  console.log(maintenanceInfo);
    function clearAllInputField(){
      const doc={
        maintenanceId:"",
        vehicleNo:"",
        engineNo:"",
        changingNo: "",
        modelNo:"",
        makeYear:"",
        repairMaintenace:"",
        repairMaintenaceworkAmount:"",
        vehicleRemarks:""
      }
      setVehicleForm(doc);
    }

    async function editAndSaveVehicleInfo(){

      try{
         
        let  _updatedModel=[];
        const constructionRef = doc(db, "construction", constructionId);
        const _docSnap = await getDoc(constructionRef);
        if (_docSnap.exists()) {
         let   _listofModels= _docSnap.data()['vehicle'];  
          let idalreadyExist="no";
           _listofModels.forEach(element => {
            if(element.maintenanceId===vehicleForm.maintenanceId){
              idalreadyExist="yes";
              console.log("Id already exists");
            }
           });

           if(idalreadyExist==="yes"){
           _updatedModel= _listofModels.map((object)=>{
               if (object.maintenanceId===vehicleForm.maintenanceId){
                return  vehicleForm;
               } else{
              return  object
               }              
         });
        }else{
          _updatedModel= _listofModels.map((object)=>{
                return object;
          });
          _updatedModel.push(vehicleForm);
          console.log("And the length is "+_updatedModel.length);
        }
      }
   

         
    await updateDoc(constructionRef, {vehicle: _updatedModel}, { merge: true });
        
        clearAllInputField();
        getallMaintenanceInfo();
      }
      catch(e){
        swal(e);
      }

    }


///*************************************  GET ALL INFO FROM MAINTAINTENCE */

async function getallMaintenanceInfo(){
  try{
   
    const constructionRef = doc(db, "construction", constructionId);
    const _docSnap = await getDoc(constructionRef);
    if (_docSnap.exists()) {
      maintenanceInfo=_docSnap.data()['vehicle'].map((object)=>{
        return object;
      });
      setAllMaintenanceInfo(_docSnap.data()['vehicle']);
    }
  }
  catch(e){
    swal(e);
  }
}
//******************  DELETE MAINTENANCE ID */
async  function deleteFromVehicleInfo(_mid){

  try{
    if (!user || user.role !== 'admin') {
      swal("Warning !!!", "Unauthorize access", "error");
      return;
  }       
  const x = await swal({
    title: "Are you sure?"+_mid,
    text: "Once deleted, you will not be able to recover " ,
    icon: "warning",
    buttons: true,
    dangerMode: true,
})

if(_mid===""){
  swal("No id to delete");
  return;
}
if(!x){
return;
}
    setLoading(true);
    const constructionRef = doc(db, "construction", constructionId);
    const filterList = allMaintenanceInfo.filter((item) => 
        item.maintenanceId !== _mid 
 )
 
 
    await updateDoc(constructionRef, {vehicle: filterList}, { merge: true });
    getallMaintenanceInfo();
    setLoading(false)
  }
  catch(e){
    swal(e)
  }
}
    return (
      <>
        {/* <button
          className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Open regular modal
        </button> */}
        {value ? (
       <>
       <div className="z-40  ml-4 text-black  bg-gray-200 overflow-y-scroll w-full h-full  overflow-x-scroll   top-0 left-0 fixed">
        <div className="flex">
       <button className=" mt-2 ml-2 p-1 bg-red-600 text-white"  onClick={()=>{callback(false);
            setAllMaintenanceInfo([]);


       }}>Close</button>
        <span className="text-black mt-2 ml-2  "> Vehicle Info of Const No : {constructionId}</span>

        <span  onClick={()=>{
          getallMaintenanceInfo();
        }} className="underline text-indigo-600  cursor-pointer  text-lg p-2 border">CLick here to load all Maintanance Info</span>
      </div>
       <div  className="flex p-5" >
      
        <div className="w-64  justify-center items-center  p-2 shadow-lg shadow-gray-700 rounded-lg  bg-gray-900">

        <div className=' mt-2  '>
                     <input type='text'  placeholder='Maintenance Id' value={vehicleForm.maintenanceId}  onChange={(e)=>{setVehicleForm({...vehicleForm, maintenanceId: e.target.value}) ;}} className="rounded-lg p-2   w-full text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className='mt-2 '>
                     <input type='text'  placeholder='Vehicle No' value={vehicleForm.vehicleNo}    onChange={(e)=>{setVehicleForm({...vehicleForm, vehicleNo: e.target.value}) ;}} className="rounded-lg p-2 text-xs    w-full text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                 
    
                <div className=' mt-2 '>
                    <input type='text'  placeholder='Changing No'   value={ vehicleForm.changingNo} onChange={(e)=>{setVehicleForm({...vehicleForm, changingNo: e.target.value});  }} className="rounded-lg p-2 text-xs   w-full text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>

                <div className=' mt-2 '>
                    <input type='text'  placeholder='Engine No'   value={ vehicleForm.engineNo} onChange={(e)=>{setVehicleForm({...vehicleForm, engineNo: e.target.value});  }} className="rounded-lg p-2 text-xs   w-full text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>


                <div className=' mt-2'>
                    <input type='text'  placeholder='Model No'   value={vehicleForm.modelNo} onChange={(e)=>{setVehicleForm({...vehicleForm, modelNo: e.target.value});  }} className="rounded-lg p-2 text-xs text-black   w-full placeholder:text-gray-500 bg-gray-200 " />
                </div>
                 
                <div className=' mt-2 '>
                    <input type='text'  placeholder='Make Year'   value={vehicleForm.makeYear} onChange={(e)=>{setVehicleForm({...vehicleForm, makeYear: e.target.value});  }} className="rounded-lg p-2 text-xs text-black  w-full placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className='mt-2  '>
                    <input type='text'  placeholder='Repair Vehicle Maintanance '   value={vehicleForm.repairMaintenace} onChange={(e)=>{setVehicleForm({...vehicleForm, repairMaintenace: e.target.value});  }} className="rounded-lg p-2 text-xs  w-full text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className='mt-2    '>
                    <input type='text'  placeholder='Reapir Maintenance Work Amount'   value={vehicleForm.repairMaintenaceworkAmount} onChange={(e)=>{setVehicleForm({...vehicleForm, repairMaintenaceworkAmount: e.target.value}); }} className="rounded-lg   w-full p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className=' mt-2  '>
                    <input type='text'  placeholder='Vehicle Remarks'   value={vehicleForm.vehicleRemarks} onChange={(e)=>{setVehicleForm({...vehicleForm, vehicleRemarks: e.target.value}); }} className="rounded-lg p-2 text-xs text-black   w-full  placeholder:text-gray-500 bg-gray-200 " />
                </div>

                 
             
        
        
             
              {
                loading?<></>
                :
           
                <button className='bg-green-700 w-52 shadow-md   text-xs p-3 mt-5 hover:bg-sky-800 border rounded-lg  ' onClick={() => {
                            { 
                   
                              editAndSaveVehicleInfo()
                          
                            }
                        }}>
                  Save
                </button> 
            }
          </div>
        

        <div className="w-4/6  h-14  ">

<table className="  text-lg text-left   text-black dark:text-white border-separate shadow-lg shadow-gray-400 ">
   <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-inherit  ">

                              <tr className='bg-blue-100' >
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <HiRefresh onClick={() =>  {getallMaintenanceInfo()}} className='text-xs cursor-pointer rounded hover:rounded-lg hover:bg-orange-700' />
                                            <label for="checkbox-all-search" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                  
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                      Vehicle No
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                         Changing No
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                         Engine No
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        Model No
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                      Make Year
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                     Repair Parts
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                     Amount
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                     Remarks
                                    </th>
                                    
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        <HiPencilAlt />
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        <HiTrash />
                                    </th>

   </tr>

 </thead>
 
 <tbody className='bg-white text-xs font-normal text-black cursor-pointer'>
{

allMaintenanceInfo.map((value, index)=>{
 return (
  <tr  className='hover:bg-slate-300'>
  <th scope="row" className="px-2 py-2  font-semibold text-gray-900 whitespace-nowrap ">
    {value.maintenanceId && value.maintenanceId}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
    {value.vehicleNo}
  </th>
  <th scope="row" className="px-2 py-2 font-semibold text-gray-900 whitespace-nowrap ">
  {value.changingNo}
  </th>
  <th scope="row" className="px-2 py-2 font-semibold text-gray-900 whitespace-nowrap ">
  {value.engineNo}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.modelNo}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.makeYear}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.repairMaintenace}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.repairMaintenaceworkAmount}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.vehicleRemarks}
  </th>
    
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap " onClick={()=>{
     
  }}>
  <HiPencilAlt onClick={()=>{ 
    setVehicleForm(value);
  
  }}  className='hover:bg-slate-500'/>
  
  </th>
  
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
 
    <HiTrash  className='hover:bg-slate-600' onClick={()=>{ 
      deleteFromVehicleInfo(value.maintenanceId)
                             
                               }
    } />
  </th>
  </tr>
 )

  })
}

 </tbody>
</table>
        </div>


       </div>
       </div>
      </>
           
             
        ) : null}
      </>
    );
  }
  