import React, { useEffect } from "react";
import { useState } from "react";
import { HiPencilAlt, HiTrash, HiRefresh } from "react-icons/hi";
import swal from "sweetalert";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase/Firebase";
import { updateDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { UserAuth } from "../../../context/AuthContext";

export default function IncomeExpenseModal({ value, incomeExpenseCallBack, constructionId,maintenanceInfo=[] }) {
  const { user  } = UserAuth();
    const [showModal, setShowModal] = React.useState(false);
    const [loading, setLoading] =useState(false);

    const [allVehicleInfo, setAllVehicleInfo]= useState([]);
    const [allIncomeInfo, setAllIncomeInfo]= useState([]);

    const [vehicleForm, setVehicleForm]= useState([]);

    const [incomeForms, setIncomeForm]= useState({ 
       incomeNo:"",
       incomeAmount:"",
       incomeRemarks:"",
       incomerelatedPerson   : "",
       incomeDate:"",
       maker:""
    });
    
    useEffect(() => {
 
  }, []);
  
  setTimeout(() => {
  //  setAllMaintenanceInfo(maintenanceInfo)
         
  }, 1500);
   
    function clearAllInputFieldx(){
      const doc={
        incomeNo:"",
        incomeAmount:"",
       incomeRemarks:"",
        incomerelatedPerson   : "",
        incomeDate:""
      }
      setIncomeForm(doc);
    }

    async function editANdSaveIncomeInfo(){
      try{ 

        
        console.log(incomeForms);
        let  _updatedModel=[];
        const constructionRef = doc(db, "construction", constructionId);
        const _docSnap = await getDoc(constructionRef);
        if (_docSnap.exists()) {
         let   _listofModels= _docSnap.data()['income'];  
          let idalreadyExist="no";
           
           _listofModels.forEach(element => {
            if(element.incomeNo===incomeForms.incomeNo){
              idalreadyExist="yes";
              console.log("Id already exists");
            }
           });

        if(idalreadyExist==="yes"){
           _updatedModel= _listofModels.map((object)=>{
               if (object.incomeNo===incomeForms.incomeNo){
                return  incomeForms;
               } else{
              return  object
               }              
         });
        }else{
          _updatedModel= _listofModels.map((object)=>{
                return object;
          });
          _updatedModel.push(incomeForms);
          console.log("And the length is "+_updatedModel.length);
        }
      }

      await updateDoc(constructionRef, {income: _updatedModel}, { merge: true });
   

   
        
        clearAllInputFieldx();
        getallIncomeInfo();
    }

    catch(e){
      swal(e)
    }
  }

///*************************************  GET ALL INFO FROM MAINTAINTENCE */
async function getallMaintenanceInfo(){}
async function getallIncomeInfo(){
  try{
   
    const constructionRef = doc(db, "construction", constructionId);
    const _docSnap = await getDoc(constructionRef);
    if (_docSnap.exists()) {
      // maintenanceInfo=_docSnap.data()['income'].map((object)=>{
      //   return object;
      // });
      setAllIncomeInfo(_docSnap.data()['income']);
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
    const filterList = allIncomeInfo.filter((item) => 
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
       <button className=" mt-2 ml-2 p-1 rounded-lg shadow-lg bg-lime-600 text-white"  onClick={()=>{incomeExpenseCallBack(false);
            setAllIncomeInfo([]);


       }}>Close</button>
        <span className="text-black mt-2 ml-2  "> Vehicle Info of Const No : {constructionId}</span>

        <span  onClick={()=>{
          getallIncomeInfo();
        }} className="underline text-indigo-600  cursor-pointer  text-lg p-2 border">CLick here to refresh income and expense info</span>
      </div>
       <div  className="flex p-5" >
      
        <div className="w-64  justify-center items-center  p-2 shadow-lg shadow-gray-700 rounded-lg  bg-gray-900">

        <div className=' mt-2  '>
                     <input type='text'  placeholder='Income Id' value={incomeForms.incomeNo}  onChange={    (e)=>{setIncomeForm({...incomeForms, incomeNo : e.target.value}) ; }} className="rounded-lg p-2   w-full text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className='mt-2 '>
                     <input type='text'  placeholder='Income Remarks' value={incomeForms.incomeRemarks}    onChange={(e)=>{setIncomeForm({...incomeForms, incomeRemarks: e.target.value}) ;}} className="rounded-lg p-2 text-xs    w-full text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                 
    
                <div className=' mt-2 '>
                    <input type='text'  placeholder='Income Amount'   value={ incomeForms.incomeAmount} onChange={(e)=>{setIncomeForm({...incomeForms, incomeAmount: e.target.value});  }} className="rounded-lg p-2 text-xs   w-full text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>

                <div className=' mt-2 '>
                    <input type='text'  placeholder='Income Related Person'   value={ incomeForms.incomerelatedPerson} onChange={(e)=>{setIncomeForm({...incomeForms, incomerelatedPerson: e.target.value});  }} className="rounded-lg p-2 text-xs   w-full text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>   
                <div className=' mt-2 '>
                    <input type='date'  placeholder='Income Date'   value={ incomeForms.incomeDate} onChange={(e)=>{setIncomeForm({...incomeForms, incomeDate: e.target.value});  }} className="rounded-lg p-2 text-xs   w-full text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>      
             
              {
                loading?<></>
                :
           
                <button className='bg-green-700 w-52 shadow-md   text-xs p-3 mt-5 hover:bg-sky-800 border rounded-lg  ' onClick={() => {
                            {
                     
                          if(incomeForms.incomeNo===""){
                            return;
                          }

                          console.log(incomeForms.incomerelatedPerson);
                              
                              setIncomeForm({...incomeForms, maker: user.name});

                              if(incomeForms.maker===""){
                                swal("maker is empty");
                                return;
                              }
                            
                              editANdSaveIncomeInfo()
                          
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
                                            <HiRefresh onClick={() =>  {getallIncomeInfo()}} className='text-xs cursor-pointer rounded hover:rounded-lg hover:bg-orange-700' />
                                            
                                        </div>
                                    </th>
                                  
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                      Income Remarks
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                         Income Amount
                                    </th>
                                    
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        Related Person
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                      Date
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                     Maker
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

allIncomeInfo.map((value, index)=>{
 return (
  <tr  className='hover:bg-slate-300'>
  <th scope="row" className="px-2 py-2  font-semibold text-gray-900 whitespace-nowrap ">
    {value.incomeNo && value.incomeNo}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
    {value.incomeRemarks}
  </th>
  <th scope="row" className="px-2 py-2 font-semibold text-gray-900 whitespace-nowrap ">
  {value.incomeAmount}
  </th>
  <th scope="row" className="px-2 py-2 font-semibold text-gray-900 whitespace-nowrap ">
  {value.incomerelatedPerson}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.incomeDate}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.maker}
  </th>

  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap " 
  onClick={()=>{
     
  }}>
  <HiPencilAlt onClick={()=>{ 
     
  
  }}  className='hover:bg-slate-500'/>
  
  </th>
  
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
 
    <HiTrash  className='hover:bg-slate-600' onClick={()=>{ 
     // deleteFromVehicleInfo(value.maintenanceId)
                             
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
  