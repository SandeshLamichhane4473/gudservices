import React, { useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
 
import { db } from '../../../firebase/Firebase';
import { setDoc } from 'firebase/firestore';
import { doc, deleteDoc } from "firebase/firestore";
import { storage } from '../../../firebase/Firebase';
import { uploadBytesResumable } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { ref } from 'firebase/storage';
import { deleteObject } from 'firebase/storage';
import Select from 'react-select';
import { updateDoc } from 'firebase/firestore';
import { collection,getDocs } from 'firebase/firestore';
import { HiMinus, HiPencilAlt, HiRefresh, HiTrash } from 'react-icons/hi';
import { UserAuth } from '../../../context/AuthContext';
import { getDoc } from 'firebase/firestore';
import Modal from './Modal';
import IncomeExpenseModal from './IncomeExpense';


export default  function Construction(){
  const { user  } = UserAuth();
    const propertyTypes = ['Land', 'Building', 'Others'];
    const [currentPropertyType, setCurrentPropertyType] = useState();
   const [valuationFiles , setValuationFiles]= useState([]);
   const [currentFileType, setCurrentFileType]= useState("");
   const [loading, setLoading]=useState(false);
   const inputRef = useRef(null);
   const selectRef = useRef(null);
   const [listOfFileNo, setOfFileNo]= useState([]);
   const [listFileNoSuggestion, setListFIleNoSuggestion]= useState([]);
   const [filteredData, setFilteredData]= useState([]);
   const [longTermStorageOfArray, setlongTermStorageOfArray]= useState([]);
   const [showModal, setShowModal] = React.useState(false);
   const [incomeExpenseModal, setIncomeExpenseModal] = React.useState(false);
   const [selectedConstMaintenanceInfo, setSelectedConstMaintenanceInfo]= useState({});
   
   let _selectedReferenceNo=[{}];;
  
   let listofUrls=[];
   const [fileAndUrls, setFileAndUrls]= useState([]);
   const [allConstructionIdAndInfo, setAllConstructionIdAndInfo]= useState([]);
  const [allfileTypeAndUrl, setAllFileTypeAndUrl]=useState([]);
  const [vehicleForm, setVehicleForm]= useState({ 
  vehicleId:"",
  vehicleNo:"",
  engineNo:"",
  changingNo: "",
  modelNo:"",
  makeYear:"",
  repairMaintenace:"",
  repairMaintenaceworkAmount:"",
  vehicleRemarks:""
});



   const [form, setform] = useState({ 
    constructionId: "",
    siteName: "",
    siteLocation: "",
    siteTenderAmount:"",
    account:"",
    
     vehicle:[    
    ],
    income:[],
     
    staff:[ 
    {
     staffId:"",
    staffDetails:"",
    staffAddress:"",
    staffPhone:"",
    staffPost:"",
    staffSalaryPayment:"",
    staffRemarks:""
    },
    {
        staffId:"",
       staffDetails:"",
       staffAddress:"",
       staffPhone:"",
       staffPost:"",
       staffSalaryPayment:"",
       staffRemarks:""
       }
    ]
});

async function clearInputField(){

  let docForms={
    constructionId: "",
    siteName: "",
    siteLocation: "",
    siteTenderAmount:"",
    account:"",
  };

  setform(docForms);
  
}

const callback = (childData) => {
    setShowModal(childData);
};

const incomeExpenseCallBack = (childData) => {
  setIncomeExpenseModal(childData);
};

async function CreateAndSaveConstruction(_constructionId){
try{

        setLoading(true);
        const constructionRef = doc(db, "construction", form.constructionId);
        await setDoc(constructionRef, form, {merge:true} );
        setLoading(false);
        swal("Success !!!", "information updated... Please refresh", "success");
        clearInputField();
        getAllConstructionInfo();
}
catch(e){
  swal(e)
}
};


async function editConstructionId(_constructionId){
   try {
  setAllFileTypeAndUrl([]);
  setValuationFiles([]);
  const docData=longTermStorageOfArray.filter((object)=>{
    return   object.constructionId===_constructionId
  });
  // setCurrentPropertyType(docData[0].propertyType);
  setform(docData[0]);//assigning to form
  // const newObjectArray= docData[0].files;
   
  // setTimeout(() => {
  //   setValuationFiles([]);
  //   if(newObjectArray ){
  //     console.log("  I am okey");
  //     setAllFileTypeAndUrl(newObjectArray);
  //     console.log(allfileTypeAndUrl)
  //    }
  // }, 2000);
 
   }
   catch(e){
    swal(e);
   }
}

async function getAllConstructionInfo(){
  try{

    const constructionRef = collection(db, "construction"); 
   const querySnapshot= await getDocs(constructionRef);
   
  setlongTermStorageOfArray([]);
   let tempdata=[];
   let tempCollDocData=[];
 console.log(querySnapshot.docs.length);
  //swal(querySnapshot.docs.length);

   if (querySnapshot.docs.length >0) {      
       querySnapshot.forEach((doc) => {      
        tempdata.push(doc.data())
       let tempValFileNo=doc.data()['constructionId'];
       const docData=    { value: tempValFileNo,  label: tempValFileNo };
       tempCollDocData.push(docData);       
       }
      );
      setListFIleNoSuggestion(tempCollDocData);
      let newTempData= tempdata.reverse();
      setAllConstructionIdAndInfo(newTempData);
      setlongTermStorageOfArray(newTempData);
      
    }else{
      setAllConstructionIdAndInfo(tempCollDocData);
      setlongTermStorageOfArray(tempCollDocData);

    }
  }
  catch(e){
    swal(e)
  }
}

 
async function deleteConstructionId(_constructionId){
  try{
    try{    
      if (!user || user.role !== 'admin') {
          swal("Warning !!!", "Unauthorize access", "error");
          return;
      }       
      const x = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover " ,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
   if(!x){
    return;
   }
     await deleteDoc(doc(db, `construction/${_constructionId}`)).catch(e => alert(e));   
     clearInputField();

     getAllConstructionInfo();
  }
  catch(e){
    swal(e);
  }

  }
  catch(e){
    swal(e)
  }

}

function removeFileNoFromSuggestion(fileNo){
 try{
    const newFileSuggestion= listFileNoSuggestion.filter(object=>{
      return object.value!==fileNo;
     });    
    setListFIleNoSuggestion(newFileSuggestion);
 }
 catch(e){
  swal(e);
 }
}

 
async function updateAndSaveValuationFile(){
 
    try {
           if(form.valuationFileNo==="")
            return;
          setLoading(true);
          const valuationDoc = doc(db, "valuation", form.valuationFileNo);
         await setDoc(valuationDoc, form, {merge:true} );
          swal("Success !!!", "User information updated... Please refresh", "success");
          if (selectRef.current) {
            selectRef.current.value = '';
            setCurrentPropertyType("Choose One");

          }
            
           getAllValuationFileNo();
       

    }
    catch (e) {
        swal("error"+e);
    }
    finally{
        setLoading(false);
    }
}

 async function deleteFromInputFileSelection(fileName){
  try{
    const filteredData=    valuationFiles.filter( (obj)=>{
      return obj.fileName.toString()!==fileName.toString() }) ;
      setValuationFiles(filteredData);
      inputRef.current.value=null;
  }
  catch(e){
    swal(e)
  }
}
 

async function deleteFileNo(FILENO){
 
}
    
   function manageObjectFiles(event){
        if(currentFileType===""  || currentFileType==="Select One"){
          inputRef.current.value=null;
            swal("Please select file type.")
            return;
        }   
     

         
        if(event.target.files){
            const newObjectType={
                 index:valuationFiles.length+1,
                 fileType: currentFileType,
                 objectFile : event.target.files[0],
                 fileName:event.target.files[0].name
         };   
               setValuationFiles(state=>[...state, newObjectType]);

               if(allfileTypeAndUrl.length>0){
                setAllFileTypeAndUrl([]);
               }
         }
    }

   async function uploadFile( valfileNo, pdffile, name, fileType){

    
        if (pdffile) {
            try {
              setLoading(true);    
              const storageRef = ref(storage, `valuation/${valfileNo}/${name}`);
              const uploadTask = uploadBytesResumable(storageRef, pdffile);
              const x = await uploadTask.on("state_changed",
                (snapshot) => {
                  setLoading(true);    
                  const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                     console.log("Progess"+ progress);
                },
                (error) => {
                  swal(error);
                },
                () => {
                   setLoading(true); 
                  getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log("url "+downloadURL);
                    const newDocObject={
                      fileType:fileType,
                      fileName:name,
                      fileUrl:downloadURL
                    };
                    listofUrls=[];
                    const docRef = doc(db, "valuation", valfileNo);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                      listofUrls= docSnap.data()['files'];  
                    }
                     listofUrls.push(newDocObject);
                     console.log("list of url");
                     console.log(listofUrls);
              
                    // if(listofUrls.length===valuationFiles.length){
                      const userDocRef = doc(db, "valuation", valfileNo);
                    //  await updateDoc(userDocRef, {files: listofUrls}, { merge: true });
                      await updateDoc(userDocRef, {files: listofUrls}, { merge: true });
                      inputRef.current.value=null;
                      swal("success", "success", "success");
                      setLoading(false);
                      setValuationFiles([]);
                      setCurrentFileType("Select One");
                      LoadDetailsFromId(valfileNo, listofUrls);
                    //}
                    
                     
                  });

                }
              );
              setLoading(false);
            }
            catch (e) {
              swal(e);
              setLoading(false);
            }
            finally{
              inputRef.current.val=null;
            }
            
    }
    }
//laod the de
async function LoadDetailsFromId(valno, _listofUrls){
  try{
   
  // console.log(listofUrls);
  // const newUpdate=  allValuationFileNo.map((object)=>{
  //     if(object.valuationFileNo===valno){
  //       object.files=_listofUrls;
  //       console.log(object);
  //       return object;
  //     }else{
  //       return object;
  //     } 
  //   });
  //  setAllValuationFileNo(newUpdate);
  

    //filter the long term storage
  // const update=  longTermStorageOfArray.map((object)=>{
  //     if(object.valuationFileNo===valno){
  //        object.files=_listofUrls;
  //        return object;
  //     }else{
  //       return object;
  //     }  
  //   });

  // setlongTermStorageOfArray(update);
 
   
 }
 catch(e){
   swal("Error "+e)
 }
}

// function to get all valuation file no
async function getAllValuationFileNo(){
try{

   const valuationRef = collection(db, "valuation"); 
   const querySnapshot= await getDocs(valuationRef);
   //setAllValuationFileNo([]);
  setlongTermStorageOfArray([]);

   let tempdata=[];
   let tempCollDocData=[];

   console.log(querySnapshot.docs.length);
   if (querySnapshot.docs.length >= 1) {      
       querySnapshot.forEach((doc) => {      
        tempdata.push(doc.data())
       let tempValFileNo=doc.data()['valuationFileNo'];
       const docData=    { value: tempValFileNo,  label: tempValFileNo };
       tempCollDocData.push(docData);       
       }
      );
      setListFIleNoSuggestion(tempCollDocData);
   let newTempData= tempdata.reverse();
 
  //setAllValuationFileNo(newTempData);
  setlongTermStorageOfArray(newTempData);


   }
  }
  catch(e){
    swal(e);
  }
};


 async function editValuationFileNo(valfileNo){
  //filter the  valfile no and put into the field
  setAllFileTypeAndUrl([]);
  setValuationFiles([]);

  
  // const docData=allValuationFileNo.filter((object)=>{
  //   return   object.valuationFileNo===valfileNo
  // });
  
   
  // setCurrentPropertyType(docData[0].propertyType);
  // setform(docData[0]);
  // const newObjectArray= docData[0].files;
   
  // setTimeout(() => {
  //   setValuationFiles([]);
  //   if(newObjectArray ){
  //     console.log("  I am okey");
  //     setAllFileTypeAndUrl(newObjectArray);
  //     console.log(allfileTypeAndUrl)
  //    }
  // }, 2000);

   
   //set it inside the form

 }

  ///load the valuation file no
  useEffect(()=>{
    //wait
  },[])
    return (
    <>
      <div className='w-auto   '>
          <div className=' overflow-y-scroll bg-white p-3 w-full shadow-sm shadow-gray-300   border-2 text-sm border-gray-400 '>
          <div className='flex  '>

                <div className='w-60   h-96 p-1'>
                   
                    <div className='flex flex-col pt-2 w-52 '>
                     <input type='text'  placeholder='Construction Id' value={form.constructionId}  onChange={(e)=>{setform({...form, constructionId: e.target.value}) ;  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className='flex flex-col pt-2 w-52'>
                     <input type='text'  placeholder='Site Name'  value={form.siteName}  onChange={(e)=>{setform({...form, siteName: e.target.value}) ;  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>

                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Site Location'   value={form.siteLocation} onChange={(e)=>{setform({...form, siteLocation: e.target.value});  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>

                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Site Tender Amount'   value={form.siteTenderAmount} onChange={(e)=>{setform({...form, siteTenderAmount: e.target.value});  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div> 
                
                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Account'   value={form.account} onChange={(e)=>{setform({...form, account : e.target.value});  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div> 
              
              {
                loading?<></>
                :
           
                <button className='bg-green-700 w-52 shadow-md shadow-gray-400 text-xs p-3 mt-5 hover:bg-sky-800 border rounded-lg  ' onClick={() => {
                            { 
                            if(form.constructionId!==""){
                              CreateAndSaveConstruction(form.constructionId); 
                            }
                               
                            }
                        }}>
                  Save
                </button> 
            }
          </div>


        

     <div className='w-60   h-96 p-1'>
                
                <div className='flex flex-col pt-2 w-52 '>
                     <input type='text'  placeholder='Vehicle Id' value={vehicleForm.vehicleId}  onChange={(e)=>{setform({...vehicleForm, vehicleId: e.target.value}) ;}} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
     
    

                <div className='flex flex-col pt-2 w-52'>
                     <input type='text'  placeholder='Vehicle No' value={vehicleForm.vehicleNo}    onChange={(e)=>{setform({...vehicleForm, vehicleNo: e.target.value}) ;}} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                 
    
                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Changing No'   value={ vehicleForm.changingNo} onChange={(e)=>{setform({...vehicleForm, changingNo: e.target.value});  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>

                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Model No'   value={vehicleForm.modelNo} onChange={(e)=>{setform({...vehicleForm, modelNo: e.target.value});  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                 
                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Make Year'   value={vehicleForm.makeYear} onChange={(e)=>{setform({...vehicleForm, makeYear: e.target.value});  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Repair Vehicle Maintanance '   value={vehicleForm.repairMaintenace} onChange={(e)=>{setform({...vehicleForm, repairMaintenace: e.target.value});  }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Reapir Maintenance Work Amount'   value={vehicleForm.repairMaintenaceworkAmount} onChange={(e)=>{setform({...vehicleForm, repairMaintenaceworkAmount: e.target.value}); }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>
                <div className='flex flex-col pt-2 w-52 '>
                    <input type='text'  placeholder='Vehicle Remarks'   value={vehicleForm.vehicleRemarks} onChange={(e)=>{setform({...vehicleForm, vehicleRemarks: e.target.value}); }} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>

           
                <Modal value={showModal}  constructionId={selectedConstMaintenanceInfo.constructionId} maintenanceInfo={selectedConstMaintenanceInfo.vehicle}    callback={callback} />
              
     
        {/* <button
          className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Open regular modal
        </button>
               */}
              {
                loading?<></>
                :
           
                <button className='bg-green-700 w-52 shadow-md shadow-gray-400 text-xs p-3 mt-5 hover:bg-sky-800 border rounded-lg  ' onClick={() => {
                            { 
                            if(vehicleForm.vehicleId==""){
                               
                            }
                            }
                        }}>
                  Save
                </button> 
            }
          </div>

         
                 <div className='  w-96 pt-2'>
                 <label className='text-gray-500 mt0 mb-2 block'>Valuation File No </label>
                <Select className='text-xs   text-black border-gray-400 rounded-lg w-full   mb-2 font-normal text-blackext-black '
                                options={listFileNoSuggestion}                            
                                placeholder="Select Valuation FileNo"
                                defaultSelectValue="Select Valuation FileNo"
                                isSearchable
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused ? 'black' : 'green',
                                    backgroundColor:'#dfdfdf'
                                  }),
                                }}  
                                onChange={(e) =>{
                                  inputRef.current.value=null;
                                  editValuationFileNo(e.value);
                                 
                                 // 
                                //  LoadDetailsFromId(e.value);
                                }
                                }
                            />
                 <select   value={currentFileType} onChange={ (event)=>{setCurrentFileType(event.target.value)}}  className='  bg-gray-200 border-gray-400 rounded-lg w-full  p-2 font-normal text-black' >
                    <option selected  className='bg-gray-600 rounded-lg   font-normal text-white' value="Select One">Select One</option>
                    <option className=' bg-white rounded-lg   font-normal text-black' value="Lalpurja">Lalpurja</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value="Naksa">Naksa</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value="Other">Other</option>
                    </select>  
                  <label for="first_name" placeholder='Policy No' class=" mb-2  text-xs font-bold text-gray-500">File Type</label>

                    <input type='file'  ref={inputRef}  accept="" onChange={(event)=>{manageObjectFiles(event)}}
                    className='ml-0 mt-6 p-2 bg-gray-200 rounded-lg   font-normal text-gray-500' name='BlueBook' placeholder='Select BlueBook Image' />
                 
                 <ul className=' text-slate-500 mt-3 pt-3 pb-3'>
                        {
                         valuationFiles &&   valuationFiles.map((e, index)=>{
                                return (
                                <li  className='cursor-pointer' key={index}>
                                    <div className='flex   '>
                                    <label className='mr-2 w-20'>{index}</label>
                                        <label className='mr-2 w-20'>{e.fileType}</label>
                                        <label className='mr-2  bg-red w-44  block overflow-clip'> {e.objectFile.name.toString().slice(0,20) }</label>
                                        <label onClick={async ()=>{
                                                                           
                                        deleteFromInputFileSelection(e.fileName.toString());    
                                                                              
                                        }} className='mr-2 text-red-600 underline cursor-pointer'> <HiMinus  className='hover:bg-slate-500 bg-slate-300 rounded-lg'/></label>
                                    </div>
                                   </li>);
                            })
                         }

{
                         allfileTypeAndUrl &&   allfileTypeAndUrl.map((e, index)=>{
                                return (
                                <li  className='cursor-pointer' key={index}>
                                    <div className='flex   '>
                                    <label className='mr-2 w-20'>{index}</label>
                                        <label className='mr-2 w-20'>{e.fileType}</label>
                                        <label className='mr-2  bg-red w-44  block overflow-clip'> {e.fileName.toString().slice(0,20) }</label>
                                        <label onClick={async ()=>{
                                                                           
                                        //deleteFromStorage(form.valuationFileNo, e.fileName.toString());    
                                                                              
                                        }} className='mr-2 text-red-600 underline cursor-pointer'> <HiTrash  className='hover:bg-slate-600'/></label>

                                    </div>
                                   </li>);
                            })
                         }
                    </ul>
                 {loading?<><h3 className='  text-black'>................</h3></>:
          <button className='bg-green-600 w-52 shadow-md shadow-gray-400 text-xs p-3 mt-3 hover:bg-sky-800 border rounded-lg  ' 
          onClick={
            async() => { 
            
            if(currentFileType==="" || currentFileType==="Select One"){
              swal(currentFileType);
                 return;
                }
            if(form.valuationFileNo===""){
              swal("Please select the valuation file no")
              return;
            }
           
            if(valuationFiles.length<1  || valuationFiles.length>1 ){
              swal("Only one file can be save at a time,either 0 file or more than 1 file selected. ");
              return;
            };

            

            uploadFile( form.valuationFileNo, valuationFiles[0].objectFile, valuationFiles[0].objectFile.name, valuationFiles[0].fileType);           
           
 
          // valuationFiles && valuationFiles.map((object, index)=>{
          //  uploadFile( form.valuationFileNo, object.objectFile, object.objectFile.name, object.fileType);
          //   })
          }}      
     > Save</button>   
                        }     
                 
            </div>
          </div>


      <div className='  bg-gray-300 p-1 mt-2      '>      

      <div className='  flex'>
      <Select className='text-xs w-56  text-black border-gray-400 rounded-lg   mb-2 font-normal text-blackext-black '
                                options={listFileNoSuggestion}                            
                                placeholder="Select Construction Id"
                                defaultSelectValue="Select Construction"
                                isSearchable
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused ? 'black' : 'green',
                                    backgroundColor:'#dfdfdf'
                                  }),
                                }}  
                                onChange={(e) =>{
                                  setform({...form,valuationFileNo: e.value});
                                   const filteredData=  longTermStorageOfArray.filter((object)=>{
                                    return object.valuationFileNo===e.value
                                  });

                                 // setAllValuationFileNo(filteredData);

                                }
                              }
                            />

    <HiRefresh  onClick={()=>{
      //resetformElement();
     // getAllValuationFileNo();

    }} className='ml-5 cursor-pointer hover:bg-slate-500  text-indigo-950'   size={"30px"} />
        
        </div> 
     
           
 
<div className='overflow-scroll overflow-x-scroll w-[1100px] pb-3 '> 
<table className=" text-lg text-left   text-white dark:text-white border-separate   shadow-lg shadow-gray-400 ">
<thead className="text-xs text-black uppercase bg-gray-50 dark:bg-inherit  ">

                              <tr className='bg-blue-100' >
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <HiRefresh onClick={() =>  getAllConstructionInfo()} className='text-xs cursor-pointer rounded hover:rounded-lg hover:bg-orange-700' />
                                            <label for="checkbox-all-search" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                  
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                       Site NAME
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                         Location
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        Tndr Amt
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                      Account
                                    </th>
                                 
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                      Income/Expense
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                      Maintenance
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

  allConstructionIdAndInfo.map((value, index)=>{
 return (
  <tr  className='hover:bg-slate-300'>
  <th scope="row" className="px-2 py-2  font-semibold text-gray-900 whitespace-nowrap ">
    {value.constructionId}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
    {value.siteName}
  </th>
  <th scope="row" className="px-2 py-2 font-semibold text-gray-900 whitespace-nowrap ">
  {value.siteLocation}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.siteTenderAmount}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  <button  className='text-indigo-950 underline'   onClick={()=>{
               
                 setSelectedConstMaintenanceInfo(value);
                _selectedReferenceNo[0]=value;
                setTimeout(() => {
                   setShowModal(true)
                }, 500);
              

              
                }}>
                  Manage
                
                </button>
  </th>

  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
    <IncomeExpenseModal constructionId={selectedConstMaintenanceInfo.constructionId} maintenanceInfo={selectedConstMaintenanceInfo.vehicle} value={incomeExpenseModal}  incomeExpenseCallBack={incomeExpenseCallBack} />
  <button  className='text-indigo-950 underline'   onClick={()=>{
               
                 setSelectedConstMaintenanceInfo(value);
                _selectedReferenceNo[0]=value;
                setTimeout(() => {
                   setIncomeExpenseModal(true);              
                })
              }}
              >
                  Change
                
                </button>
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.account}
  </th>


    
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap " onClick={()=>{
     
  }}>
  <HiPencilAlt onClick={()=>{editConstructionId(value.constructionId)}}  className='hover:bg-slate-500'/>
  
  </th>
  
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
 
    <HiTrash  className='hover:bg-slate-600' onClick={()=>{ 
                              deleteConstructionId(value.constructionId);    }
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
        </div>
    </>)
}