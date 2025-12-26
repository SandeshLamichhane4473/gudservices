import React, { useEffect, useRef, useState } from 'react';
import { startAt } from 'firebase/firestore';
import swal from 'sweetalert';
import { query, orderBy,limit } from 'firebase/firestore'; 
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
import { HiBookmark, HiChartPie, HiCheck, HiCloudUpload, HiMinus, HiOutlineFastForward, HiPencilAlt, HiPlusSm, HiRefresh, HiStop, HiTrash, HiUserAdd, HiVideoCamera, HiZoomIn } from 'react-icons/hi';
import { UserAuth } from '../../../context/AuthContext';
import { getDoc } from 'firebase/firestore';
import { HiAnnotation } from 'react-icons/hi';
import ValuationChecker from './ValuationChecker';
import { Link } from 'react-router-dom';
import { HiEye } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { getCountFromServer } from 'firebase/firestore';
import { startAfter } from 'firebase/firestore';
import { where } from 'firebase/firestore';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default  function Valuation(){
  const { user  } = UserAuth();
  const newidref= useRef("");
  const [totalNumberOfDocs, setTotalNoOfDocs]= useState(0);
  const [new_reference_id, setnew_reference_id]=useState(null);
  const [currentIndex, setCurrentIndex]= useState(1);
  const [lastVisible, setlastVisible]= useState();

  


   let [totalnumberofpage, setTotalNumberOfPage]=useState([]);

 const [arrayOfDocs,setArrayOfDocs ]  =  useState([]);


    const propertyTypes = ['Land', 'Building', 'Others' ];
    let selectedValFileNoForStorage="";

    const [bankList, setBanklist] = useState(['Select One']);
    const [branchList, setBranchList] = useState(['Select One']);
    const [currentPropertyType, setCurrentPropertyType] = useState();
    const [currentBank, setCurrentBank] = useState();
    const [currentBranch, setCurrentBranch] = useState();
   const [valuationFiles , setValuationFiles]= useState([]);
   const [currentFileType, setCurrentFileType]= useState("");
   const [loading, setLoading]=useState(false);
   const inputRef = useRef(null);
   const selectRef = useRef(null);
   const bankRef = useRef(null);
   const branchRef = useRef(null);
   const selectedValFileNoForStorageRef = useRef(null);
   const [listOfFileNo, setOfFileNo]= useState([]);
   const [listFileNoSuggestion, setListFIleNoSuggestion]= useState([]);
   const [filteredData, setFilteredData]= useState([]);
   const [longTermStorageOfArray, setlongTermStorageOfArray]= useState([]);
   const [showValuationChecker, setShowValuationChecker]=useState(false);
   const [selectedValutionNo,setSelectedValutionNo]=useState({});
   const [allBankListLongTerm, setAllBankListLongTerm]=useState([]);
  const [listofUnauthorizeId, setlistofUnauthorizeId]= useState([]);
  
  
  const [searchThis, setSearchThis]=useState("");
    
   let listofUrls=[];
   const [fileAndUrls, setFileAndUrls]= useState([]);
   const [allValuationFileNo, setAllValuationFileNo]= useState([]);
  const [allfileTypeAndUrl, setAllFileTypeAndUrl]=useState([]);

  let unauthorizeListofReferenceNo=[];
   const [form, setform] = useState(
    { 
    
      valuationFileNo: "",
      clientOrcompanyName: "",
      clientAddress: "",
      clientPhone:"",
      ownerName:"",
      ownerAddress:"",
      ownerPhone:"",
      propertyType: "",
      bankName:"",
      bankBranch:"",
      fieldchargeCost:"",
      latlong:"",
  
      
      curentState:"0",
  
      maker:"",
      checker:"",
  
  
      initSubmitDate: "",
      initmaker:"",
      initchecker:"",
  
      
 
      twoPageMakingDate:"",
      fmvValue:"",
      twopageMaker:"",
      twoPageRemarks:"",
  
  
      bookCloseDate:"",
    
      amountofBill:"",
      closeMaker:"",
      closeRemarks:"",
       
     
      files:[]
    
});
function  resetformElement(){
  let objform={
    valuationFileNo: "",
    clientOrcompanyName: "",
    clientAddress: "",
    clientPhone:"",
    ownerName:"",
    ownerAddress:"",
    ownerPhone:"",
    propertyType: "",
    bankName:"",
    bankBranch:"",
    fieldchargeCost:"",
    latlong:"",

    
    curentState:"0",

    maker:"",
    checker:"",


    initSubmitDate: "",
    initmaker:"",
    initchecker:"",

    
    fmvDate:"",
    twoPageMakingDate:"",
    fmvValue:"",
    twopageMaker:"",
    twoPageRemarks:"",


    bookCloseDate:"",
   
    amountofBill:"",
    closeMaker:"",
    closeRemarks:"",
     
   
    files:[]
  }
  setform(objform);
 
  setCurrentBank("Select One");
  setCurrentBranch("Select One");
  setAllFileTypeAndUrl([])
  setValuationFiles([]);
  
}

async function exportToExcel(){
 
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Valuations");

    // Define columns (based on your Firestore fields)
    worksheet.columns = [
      { header: "Valuation File No", key: "valuationFileNo", width: 20 },
      { header: "Client Name", key: "clientOrcompanyName", width: 25 },
      { header: "Client Address", key: "clientAddress", width: 30 },
      { header: "Client Phone", key: "clientPhone", width: 18 },
      { header: "Owner Name", key: "ownerName", width: 20 },
      { header: "Owner Address", key: "ownerAddress", width: 30 },
      { header: "Owner Phone", key: "ownerPhone", width: 18 },
      { header: "Bank Name", key: "bankName", width: 30 },
      { header: "Bank Branch", key: "bankBranch", width: 25 },
      { header: "Property Type", key: "propertyType", width: 15 },
      { header: "FMV Value", key: "fmvValue", width: 15 },
      { header: "Current State", key: "curentState", width: 15 },
      { header: "Maker", key: "initmaker", width: 25 },
      { header: "Checker", key: "initchecker", width: 25 },
      { header: "Init Submit Date", key: "initSubmitDate", width: 18 },
      { header: "Created Date", key: "created_date", width: 20 }
    ];

    // Style header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Add rows from Firestore data
    longTermStorageOfArray.forEach((item) => {
      worksheet.addRow({
        valuationFileNo: item.valuationFileNo || "",
        clientOrcompanyName: item.clientOrcompanyName || "",
        clientAddress: item.clientAddress || "",
        clientPhone: item.clientPhone || "",
        ownerName: item.ownerName || "",
        ownerAddress: item.ownerAddress || "",
        ownerPhone: item.ownerPhone || "",
        bankName: item.bankName || "",
        bankBranch: item.bankBranch || "",
        propertyType: item.propertyType || "",
        fmvValue: item.fmvValue || "",
        curentState: item.curentState || "",
        initmaker: item.initmaker || "",
        initchecker: item.initchecker || "",
        initSubmitDate: item.initSubmitDate || "",
        created_date: item.created_date
          ? new Date(item.created_date).toLocaleDateString()
          : ""
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, "Valuation_Report.xlsx");
  } catch (error) {
    console.error("Excel export error:", error);
  }
};

 

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
           if(form.valuationFileNo===""  || form.valuationFileNo.length<11)
            return;
        if(checkCurrentState(form.curentState)){
          return;
        }
           //add  maker
          setLoading(true);
          const valuationDoc = doc(db, "valuation", form.valuationFileNo);
         await setDoc(valuationDoc, form, {merge:true} );
          swal("Success !!!", "User information updated... Please refresh", "success");
          if (selectRef.current) {
            selectRef.current.value = '';
            setCurrentPropertyType("Choose One");

          }
           resetformElement();
           getAllValuationFileNo();
       

    }
    catch (e) {
        swal("error"+e);
    }
    finally{
        setLoading(false);
    }
};

async function checkerCallback(value){

  setShowValuationChecker(value);
  getAllValuationFileNo();
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

///////dele file from storage
async function deleteFromStorage(fileNo, fileName){
  try{
   setLoading(true);
    let userDocRef = doc(db, "valuation", fileNo);
    listofUrls= allfileTypeAndUrl.filter((object)=> {
    return object.fileName!==fileName;
   });
    
   const desertRef = ref(storage, `valuation/${fileNo}/${ fileName.toString() }`);
   await deleteObject(desertRef).then(async () => {
  



   await updateDoc(userDocRef, {files: listofUrls}, { merge: true }).catch((error) => { swal(error); });
   swal("Successfull Deletion");
   setAllFileTypeAndUrl(listofUrls) 
   setform({...form, files:listofUrls});

   LoadDetailsFromId(fileNo, listofUrls);
   setLoading(false);
   resetformElement()
         
  })
}
  catch(e){
    swal("error while deleting."+e);
  }
  finally{
    setLoading(false);


  }
}

async function deleteFileNo(FILENO, _currentState){
     
      if (!user || user.role !== 'admin') {
          swal("Warning !!!", "Unauthorize access", "error");
          return;
      } 
      
      if(_currentState==="01CV" || _currentState==="0123V" ||  _currentState==="01V" || _currentState==="01NV" || _currentState==="012NV" || _currentState==="012V" || _currentState==="0123NV"){
        swal("Cannot be deleted");
  
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
    if(form &&  form.files.length>0){
         
    
      for (let i = 0; i <  form.files.length; i++) {
           const desertRef = ref(storage, `valuation/${FILENO}/${ form.files[i].fileName.toString() }`);
          await deleteObject(desertRef).catch(e => alert(e)) 
    }
    await deleteDoc(doc(db, `valuation/${FILENO}`)).catch(e => alert(e));   
    resetformElement();
     getAllValuationFileNo();  
     removeFileNoFromSuggestion(FILENO);
    swal("Image deleted from storage")
  }else{
    await deleteDoc(doc(db, `valuation/${FILENO}`)).catch(e => alert(e));   
    resetformElement();
     getAllValuationFileNo();  
     removeFileNoFromSuggestion(FILENO);
    swal("Image deleted from storage")
  }
  
    
 
  
  }
  catch(e){
    swal(e);
  }

   
    

   
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
   
  console.log(listofUrls);
  const newUpdate=  allValuationFileNo.map((object)=>{
      if(object.valuationFileNo===valno){
        object.files=_listofUrls;
        console.log(object);
        return object;
      }else{
        return object;
      } 
    });
   setAllValuationFileNo(newUpdate);
  

    //filter the long term storage
  const update=  longTermStorageOfArray.map((object)=>{
      if(object.valuationFileNo===valno){
         object.files=_listofUrls;
         return object;
      }else{
        return object;
      }  
    });

  setlongTermStorageOfArray(update);
 
   
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
   setAllValuationFileNo([]);
  setlongTermStorageOfArray([]);

   let tempdata=[];
   let tempCollDocData=[];

   console.log(querySnapshot.docs.length);
   if (querySnapshot.docs.length >= 1) {      
       querySnapshot.forEach((doc) => {      
        tempdata.push(doc.data())
       let tempValFileNo=doc.data()['valuationFileNo'];
       const docData=    { value: tempValFileNo,  label: tempValFileNo };

       let _currentState=doc.data()['curentState'];
       
       
       if(_currentState==="01CNV"  || _currentState==="012NV"   || _currentState==="0123NV"  || _currentState=="01NV"){
         
          console.log("the unauthorize list is "+ tempValFileNo);
          unauthorizeListofReferenceNo.push(tempValFileNo)
       }
       setlistofUnauthorizeId(unauthorizeListofReferenceNo);

       tempCollDocData.push(docData);       
       }
      );
      setListFIleNoSuggestion(tempCollDocData);
   let newTempData= tempdata.reverse();
 
  setAllValuationFileNo(newTempData);
  setlongTermStorageOfArray(newTempData);

   }
  }
  catch(e){
    swal(e);
  }
};
 
  

  function getLastElementOfReferenceNo(){
  let lastArrayReferenceNo="2080-081-##";
 
  
       lastArrayReferenceNo= longTermStorageOfArray[0].valuationFileNo;
       let thirdSeparatorElement = lastArrayReferenceNo.split("-")[2];
       if(thirdSeparatorElement===undefined){
        lastArrayReferenceNo="####-###-###"
       }else{
        
      let intElement=  parseInt(thirdSeparatorElement);
       
         intElement=longTermStorageOfArray.length+1;
         if(intElement<10){
          intElement='0'+intElement.toString();
         }
         const newRefNo=lastArrayReferenceNo.split("-")[0]+'-'+lastArrayReferenceNo.split("-")[1]+'-'+intElement;;
         lastArrayReferenceNo= newRefNo;
       }
       //lets edit the last number


 
 
  return  lastArrayReferenceNo;
}

function  checkCurrentState(_currentState){

  if(_currentState==="01"   || _currentState ==="01NV" || _currentState ==="012NV" || _currentState ==="0123NV" ||_currentState ==="0123V" || _currentState ==="012C" || _currentState ==="01CV" || _currentState ==="01CNV" ){
    resetformElement();
  swal("Please !!! ", "Not editable", "warning")
  return  true;
}
else{
  return false;

}
}
//***************************************************************************** */
async   function setFormAndCurrentState(valFileNo){
  resetformElement();
  const docData=allValuationFileNo.filter((object)=>{
    return   object.valuationFileNo===valFileNo
  });
   
  setform(prevUser => ({
    ...prevUser,
    valuationFileNo: docData[0].valuationFileNo
  }));
  // setform({...form,valuationFileNo:docData[0].valuationFileNo });
  // setform({...form,curentState: docData[0].curentState  });
//control the logic here
console.log("?????????????????????????><<<<<<<<<<<<<<<<<<<<<<<");
  console.log(form);
}

//**************************************************************************** */

 async function editValuationFileNo(valfileNo){
  //filter the  valfile no and put into the field
  setAllFileTypeAndUrl([]);
  setValuationFiles([]);

  
  const docData=allValuationFileNo.filter((object)=>{
    return   object.valuationFileNo===valfileNo
  });
  
//control the logic here
  

  setCurrentPropertyType(docData[0].propertyType);
  setform(docData[0]);

  
 if(docData[0].bankName.trim()!=="" && allBankListLongTerm.length>0){
  let filsteredObject= allBankListLongTerm.filter((object)=>{
    return  object.bankName===docData[0].bankName 

  });
  setBranchList(filsteredObject[0].branchList);

  setCurrentBank(docData[0].bankName);
  setCurrentBranch(docData[0].bankBranch);
 
 }

   

 if(docData[0].files.length>0){
  const newObjectArray= docData[0].files;
  setTimeout(() => {
    setValuationFiles([]);
    if(newObjectArray){      
      setAllFileTypeAndUrl(newObjectArray);
      
     }
  }, 2000);

}

   
   //set it inside the form

 }
//&&&&&&&&&&&&&&&&&&&& ALL BANK INFO &&&&&&&&&&&&&&&&&&&

async function getAllBankInformation(){
  try{
      const bankref = collection(db, "bankdetail"); 
      const querySnapshot= await getDocs(bankref);
  
     setAllBankListLongTerm([]);
   
 
   let tempdata=[];
   let _bankList=[];
      console.log(querySnapshot.docs.length);
      if (querySnapshot.docs.length >= 1) {      
          querySnapshot.forEach((doc) => {      
           tempdata.push(doc.data())
          let  bankId =doc.data()['bankId'];
          let bankName= doc.data()['bankName'];
          _bankList.push(bankName);
          // const docData=    { value: bankId,  label: bankName };
          // tempCollDocData.push(docData);       
          }
         );
         //setListFIleNoSuggestion(tempCollDocData);
      let newTempData= tempdata.reverse();
    
    setBanklist(_bankList);
     setAllBankListLongTerm(newTempData);
   
      }
      
  }
  catch(e){
      swal(e);
  }
}
///////////////////////// *********************** CLOSE THE FILE *************** ///

//**************************** CLOSE BEFORE COMPLETION ********************************** */
async function CloseBeforeBooking(_fileNo,_currentState){
  try
  {
 
    if(
      _currentState==="01CV" || _currentState==="0123V" ||   _currentState==="012C" ||  _currentState==="01CNV" || _currentState==="01NV" || _currentState==="012NV" || _currentState==="0123NV"){


        swal("Cannot Close Here");
        return;
    }
     


      const { value: text,  } = await Swal.fire({
        input: "textarea",
        inputLabel: "Please, input reason for closing",
        inputPlaceholder: "Type your message here...",
        inputAttributes: {
          "aria-label": "Type your remarks"
        },
        showCancelButton: true
      });
      if(text.trim()===undefined || text.trim()===""){
        swal("Empty remarks");
        return;
      }

     

      if(text!=="" || text!==undefined){
         
        const now = new Date();
        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth() + 1; // getUTCMonth() returns month from 0-11
        const utcDate = now.getUTCDate();
        const _datetime= utcYear+" - "+  utcMonth +" - "+ utcDate;
        const newDoc={
          twoPageRemarks:text+":::" +_datetime+":::"+user.email+":::"+_currentState, 
          curentState:"01CNV",
         
              };
          const valuationDoc = doc(db, "valuation", _fileNo);
          await setDoc(valuationDoc, newDoc, {merge:true} );
           swal("Success !!!", "Processed to next phase", "success");
            getAllValuationFileNo();
          
        return;
      }
//     const x = await swal({
//       title: "Are you sure?",
//       text: "Proceed to next stage of processing!" ,
//       icon: "warning",
//       buttons: true,
//       dangerMode: true,
//   })

//  if(!x){
//   return;
//  }
  
  }
  catch(e){
    swal(e);
  }

}
function check_reference_id(){
 const regex = /^20\d{2}-\d{4}-\d[0-9]*$/; 
let stringval= new_reference_id.trim();
 if(!regex.test(stringval)){
  alert("unfit id")
    return "unfit";
 }
  return "fit";
}

async function check_id_existalready(){
  try{
   
    let stringval= new_reference_id.trim();
    const docRef = doc(db, "valuation",stringval);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
    if (docSnap.exists()) { 
     
         return "yes";
    } else {
       
        return "no";
    }


  }
  catch(e){
    swal(e);
    return "no";
  }
}
async function generate_new_id(){
 //get last element
 //get the last referenc id 
 try{

  const valuationRef = collection(db, "valuation");; 
  const q = query(valuationRef, orderBy("created_date","desc"), limit(1));

  let tempdata=[];
  const querySnapshot= await getDocs(q);
  if (querySnapshot.docs.length >= 1) {      
    querySnapshot.forEach(async (doc) => {  
    let tempValFileNo=doc.data()['valuationFileNo'];
    let lastno= tempValFileNo.split('-')[2];
    let middle= tempValFileNo.split('-')[1];
    let first= tempValFileNo.split('-')[0];
     

    const num = parseInt(lastno, 10)
    let newAuto=first+"-"+middle+"-"+(num+1).toString();
    console.log(newAuto+"___________________");
     newidref.current=newAuto;
     setnew_reference_id(newAuto);
     
    });
}
 }
catch(e){
  swal(e);
}


}
let val=1;

async function insert_new_createdat(){
  const valuationRef = collection(db, "valuation");; 
  const q = query(valuationRef, orderBy("created_date","desc"), limit(200));

  let tempdata=[];
  const querySnapshot= await getDocs(q);
  if (querySnapshot.docs.length >= 1) {      
    querySnapshot.forEach(async (doc) => {  
      
      
   
    let tempValFileNo=doc.data()['valuationFileNo'];
    tempdata.push(tempValFileNo);
    
    console.log(tempValFileNo);
    });
     
    for(let i=0; i<tempdata.length; i++){
      // 
    
    val=val+1; 
   ; const timestamp = Math.floor(Date.now() )+val;
    //  const valuationDoc = doc(db, "valuation",tempdata[i]);
    // await setDoc(valuationDoc, {created_date:timestamp} , {merge:true} );
     console.log("____"+timestamp.toString()+ " ___"+tempdata[i]);
    }
 



   
  }
}



/////////////////creat   new id
async function create_new_id(){
  
  if(check_reference_id(new_reference_id)=="fit"){
     
   if(await check_id_existalready()=="yes"){
    alert("Exists already;");
    return;
   };
 
  const timestamp = Math.floor(Date.now()); 
  let stringval= new_reference_id.trim();
  const newdoc={
    valuationFileNo:stringval,
    created_date    : timestamp
 
} 
 try{
 setLoading(true);
  const valuationDoc = doc(db, "valuation",stringval);
  await setDoc(valuationDoc, newdoc, {merge:true} );
  swal("Success !!!", " New id created", "success");
  load_more_value(1);
 }
 catch(e){
  swal("unabele to create new id");
 }
//   if (selectRef.current) {
//     selectRef.current.value = '';
//     setCurrentPropertyType("Choose One");

//   }
//    resetformElement();
//    getAllValuationFileNo();

}

}


/////////   LOAD COUNT THE NO 
let _recordperpage=30;
async function countnoofdocs(){
  try{
  const userCollectionReference = collection(db, "valuation");
  const userCollectionSnapshot = await getCountFromServer(userCollectionReference);
   const totalCount= userCollectionSnapshot.data().count;
   setTotalNoOfDocs(totalCount);

  

    let   _totalnumberofpage=Math.ceil(totalCount/_recordperpage);
    let x=[];
    for(let i=1; i<=  _totalnumberofpage;i++){
      x.push(i);
     }
    setTotalNumberOfPage(x);
   const valuationRef = collection(db, "valuation");; 

   const q = query(valuationRef, orderBy("created_date","desc"),limit(_recordperpage));
     let tempdata=[];
   
   setArrayOfDocs([]);
   const querySnapshot= await getDocs(q);

   const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    if (querySnapshot.docs.length >= 1) {      
     querySnapshot.forEach(async (doc) => {  
     tempdata.push(doc.data());
      
     });
      
     setArrayOfDocs(tempdata);
    }

  }
  catch(e){
    swal(e);
  }
   
}

async function load_more_value(value){
 let lim=_recordperpage*value;
try{
  const valuationRef = collection(db, "valuation");; 
  const q = query(valuationRef, orderBy("created_date","desc"),limit(lim));
  
  let tempdata=[];
  setArrayOfDocs([]);
  const querySnapshot= await getDocs(q); 
  // const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
  // console.log("last______________________", lastVisible);
  // const next = query(collection(db, "valuation"),
  // orderBy("created_date", "desc"),
  // startAfter(lastVisible),
  // limit(25));

  // const queryS= await getDocs(next);

   
  if (querySnapshot.docs.length >= 1) {      
    querySnapshot.forEach(async (doc) => {  
    tempdata.push(doc.data());
    console.log("____________",doc.data()['valuationFileNo']);
     
    });
   let length = tempdata.length;
  let start=((value-1)*_recordperpage);
  let end= start+_recordperpage;
   let slicevalue=tempdata.slice(start, end);
    // for(let i=0; i<length; i++){
    //   if((value-1)*_recordperpage)

    // }
    //0-19   1
    // 20-39       2
    // 40 -59
    // 60-80

     
    setCurrentIndex(value);
   
    setArrayOfDocs(slicevalue);
    
   }



}
catch(e){
  swal(e);
}

}

///  ya ta search this content ..............
async function searchContent(searchconten){
  try{


    const valuationRef = collection(db, "valuation");; 
    setArrayOfDocs([]);
    //-------------setArrayOfDocs([]);
    //-------------------------client or company name
    const q = query(valuationRef,  
        where('clientOrcompanyName', '>=', searchconten),
         where('clientOrcompanyName', '<', searchconten + '\uf8ff'));
    let tempdata=[];
    const querySnapshot= await getDocs(q);   
    let temparray=[];
    querySnapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
         temparray.push(doc.data());
     });
    // ----------------owner name -------------------
    const q1 = query(valuationRef,  
      where('ownerName', '>=', searchconten),
       where('ownerName', '<', searchconten + '\uf8ff'));

       const querySnapshot1= await getDocs(q1);   
       querySnapshot1.forEach(doc => {
           console.log("___", " => ", doc.data());
            temparray.push(doc.data());
        });


      /// remove duplicate rows

      const q2 = query(valuationRef,  
        where('valuationFileNo', '==', searchconten));
  
         const querySnapshot2= await getDocs(q2);   
         querySnapshot2.forEach(doc => {
              temparray.push(doc.data());
          });

      // ---------------------------------- 

      const uniqueDocuments = temparray.reduce((unique, doc) => {
        if (!unique.some(d => d.valuationFileNo === doc.valuationFileNo)) {
            unique.push(doc);
        }
        return unique;
    }, []);



    
    setArrayOfDocs(uniqueDocuments); 




  }
  catch(e){
    alert(e);
  }
}

function checkunverified(arg1,arg2,arg3,arg4){
   if(  arg1==="client-unverified" || arg2==="other-unverified" || arg3==="cost-unverified" || arg4==="close-unverified"){
    // otherUpdateStatus:"other-unverified"
    // costUpdateStatus:"cost-unverified"
    //closeUpdateStatus:"close-unverified"
    return "true";
   }

  return "false";

}
  ///load the valuation file no
  useEffect(()=>{
           countnoofdocs();
  //   //  getAllValuationFileNo();
  //   // getAllBankInformation();
  },[]);
    return (

      
    <>
    {
      listofUnauthorizeId &&   listofUnauthorizeId.length >0?
        <>
        <div className='bg-white text-black font-extralight p-10 m-5'>
         <h1> Here are list of unauthorizethorize list, Click here to authorize it</h1>
          <ul>
            {
              listofUnauthorizeId.map((object, index)=>{
                return (
                  <li>
                 
                   <Link to={"verify/"+object  } state={"hellow"}  target="_blank"><span className="underline text-sky-900">{object}</span> </Link>
                  </li>
                );
              })
            }
            <li className='underline text-green-700'><button onClick={()=>{getAllValuationFileNo()}}>Click Here to refresh</button></li>
          </ul>
        </div>
        </>:
        

        
      
      <div className='w-auto   '>


<div className='pt-5 pl-5 '>
    <label className="mt-20 w-24 pr-5 ">ID</label>
    <button  onClick={()=>{generate_new_id()}} className='mr-2 bg-transparent bordder border-2 hover:bg-red-400 border-red-500 p-2 rounded-lg '>Auto</button>

     <input type="text" placeholder="Client Address" ref={newidref}  onChange={(e)=>setnew_reference_id(e.target.value)} value={new_reference_id}   className="text-black w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
     <button onClick={()=>{create_new_id()}} className='ml-2 bg-transparent bordder border-2 hover:bg-red-400 border-red-400 p-2 rounded-lg'>Create New</button>
<Link 
  to="/new" 
  state={{ message: "hello" }}
  className="ml-2 bg-green-800 border-2 border-red-400 hover:bg-red-400 p-2 rounded-lg"
>
  New Template
</Link>
    </div>


          <div className=' overflow-y-scroll bg-white p-3 w-full shadow-sm shadow-gray-300   border-2 text-sm border-gray-400 '>
      
      <div className='  bg-gray-300 p-1 mt-2'>      

      <div className='  flex'>
     
 
      <input type="text"      onChange={(e)=>{console.log(e.target.value); setSearchThis(e.target.value)}} placeholder='Search Client Name or Owner Name or Reference No'    className="w-60 text-black   px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
  

<button  onClick={()=>{
   

  searchContent(searchThis.trim());
}} className="py-1 px-3   text-black mx-2   hover:bg-slate-600 rounded-lg ">Search</button>

    
<div className='text-black font-semibold justify-center align-middle mt-2'>
<Link to={"bank" } state={"hellow"}  target="_blank"> 
 Bank
   </Link>
   </div>
{/*  value={currentFileType} onChange={ (event)=>{setCurrentFileType(event.target.value)}} */}
   <select   className=" w-32 ml-2 text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option selected  className='bg-gray-600 rounded-lg   font-normal text-white' value="Select One">Select One</option>
                    <option className=' bg-white rounded-lg   font-normal text-black' value="AmtReceived">Amt Received</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value="EntryLst">Entry Only</option>
                    <option className=' bg-white rounded-lg   font-normal text-black' value="FMV">FMV Value</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value="BOOK">Book Value</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value="AMT">AMT Bill</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value=""></option>
     </select>

{////////////////////////////////////////////  Button>
 

}
 
 

   
<div  onClick={()=>{}} className=' bg-transparent text-black text-center justify-center flex flex-row'>
 
  {
   
      totalnumberofpage.map((val)=>{
     return  <button onClick={()=>{load_more_value(val)}} className= {currentIndex==val?' bg-teal-800  py-1  px-2 m-1 border-1  rounded-lg  border-slate-500 hover:bg-red-600': 'py-1  px-1 m-1 border-2  rounded-lg border-slate-500 hover:bg-red-600 '} >{val}</button>
    })
  }
  </div>
        
        </div> 
     
           
 
<div className='overflow-scroll overflow-x-scroll w-[1100px] pb-3 h-96 '> 
<table className=" text-lg text-left   text-white dark:text-white border-separate   shadow-lg shadow-gray-400 ">
<thead className="text-xs text-black uppercase bg-gray-50 dark:bg-inherit  ">

<tr className='bg-blue-100'    >
                                    <th scope="col" className="p-4">
                                        <div  onClick={()=>{load_more_value(1)}} className="flex items-center cursor-pointer underline text-green-700">
                                            Refresh
                                        </div>
                                    </th>
                                  
                                    <th scope="col" className="px-2 py-2  whitespace-nowrap">
                                      CLIENT NAME
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                         ADDRESS
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        PHONE
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        OWNER NAME
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        ADDRESS
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        PHONE
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        PRO-TYPE
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        BANK NAME
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        BANK BRANCH
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        COST
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        FILES
                                    </th>
                                     
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        Checker
                                    </th>
                                  
                                     
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        DELETE
                                    </th>
                                    
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        Edit File
                                    </th>

   </tr>

 </thead>
 <ValuationChecker  value={showValuationChecker}  valuationObject={selectedValutionNo} checkerCallback={checkerCallback} />
 <tbody className='bg-white text-xs font-normal text-black cursor-pointer'>
{

  arrayOfDocs.map((value, index)=>{
    let valfileno=value.valuationFileNo;
 return (
  <tr   onClick={()=>{
    setSelectedValutionNo(value);
    setShowValuationChecker(true);} }
    className= {checkunverified(value.clientUpdateStatus,value.otherUpdateStatus, value.costUpdateStatus,value.closeUpdateStatus)==="true"? "bg-orange-500 hover:bg-slate-300":"hover:bg-slate-300"}    >
  <th scope="row" className="px-2 py-2  font-semibold text-gray-900 whitespace-nowrap ">
  <Link to={"editvaluation/"+value.valuationFileNo  }     target="_blank" rel="noopener noreferrer" >
  {value.valuationFileNo}
       </Link>
    
  </th>
  <th scope="row" className="px-2 py-2px  w-64 font-semibold text-gray-900 overflow-hidden whitespace-nowrap ">
    <div className='w-44'>
      <span>
    {value.clientOrcompanyName}</span>
    </div>
  </th>
  <th scope="row" className="px-2 py-2 font-semibold text-gray-900 whitespace-nowrap overflow-hidden ">
  <div className='w-52'>
  {value.clientAddress}
  </div>
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.clientPhone}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap overflow-hidden ">
  <div className='w-52'>
  {value.ownerName}
  </div>
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap overflow-hidden ">
  <div className='w-52'>
  {value.ownerAddress}
  </div>
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  
  {value.ownerPhone}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.propertyType}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900  whitespace-nowrap overflow-hidden ">
  <div className='w-52'>
  {value.bankName}</div>
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.bankBranch}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.fieldchargeCost}
  </th>
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.files && value.files.map((val, index)=>{
    return <>
    {<a href={val.fileUrl} className='text-blue-800 font-semibold hover:bg-slate-400' target='_blank' alt='' >{val.fileType} </a>} 
    </>

  })}
  </th>
 
 
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
 
  <Link to={"verify/"+value.valuationFileNo  } state={"hellow"}  target="_blank">
    {
    value.curentState==="0123V"?
    <div  className='flex'> <HiCheck  size={'20px'}/> <HiCheck  size={'20px'}/> <HiCheck  size={'20px'}/></div>
    :
    <> <HiZoomIn  size={'20px'}  />  </>

    }
   </Link>
  </th>
 


 
  
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.valfileNo}
    <HiTrash  className='hover:bg-slate-600' onClick={()=>{ 
                              deleteFileNo(value.valuationFileNo, value.curentState);    }
    } />
  </th>

 
  <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
  {value.valfileNo}
  <Link to={"editvaluation/"+value.valuationFileNo  } state={"hellow"}  target="_blank">Edit file </Link>
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

}
    </>)
}