import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert';
import { addDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/Firebase';
import { updateDoc } from 'firebase/firestore';
import { storage } from '../../../firebase/Firebase';
import { ref } from 'firebase/storage';
import { uploadString } from 'firebase/storage';
import { uploadBytesResumable } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { collection } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';
import { HiEye, HiTrash } from 'react-icons/hi';
import { HiBadgeCheck } from 'react-icons/hi';
import { HiX } from 'react-icons/hi';
import {HiOutlineMinusCircle} from 'react-icons/hi'
import { UserAuth } from "../../../context/AuthContext";




export default function FileSubmitDate({ selectedRef, setOpenEditTab, callbackRefNo }) {
  const [showModal, setShowModal] = useState(false);

  const { user, logout, userRole, setUserData } = UserAuth()

  useEffect(()=>{
    //alert("i am called in use effect")
  }, [])

    const [form, setform] = useState({
      referenceNo: selectedRef.referenceNo,
      expectedFee: selectedRef.expectedFee && selectedRef.expectedFee !== "" ? selectedRef.expectedFee : "",
      actualFeePaid: selectedRef.actualFeePaid && selectedRef.actualFeePaid !== "" ? selectedRef.actualFeePaid : "",
      feeReceiptDate: selectedRef.feeReceiptDate && selectedRef.feeReceiptDate !== "" ? selectedRef.feeReceiptDate : "",
      fileReceiptDate: selectedRef.fileReceiptDate && selectedRef.fileReceiptDate !== "" ? selectedRef.fileReceiptDate : "",
      fileSubmitDate: selectedRef.fileSubmitDate && selectedRef.fileSubmitDate !== "" ? selectedRef.fileSubmitDate :""
  });
  
   
    const [loading, setLoading]=useState(false);
    const [btnFileLoading, setbtnFileLoading] = useState(false);
    const [useSurveyReportFile, setSurveyReportFile] = useState("");
    const [useFileTypeSelected, setFileTypeSelected]=useState("Select One");
    const [dbOthersFileDetails, setDbOthersFileDetails]=useState([]);
    const [loadingtableFile, setLoadingTableFile]= useState(false);

    
    const  refSurveyReportFile =useRef();
    const  refFileTypeSelected = useRef();

    const [btlSubmitFileLoading, setBtnSubmitFileLoading]=useState(false);
    function handleFile1Change(e) {
        setSurveyReportFile(e.target.files[0]);
    }

//Function to check its validity of date &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
function   IsDateValid(_incomingDate){
  if(_incomingDate==="" || !_incomingDate || _incomingDate===null || _incomingDate===undefined){
          return false;
     }
 
   let today = new Date().toISOString().slice(0, 10);; //1375077000000 
   var incomingDate = new Date(_incomingDate).getTime() ; //1375077000000 
   var todayDate = new Date(today).getTime() ;//1375080600000 
   if( incomingDate >todayDate){
    swal("Fee ||File submit date  is greater than today ");
    return false;
    } 
    return true;
  }


//#####################  MAKE DATABASE RECORD EMPTY #####################
  async function dbRecorsMakeEmpty(){
    try{
      const  emptyDocData={
        expectedFee: Number(0),
        actualFeePaid:Number(0),
        feeReceiptDate:"",
        fileReceiptDate:"",
        fileSubmitDate:"",
    }
 
 // const userDocRef = doc(db, "testreference", selectedRef.referenceNo);
 //real db reference  and test db is testreference
  const userDocRef = doc(db, "reference", selectedRef.referenceNo);
   await updateDoc(userDocRef, emptyDocData, { merge: true })
  
   setShowModal(false);
   let x=form.expectedFee;

  selectedRef.expectedFee=Number(0);
  selectedRef.actualFeePaid=Number(0);
  selectedRef.feeReceiptDate="";
  selectedRef.fileSubmitDate="";
  selectedRef.fileReceiptDate="";
  setform({
    expectedFee: Number(0),
    actualFeePaid:Number(0),
    feeReceiptDate:"",
    fileReceiptDate:"",
    fileSubmitDate:"",
     });
  
  callbackRefNo(selectedRef.referenceNo);
  swal("Success !!!", "All record cleared.");

}
catch(e){
      swal("Error on deleting"+e)
   }
}

//// &&&&&&&&&&&&&&&& UPdate fee and file info to firestoe $$$$$$$$$$$$ &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
async function updateFileInfoToFirestore(){
     try{
       
      const regEx = new RegExp('^[0-9]+$');
      //check the expected fee
      if(form.expectedFee >0){
          if( !regEx.test(form.expectedFee ) || form.expectedFee<10){       
          swal(
            "Only numbers are accepted.Invalid  expected fee"
          );
          return;
          }  
        }
        
        ///check the actual fee paid
      if(form.actualFeePaid >0){
          if( !regEx.test(form.actualFeePaid)  || form.actualFeePaid<10){       
          swal(
          "Only numbers are accepted.Invalid  actual fee fee"
          );
          return;
           }  
        }
  //############   check fee #########################
      if (Number(form.expectedFee) < Number(form.actualFeePaid)) {
           swal("Expected fee is less than actual fee paid");
          return;
          }

 //####################  CHECK THE DATE REFREENCE ##############
  const _date1= new Date(form.feeReceiptDate);
  const _date2= new Date(form.fileSubmitDate);
  let today = new Date().toISOString().slice(0, 10);
  var feeDate = new Date(form.feeReceiptDate).getTime() ; //1375077000000 
  var fileDate = new Date(form.fileSubmitDate).getTime() ; 
  var todayDate = new Date(today).getTime() ;//1375080600000 
 
  //check the fee receipt date
   if(form.feeReceiptDate!==""){
      var feeReceiptDate = new Date(form.feeReceiptDate).getTime() ;
       if(feeReceiptDate> todayDate ){
        swal("Fee Receipt date  is greater than today ");
        return;
        }
     } 
 
    if(form.fileReceiptDate!==""){
       var fileReceiptDate = new Date(form.fileReceiptDate).getTime() ;
      if(fileReceiptDate> todayDate ){
       swal("File Receipt date  is greater than today ");
      return;
        }
     } 
    
     if(form.fileSubmitDate!==""){
       var fileSubmitDate = new Date(form.fileSubmitDate).getTime() ;
        if(fileSubmitDate> todayDate ){
           swal("File submit date  is greater than today ");
           return;
          }
      }

 
  // ##### LETS UPDATE INTO FIRESTORE ##################
  setBtnSubmitFileLoading(true);
  //real db testreference  and  testdb is : testreference
  const userDocRef = doc(db, "reference", selectedRef.referenceNo);
  await updateDoc(userDocRef, form, { merge: true })
  swal("Success !!!", "updated");

 
  selectedRef.expectedFee=form.expectedFee;
  selectedRef.actualFeePaid=form.actualFeePaid;
  selectedRef.feeReceiptDate=form.feeReceiptDate;
  selectedRef.fileSubmitDate=form.fileSubmitDate;
  selectedRef.fileReceiptDate=form.fileReceiptDate;
  setBtnSubmitFileLoading(false);
  callbackRefNo(selectedRef.referenceNo);
  }
  catch(e){
    swal("Error "+e);
  }
}

//##############################  DELETE THE OTHERS FILE DELET E##########################
async function handlOtherFilesDelete(fileName, docId){

  if (!user || user.role !== 'admin') {
         swal("Warning !!!", "Unauthorize access", "error");
         return;
     }

       if(!fileName)
          {
           swal("empty file name")
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

    try{
          await setLoadingTableFile(true);
          //note real firestore collection id name is : testotherfiles and real firestore name is: otherfiles
          await deleteDoc(doc(db, `otherfiles/${selectedRef.referenceNo}/fileDetails/${docId}`)).catch(e => alert(e));
          const desertRef = ref(storage, `otherfiles/${selectedRef.referenceNo}/${fileName}`);
          await deleteObject(desertRef).then(async () => {
          swal("Successfully deleted");
          getAllTableFileDetail();
          setLoadingTableFile(false);
          }).catch((error) => {
          swal(error);
          setLoadingTableFile(false);
        });
      }
      catch(e){
        swal("Error"+e);
      }
    
    }
    
//************************** GET ALL TABLE FILE DETAILS &*&*&*&*&*&*&*********************** */
async function getAllTableFileDetail() {
               setLoadingTableFile(true)
              try {
        // const q = query(collection(db, `vehicleInfo/${selectedPdfFile}/${selectedRef.referenceNo}/${name}`"), where("capital", "==", true));
       //real collecction id is: therfiles  and test is testotherfiles
        const fileQuery = query(collection(db, `otherfiles/${selectedRef.referenceNo}/fileDetails/`));
        const querySnapshot = await getDocs(fileQuery);
        let temDbFileArray = [];
        querySnapshot.forEach((doc) => {
        const newDocData = {
            docId: doc.id,
            fileName: doc.data()['fileName'],
            fileType: doc.data()['fileType'],
            fileUrl: doc.data()['fileUrl'],
          }
          temDbFileArray.push(newDocData);
        });
  
        setDbOthersFileDetails(temDbFileArray);
        setLoadingTableFile(false);
      }
  
      catch (e) {
        swal("Error" + e);
        setLoadingTableFile(false);
      }

    }

    ///&&&&&&&&&&&&&&&&&&&&&&  FUNCTION FOR EDITING AND SAVING FILE &&&&&&&&&&&&&&&&&&&&&&&&&&&&
    async function editAndSave() {
     //check the file type
      if(useFileTypeSelected==="Select One" || useFileTypeSelected===""){
            swal("Select File Type");
            return;
        }

      if(useSurveyReportFile==="" || !useSurveyReportFile){
        swal("Please select file");
        return;
      }
       
    //check the database before updating there.....
      // if(dbOthersFileDetails.length<1){
      //   getAllTableFileDetail();
      // }

      let fileAlreadyExists=false;
      dbOthersFileDetails && dbOthersFileDetails.map((object, index) => {
      
      if(object['fileName']===useSurveyReportFile.name){
        fileAlreadyExists=true;
        }      
      }
    );

    if(fileAlreadyExists){
      swal("File name already exists")
      return;
    }

    //Check up the file name**********************
        if(useSurveyReportFile){
        const fileName= useSurveyReportFile.name;
        if(fileName){
        const fileType=fileName.split(".")[1];                
        if(fileType==="pdf" || fileType==="xlsx" || fileType==="docs" || fileType==="PNG" || fileType==="png"){}
        else{
          // swal(fileType +"Only pdf/xlsx/docs/PNG is Supported");
         //  return;
        } 
       }
      }

///lets insert into the firebase....
    if (useSurveyReportFile) {
            setbtnFileLoading(true);
            try { 
              /////real db////// otherfiles  //test db: testotherfiles
                const storageRef = ref(storage, `otherfiles/${selectedRef.referenceNo}/${useSurveyReportFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, useSurveyReportFile);
                const x = await uploadTask.on("state_changed",
                    (snapshot) => {
                        const progress =
                            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100); 
                            console.log("Progess"+ progress.toString());
                    },
                    (error) => {
                      setbtnFileLoading(false);
                        swal("Error : "+error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {                     
                            //real db is : otherfiles and test db is : testotherfiles
                            const userDocRef = collection(db, `otherfiles/${selectedRef.referenceNo}/fileDetails/`);
                            const docData = { fileName: useSurveyReportFile.name, fileType: useFileTypeSelected, fileUrl: downloadURL }
                          
                            await addDoc(userDocRef, docData)
                              .then(docRef => {
                                setbtnFileLoading(false);
                                swal("Successfull");                 
                                refFileTypeSelected.current.value="Select One";
                                refSurveyReportFile.current.value="";
                                setSurveyReportFile("")
                                setFileTypeSelected("")
                  
                               getAllTableFileDetail();
                                //clear the form field value
                             
                              })
                              .catch(error => {
                                swal("Error :"+error);
                                setbtnFileLoading(false);
                              })
                            //*********************************** */
                          }).catch(error => {
                            swal("Error"+error);
                            setbtnFileLoading(false);
                          })
                        });
                    //**************** PLEASE CHECK THE CALL BACK REFERENCE NO ############### */
                    // callbackRefNo(selectedRef.referenceNo);
            
            }
            catch (e) {
                swal(e);
                setbtnFileLoading(false);
            }
        }
    }

    return (
        <div className='bg-white px-10 py-6 w-2/3 shadow-lg shadow-gray-300   border-2 text-sm border-gray-400'>
            <div className='   '>
             <div className=''>
               <div>
               <div className=' p-6 hover:shadow-lg shadow-md  shadow-gray-600 border border-gray-500 rounded-lg'>
                <h1 className='text-xm text-yellow-500 font-semibold'>File Details <span className='  ml-0'> {selectedRef.referenceNo} <span className='text-sm text-gray-400'>{selectedRef.insurance}</span> </span>
                    <span onClick={() => { setOpenEditTab(false) }} className='text-xm border  rounded-lg p-2 hover:bg-slate-100 text-green-600 cursor-pointer ml-5'>Go Back</span>
                </h1>

                <div class="grid grid-cols-1 mt-5  gap-5">
                    {/* value={form.representativeName} placeholder='Ex. Mamata Yadav' onChange={(e) => setform({ ...form, representativeName: e.target.value })}  */}
                    <div className='flex flex-col mt-4 '>
                        <label for="first_name" class=" mb-2  text-sm  font-normal text-gray-500 ">Select File Type</label>
                    <div className='bg-transparent   text-white   text-1xl font-medium ' >
                    <select onChange={(event) => setFileTypeSelected(event.target.value)} ref={refFileTypeSelected}   className='mr-3 text-sm p-2  w-2/3 bg-gray-200 rounded-lg   font-normal text-black' >
                    <option selected disabled className='bg-gray-200 rounded-lg   text-sm font-semibold text-gray-800' value="Select One">Select One</option>
                    <option className='bg-gray-200 rounded-lg   font-semibold text-gray-950  text-sm ' value="SurveyReport">Survey Report</option>
                    <option className='bg-gray-200 rounded-lg   font-semibold text-black  text-sm ' value="MilapatraReport">Milapatra Report</option>
                    <option className='bg-gray-200 rounded-lg   font-semibold text-black text-sm' value="PoliceReport">Police Report</option>
                    <option className='bg-gray-200 rounded-lg  font-semibold text-black text-sm' value="InsurancePolicy">Insurance Policy</option>
                    <option className='bg-gray-200 rounded-lg  font-semibold text-black text-sm' value="ClaimForm">Claim Form</option>
                    <option className='bg-gray-200 rounded-lg  font-semibold text-black text-sm' value="IntimationLetter">Intimation Letter</option>
                    <option className='bg-gray-200 rounded-lg  font-semibold text-black text-sm' value="SurveyAppointmentLetter">Survey Appointment Letter</option>
                     <option className='bg-gray-200 rounded-lg  font-semibold text-black text-sm' value="Estimate">Estimate</option> 
                     <option className='bg-gray-200 rounded-lg  font-semibold text-black text-sm' value="Bill">Bill</option> 
                     <option className='bg-gray-200 rounded-lg  font-semibold text-black text-sm' value="FinalAdminReport">Final Admin Report</option> 
                     <option className='bg-gray-200 rounded-lg  font-semibold text-black text-sm' value="Others">Others</option> 

                    </select>
                     </div>
                    </div>

                    <div className='flex flex-col mt-4 '>
                        <label for="first_name" class=" mb-2  text-sm font-normal text-gray-500 ">Select File Type -(pdf, excel, docs, PNG)</label>
                        <input type='file' ref={refSurveyReportFile}  onChange={handleFile1Change} placeholder='Remarks' className=" rounded-lg p-2  w-2/3 placeholder:text-gray-500 bg-gray-200 text-sm text-black" />
                    </div>

                    {btnFileLoading ?
                        <ThreeDots
                            className="ml-3"
                            height="80"
                            width="80"
                            radius="9"
                            color="#4fa94d"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        /> :
                        <button 
                          
                        className=' text-green text-1xl text-black w-28 p-3 mt-7 hover:bg-green-400 hover:text-white border rounded-lg shadow-lg' onClick={() => {
                            { editAndSave(); }
                        }}> Save</button>
                    }

                    {
                        selectedRef.reportUrl && <a href={selectedRef.reportUrl} className='text-sm underline text-yellow-400' target='_blank'>Click here to view reports</a>
                    }
                </div>



                <div  className="grid grid-col-1 overflow-x-auto   ">
                    <div className='h-8'></div>
                  <frameElement>
                    <div className='flex flex-row'> 
                    <button  className='border p-3  text-green-500 underline  hover:bg-blue-600 hover:text-white' onClick={()=>{
                      getAllTableFileDetail();
                    }}>  Refresh to load files</button>
                     <div className="text-gray-300">
                      <span className="text-xs overflow-hidden whitespace-nowrap">{user.name +'/'+user.email+'/'+user.role+'/'+user.insurance}</span>
                     </div>

                    </div>
                    <table   className=' border-collapse w-full  border-spacing-1 min-w-max   text-sm '>
                    <thead >
                  <tr  className=' bg-blue-200 text-black '>
                    <th className="border px-3 py-2 w-20  ">SN</th>
                    <th className="border px-3 py-2  ">File Name</th>
                    <th className="border px-3 py-2  ">Files</th>
                    <th className="border px-3 py-2" >View File</th>
                    <th className="border px-3 py-2  ">Delete</th>
                  </tr>
                </thead>
                     {
                      loadingtableFile ?
                      <tr className='   w-2/3 h-10'>
                       <td></td>
                       <td></td>
                      <td className='text-center text-black'>Loading....</td>
                      <td></td>
                      <td></td>
                      </tr>
                        :
           
                      <tbody>
                      {
                        dbOthersFileDetails && dbOthersFileDetails.map((object, index)=>{
                          return(
                            <tr className='border text-black'  key={index}>
                            <td className="px-6 py-4 border w-20"> {index+1}</td>
                            <td className="px-6 py-4 border">{object['fileName']}</td>
                            <td className="px-6 py-4 border">{object['fileType']}</td>
                            <td className="px-6 py-4 border rounded-lg focus:bg-slate-600  text-teal-700">
                           
                              <a href={object['fileUrl']}  className='hover:bg-orange-600' target="_blank"><HiEye /></a></td>
                            <td className="px-6 py-4 border">
                              <HiTrash onClick={() => {    
                                handlOtherFilesDelete(object['fileName'], object['docId'])                    
                            }} className='cursor-pointer hover:bg-red-600 hover: rounded-lg'></HiTrash></td>      
                          </tr>
                          );
                        })
                      }
                     
                      </tbody>
                }
                    </table>
                  </frameElement>
                </div>
               </div>
            </div>

            <div className='h-11'>
                {/* New div */}
            </div>
            {/* File Submit and Fee details */}
            <div className= ' px-6 py-5 font-mono bg-white  shadow-md shadow-gray-600 hover:shadow-gray-500 hover:shadow-lg'>
             <h1 className='text-sm text-orange-600 font-semibold'>File Submit and Fee Detail <span className='  ml-0'> {selectedRef.referenceNo} <span className='text-sm text-gray-400'>{selectedRef.insurance}
             </span> </span>       
            </h1>
           
           
            <div className='flex flex-col pt-4'>
                  <label for="first_name" placeholder='Policy No' class=" mb-1  text-sm font-bold text-black">Expected Survey Fee  (NRS min(100))</label>
                  <input type='number' value={form.expectedFee} onChange={(e) => setform({ ...form, expectedFee: Number(e.target.value) })} placeholder='NRP : 1000/-'   className='p-2 text w-2/3 rounded  placeholder:text-gray-500 text-black bg-gray-200 ' />
            </div>


            <div className='flex flex-col pt-4'>
                      <label for="first_name" placeholder='Policy No' class=" mb-1   font-bold text-black">Actual Survey Fee</label>
                    <input type='number' value={form.actualFeePaid} onChange={(e) => setform({ ...form, actualFeePaid: Number(e.target.value) })} placeholder='Rs : 5000/-' className='p-2 bg-gray-200 w-2/3 rounded  placeholder:text-gray-500 text-black bg-gray-200 ' />
            </div>


            <div className='flex flex-col pt-4'>
                      <label for="first_name" placeholder='Policy No' class=" mb-1   font-bold text-black">Fee Receipt Date</label>
                    <input type='date' value={form.feeReceiptDate} placeholder='2023/10/12' onChange={(e) => setform({ ...form, feeReceiptDate: e.target.value })}  className='p-2 bg-gray-300 w-2/3 rounded  placeholder:text-gray-500 text-black bg-gray-200 ' />
            </div>

            <div className='flex flex-col pt-4'>
                      <label for="first_name" placeholder='File Receipt Date' class=" mb-1    font-bold text-black">Documents Receipt Date</label>
                    <input type='date' value={form.fileReceiptDate} placeholder='2072-12-15' onChange={(e) => setform({ ...form, fileReceiptDate: e.target.value })} className='p-2 bg-gray-300 w-2/3 rounded  placeholder:text-gray-500 text-black bg-gray-200 ' />
            </div>
            
            <div className='flex flex-col pt-4'>
                      <label for="first_name" placeholder='Policy No' class=" mb-1    font-bold text-black">File Submit Date</label>
                    <input type='date' value={form.fileSubmitDate} placeholder='2072-12-15' onChange={(e) => setform({ ...form, fileSubmitDate: e.target.value })} className='p-2 bg-gray w-2/3 rounded  placeholder:text-gray-500 text-black bg-gray-200 ' />
            </div>

            <div className='flex flex-col pt-9'>
              {
                btlSubmitFileLoading?
                <button 
                disabled
                 className='   w-32    p-3  font-semibold rounded-lg hover:bg-blue-800 text-white'>
                   <span className='bg-gray'>
                     Saving...
                   </span>
           </button>

           :
              <button 
                     onClick={() => 
                     {
                      updateFileInfoToFirestore(); 
                      }} className='  w-28 text-black shadow-md shadow-gray-300   p-3  font-semibold rounded-lg hover:bg-green-800 hover:text-white '>
                        <span className='bg-gray'>
                          Save
                        </span>
                </button>

                    }
              </div>

              {/* TABLE INFORMATION -------------%%%%%%%%%%%%%%----------------- */}
              <div  className="grid grid-col-1 overflow-x-auto   ">
                    <div className='h-8'></div>
                  <frameElement>
                <table   className=' border-collapse w-full  border-spacing-1 min-w-max   bg-gray '>
                    <thead >
                  <tr className='bg-blue-200 text-black'>
                    <th className="border px-3 py-2 w-20  ">SN</th>
                    <th className="border px-3 py-2  ">Expected Survey Fee </th>
                    <th className="border px-3 py-2  ">Actual Survey Fee</th>
                    <th className="border px-3 py-2" >Fee Payment Date</th>
                    <th className="border px-3 py-2  ">Fee Status</th>
                    <th className="border px-3 py-2  ">File Receive Date</th>
                    <th className="border px-3 py-2  ">File Submit Date</th>
                      <th className="border px-3 py-2  "> Trash</th>
                  </tr>
                </thead>
                     {
                      loadingtableFile ?
                      <tr className='   w-2/3 h-10'>
                       <td></td>
                       <td></td>
                      <td className='text-center text-black'>Loading....</td>
                      <td></td>
                      <td></td>
                      </tr>
                        :
           
                      <tbody>
                      {
                        
                            <tr className='border text-black'>
                            <td className="px-6 py-4 border w-20"> <span>{ 1}</span></td>
                            <td className="px-6 py-4 border  ">{selectedRef.expectedFee>10?  <span> {selectedRef.expectedFee+"/-" } </span> : <HiX className='bg-orange-600 rounded-full text-3xl' />}</td>
                            <td className="px-6 py-4 border">{selectedRef.actualFeePaid>10?  <span> {selectedRef.actualFeePaid+"/-" } </span> : <HiX className='bg-orange-600 rounded-full text-3xl' />} </td>
                            <td className="px-6 py-4 border rounded-lg">{selectedRef.feeReceiptDate?  <span> {selectedRef.feeReceiptDate } </span> : <HiX className='bg-orange-600 rounded-full text-3xl' />} </td>
                            <td className="px-6 py-4 border rounded-lg"> {selectedRef.actualFeePaid>10?<HiBadgeCheck className='text-4xl text-green-500' />:<HiX className='bg-orange-600 rounded-full text-3xl' />} </td>
                           
                            <td className="px-6 py-4 border"> 
                              {    IsDateValid(selectedRef.fileReceiptDate)? selectedRef.fileReceiptDate :<HiX className='bg-orange-600 rounded-full text-3xl' />}
                               </td> 
                            <td className="px-6 py-4 border"> 
                              {    IsDateValid(selectedRef.fileSubmitDate)? selectedRef.fileSubmitDate :<HiX className='bg-orange-600 rounded-full text-3xl' />}
                               </td>  
                             
                              <td  className="px-6 py-4 cursor-pointer border text-orange-500">
                                <HiOutlineMinusCircle className='  hover:text-xm ' 
                                onClick={()=>{  setShowModal(true) }         } /></td> 
                          </tr>
                         
                       
                      }
                     
                      </tbody>
                }
                    </table>
                  </frameElement>
                  </div> 
                </div>
               </div>
            </div>
            
        <>
            {showModal ? (
                <>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="fixed inset-0 w-full h-full bg-black opacity-40"
                            onClick={() => setShowModal(false)}
                        ></div>
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                                <div className="mt-3 sm:flex">
                                    <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 text-red-600"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >

                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-2 text-center sm:ml-4 sm:text-left">
                                        <h4 className="text-lg font-medium text-gray-800">
                                            Delete Records ?
                                        </h4>
                                        <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                                            Expected fee, Actual fee, Fee payment date, File submit date will be deleted
                                        </p>
                                        <div className="items-center gap-2 mt-3 sm:flex">
                                            <button
                                                className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                                onClick={() =>
                                                  dbRecorsMakeEmpty()
                                                }
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                                onClick={() =>
                                                  setShowModal(false)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
        
        </div>
    )
}

