import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState,   } from "react";
import swal from "sweetalert";
  
import { where,limit,query } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { setDoc } from 'firebase/firestore';
import { doc, deleteDoc } from "firebase/firestore";
import { UserAuth } from "../../context/AuthContext";
import { getDoc,getDocs,collection } from "firebase/firestore";
import { useRef } from "react";
import { uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/Firebase";
import { getDownloadURL } from "firebase/storage";
import { ref } from "firebase/storage";
import { updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

import { HiTrash } from "react-icons/hi";
 
export default function EditValuationNew(){
  let listofUrls=[];
    const { id } =  useParams();
    const { user} = UserAuth();
    const branchRef = useRef(null);
    const bankRef = useRef(null);
    const [currentBank, setCurrentBank] = useState();
    const [bankList, setBanklist] = useState(['Select One']);
    const [branchList, setBranchList] = useState(['Select One']);
    const [allBankListLongTerm, setAllBankListLongTerm]=useState([]);
    const [currentBranch, setCurrentBranch] = useState();
    const propertyTypes = ['Land', 'Building', 'Others' ,'Vehicle'];
    const [currentPropertyType, setCurrentPropertyType] = useState();
    const inputRef = useRef(null);
    const selectRef = useRef(null);
    const [currentFileType, setCurrentFileType]= useState("");
    const [valuationFiles , setValuationFiles]= useState([]);
    const [allfileTypeAndUrl, setAllFileTypeAndUrl]=useState([]);
    const selectedValFileNoForStorageRef = useRef(null);
 
    const [formclient, setformclient] = useState({
        valuationFileNo: "",
        clientOrcompanyName: "",
        clientAddress: "",
        clientPhone:"",
        ownerName:"",
        ownerAddress:"",
        ownerPhone:"",

        clientMaker:"",
        clientChecker:"",
        clientUpdateStatus:""



    });

    const [formOther, setFormOther] = useState({
      propertyType: "",
      bankName:"",
      bankBranch:"",
      fieldchargeCost:"",
      latlong:"",

      otherMaker:"",
      otherChecker:"",
      otherUpdateStatus:""
    });

    const [formCost, setFormCost] = useState({
      totalIncome: "",
      totalExpense:"",
      fmvValue:"",
      amountofBill:"",
      twopageMaker:"",
       bookValue:"",
       bookMaker:"",
       bookCloseDate:"",
      costMaker:"",
      costChecker:"",
      costUpdateStatus:""
  

    });

    const [formClose, setFormClose]= useState({
       closeRemarks:"",
       closeMaker:"",
       closeChecker:"",
       closeUpdateStatus:""


    });

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

/////////////////////////////
    useEffect(()=>{
        document.title = id; 
        getAllBankInformation();
      checkAuthorizeUser();
    },[]);

/////////////////////////////  GET  ALL THE BANKING INFORMATION ///////////////////////
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

/////////////////////check the authorized user
  async function checkAuthorizeUser(){

    
    try{
      var x= await load_detail_of_val_fileNo();
      if(!user.email){
        
        return ;
      }else{
       
        if(check_role_with_user(user.email)=="true"){
         
            if(x="not_exist"){
              //redfirec to home
           //   alert("id not exist");
            }else{
             
                  
            }
          ;
        }
      }
        
    }catch(e){
        swal(e);
    }
  }   
///// FUNCTION LOAD ALL    

async function load_detail_of_val_fileNo(){
    try{
        const docRef = doc(db, "valuation", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
         var x= docSnap.data();
           
         setformclient((prevForm) => ({
          ...prevForm,       // Keep previous values
          valuationFileNo: x.valuationFileNo, 

          clientAddress:x.clientAddress,
          clientChecker:x.clientChecker,
          clientMaker:  x.clientMaker,  
          clientOrcompanyName:x.clientOrcompanyName, 

          
          ownerPhone:x.ownerPhone,
          ownerName:x.ownerName,
          ownerAddress:x.ownerAddress,
          clientUpdateStatus:x.clientUpdateStatus,
          clientPhone:x.clientPhone
        }));
 

        setFormOther((prevForm) => ({
          ...prevForm,       // Keep previous values
          valuationFileNo: x.valuationFileNo, 

          propertyType: x.propertyType,
          bankName:x.bankName,
          bankBranch:x.bankBranch,
          fieldchargeCost:x.fieldchargeCost,
          latlong:x.latlong,
    
          otherMaker:x.otherMaker,
          otherChecker:x.otherChecker,
          otherUpdateStatus:x.otherUpdateStatus
        }));
      
        // let filsteredObject= allBankListLongTerm.filter((object)=>{
        //   return  object.bankName=== x.bankName 
      
        // });
        // setBranchList(filsteredObject[0].branchList);
        if(x.propertyType!==undefined){
          setCurrentPropertyType(x.propertyType);
        }
      
        if(x.bankName!==undefined  && x.bankName.trim()!==""){
        setCurrentBranchFromBank(x.bankBranch,x.bankName)
        }

        setFormCost((prevForm) => ({
          ...prevForm,  
          valuationFileNo: x.valuationFileNo, 
          totalIncome: x.totalIncome===undefined ? "":x.totalIncome,
          totalExpense:x.totalExpense===undefined ? "":x.totalExpense,
          fmvValue:x.fmvValue===undefined ? "":x.fmvValue,
          amountofBill:x.amountofBill===undefined ? "":x.amountofBill,
          twopageMaker:x.twopageMaker===undefined ? "":x.twopageMaker,
           bookValue:x.bookValue===undefined ? "":x.bookValue,
           bookMaker:x.bookMaker===undefined ? "":x.bookMaker,
           bookCloseDate:x.bookCloseDate===undefined ? "":x.bookCloseDate,
           
          costMaker:x.costMaker===undefined ? "":x.costMaker,
          costChecker:x.costChecker===undefined ? "":x.costChecker,
          costUpdateStatus:x.costUpdateStatus===undefined ? "":x.costUpdateStatus,
        }));
        /* 
        now set the close remarks 
      */
        setFormClose((prevForm) => ({
          ...prevForm,  
          valuationFileNo: x.valuationFileNo, 
        closeRemarks:x.closeRemarks===undefined?"":x.closeRemarks,
        closeMaker:x.closeMaker===undefined?"":x.closeMaker,
        closeChecker:x.closeChecker===undefined?"":x.closeChecker,
        closeUpdateStatus:x.closeUpdateStatus===undefined?"":x.closeUpdateStatus
        }));
        ///code to rettrieve 

         let myarray=[];
          if(x.files!==undefined){
            setAllFileTypeAndUrl(x.files);
          };

    
       
          return docSnap.data();
        }
        return "not_exist";
    }
    catch(e){
      console.log(e);
      return "not_exist"
        swal(e);
    }
}

//////////////////////////////////// function set current 
async function setCurrentBranchFromBank(branchName,bankName){
     
   
 

   try{
    const brankRef = collection(db,'bankdetail');
    const q = query(brankRef, where("bankName", "==", bankName),  limit(1));
    const querySnapshot= await getDocs(q);
   const data= querySnapshot.docs[0].data();
 
  setCurrentBank(data.bankName);
  let temp=[];
  data.branchList && data.branchList.forEach((val)=>{
  temp.push(val);
  })
  setBranchList(temp);
  if(branchName!=undefined){
    setCurrentBranch(branchName);
  }
   }
   catch(e){
    console.log(e);
    alert(e);
   }

    // let filsteredObject= allBankListLongTerm.filter((object)=>{
    //        return  object.bankName=== bankName 
      
    //     });
    //    setBranchList(filsteredObject[0].branchList);
    //    setCurrentBranch(branchName);
  
}

///////////////////// cheeck the role of user
function check_role_with_user(email){
try{
const obj= {
  totalIncome: "",
  totalExpense:"",
  fmvValue:"",
  amountofBill:"",
  twopageMaker:"",
   bookValue:"",
   bookMaker:"",
   bookCloseDate:"",

  costMaker:"",
  costChecker:"",
  costUpdateStatus:""

}
return "true";
}
catch(e){
    return "false";
    swal(e);
}
}

////////////////////////////////verify client information

async function verifyClientInfo(){
  try{
    const today = new Date();
const date = today.toLocaleDateString(); 

    const valuationDoc = doc(db, "valuation",  formclient.valuationFileNo);
   await setDoc(valuationDoc, {clientUpdateStatus:"verified",clientChecker:user.email, initSubmitDate:date}, {merge:true} );
   swal("Success !!!", "User information updated... Please refresh", "success");
   load_detail_of_val_fileNo();
  }
  catch(e){
    swal(e);
  }
}
/////////////////////////
async function verifyOtherDetail(){
  try{
    const today = new Date();
    const date = today.toLocaleDateString(); 
    
     
        const valuationDoc = doc(db, "valuation",  formOther.valuationFileNo);
       await setDoc(valuationDoc, {otherUpdateStatus:"verified",otherChecker:user.email, initSubmitDate:date}, {merge:true} );
       swal("Success !!!", "User information updated... Please refresh", "success");
       load_detail_of_val_fileNo();
  }
  catch(e){
    swal(e);
  }
}
//////////////////////////
async   function saveClientInfo() {
    try{
     const obj={
      valuationFileNo: id,
      clientOrcompanyName: formclient.clientOrcompanyName,
      clientAddress: formclient.clientAddress,
      clientPhone:formclient.clientPhone,
      ownerName:formclient.ownerName,
      ownerAddress:formclient.ownerAddress,
      ownerPhone:formclient.ownerPhone,

      clientMaker:user.email,
      clientChecker: "",
      clientUpdateStatus:"client-unverified"
      
     };
     console.log(obj);
   

       
 
   const valuationDoc = doc(db, "valuation",  obj.valuationFileNo);
   await setDoc(valuationDoc, obj, {merge:true} );
   swal("Success !!!", "User information updated... Please refresh", "success");
   load_detail_of_val_fileNo();         

    }
    catch(e){
        alert(e);
    }

    
}

///////////// async function save other detail information
async function saveOtherDetail(){
try{

 
 
const x = await swal({
  title: "Please confirm your input",
  text: " LatLong__ "+formOther.latlong+ " Bank Name__ "+formOther.bankName +""+" BrankBranch__ "+formOther.bankBranch +" Field Charge Cost__"+formOther.fieldchargeCost ,
  icon: "warning",
  buttons: true,
  dangerMode: true,
});



if(!x){
return;
}

 
const obj={
  valuationFileNo:id,
  propertyType: formOther.propertyType===undefined?"":formOther.propertyType,
  bankName:formOther.bankName===undefined?"":formOther.bankName,
  bankBranch:formOther.bankBranch===undefined?"":formOther.bankBranch,
  fieldchargeCost:formOther.fieldchargeCost===undefined?"":formOther.fieldchargeCost,
  latlong:formOther.latlong===undefined?"":formOther.latlong,

  otherMaker:user.email,
  otherChecker:"",
  otherUpdateStatus:"other-unverified"
 };

 const valuationDoc = doc(db, "valuation",  obj.valuationFileNo);
 await setDoc(valuationDoc, obj, {merge:true} );
 swal("Success !!!", "information updated... Please refresh", "success");
 load_detail_of_val_fileNo();  

}
catch(e){
  alert(e);
}

}

//////////////////////  save the closing date 
async function saveCostInfo(){


  try{ 
    const x = await swal({
      title: "Please confirm your input",
      text: " total Income "+formCost.totalIncome+ " total Expense   "+formCost.totalExpense,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
     
    if(!x){
    return;
    }
    
    const obj={
        valuationFileNo:id,
      totalIncome:formCost.totalIncome,
      totalExpense:formCost.totalExpense,
      fmvValue:formCost.fmvValue,
      amountofBill:formCost.amountofBill,
      twopageMaker:formCost.twopageMaker,
       bookValue:formCost.bookValue,
       bookMaker:formCost.bookMaker,
       bookCloseDate:formCost.bookCloseDate,
     
     
       costMaker:user.email,
      costChecker:"",
      costUpdateStatus:"cost-unverified"
  
 
     };
    
     const valuationDoc = doc(db, "valuation",  obj.valuationFileNo);
     await setDoc(valuationDoc, obj, {merge:true} );
     swal("Success !!!", "information updated... Please refresh", "success");
     load_detail_of_val_fileNo();  

  }
  catch(e){
    alert(e);
  }
}

///////////////////////////////verify cost detail

/////////////////////////
async function verifyCost(){
  try{
    const today = new Date();
    const date = today.toLocaleDateString(); 
    
     
        const valuationDoc = doc(db, "valuation",  formCost.valuationFileNo);
       await setDoc(valuationDoc, {costUpdateStatus:"verified",costChecker:user.email}, {merge:true} );
       swal("Success !!!", "User information updated... Please refresh", "success");
       load_detail_of_val_fileNo();
  }
  catch(e){
    swal(e);
  }
}

//////////////////////////  Close the file
async function saveClose(){
  try{
    const newRemarks=formClose.closeRemarks+"  "+Date();
  if(formClose.closeRemarks.trim()==="")return;
const x = await swal({
  title: "Please confirm your input",
  text: " Remarks__ "+formClose.closeRemarks ,
  icon: "warning",
  buttons: true,
  dangerMode: true,
});

if(!x){
return;
}
const obj={
  valuationFileNo:id,
  closeRemarks:newRemarks,
  closeMaker:user.email,
  closeChecker:"",
  closeUpdateStatus:"close-unverified"

   
 };

 const valuationDoc = doc(db, "valuation",  obj.valuationFileNo);
 await setDoc(valuationDoc, obj, {merge:true} );
 swal("Success !!!", "information updated... Please refresh", "success");
 load_detail_of_val_fileNo();  


  }
  catch(e){
    alert(e);
  }
}

//////////////////////////////////////////////

async function verifyClose(){
  try{
    const today = new Date();
    const date = today.toLocaleDateString(); 
    
     
        const valuationDoc = doc(db, "valuation",  formClose.valuationFileNo);
        await setDoc(valuationDoc, {closeUpdateStatus:"verified",closeChecker:user.email}, {merge:true} );
       swal("Success !!!", "User information updated... Please refresh", "success");
       load_detail_of_val_fileNo();
  
  }
  catch(e){
    alert(e);
  }
}




function current_status(){
  if(formClose.closeUpdateStatus && formClose.closeUpdateStatus==="verified"){
    
    return "closed";
  }
  return "-";
}
//////////////  upload file 

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
//-----------------  upload the file -------------------
async function uploadFile( valfileNo, pdffile, name, fileType){

     
  if (pdffile) {
      try {
          
        const storageRef = ref(storage, `valuation/${valfileNo}/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, pdffile);
        const x = await uploadTask.on("state_changed",
          (snapshot) => {
                
            const progress =
              Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
               console.log("Progess"+ progress);

          },
          (error) => {
            swal(error);
          },
          () => {
              
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log("url "+downloadURL);
              const newDocObject={
                fileType:fileType,
                fileName:name,
                fileUrl:downloadURL
              };
              listofUrls=[];

              console.log(">>>"+newDocObject);


              const docRef = doc(db, "valuation", valfileNo);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                
                if( docSnap.data()['files']!==undefined){
                  listofUrls= docSnap.data()['files']; 
                }
                
              }
              listofUrls.push(newDocObject);
              
                       // if(listofUrls.length===valuationFiles.length){
                const userDocRef = doc(db, "valuation", valfileNo);
              //  await updateDoc(userDocRef, {files: listofUrls}, { merge: true });
                await updateDoc(userDocRef, {files: listofUrls}, { merge: true });
                inputRef.current.value=null;
                swal("success", "success", "success");
                 
                setValuationFiles([]);
                setCurrentFileType("Select One");
                //LoadDetailsFromId(valfileNo, listofUrls);
              //}
              
               
            });

          }
        );
         
      }
      catch (e) {
        alert(e);
      
      }
      finally{
        inputRef.current.val=null;
      }
      
}


}

  return (
 
     <div className="  w-full md:px-24 sm:px-0 text-black ">
      <div className=" bg-red-400 ">
      {
    // real time show
   user.email==undefined?<>undefined</>:<> 
 <div class="container mx-auto px-4 py-8 bg-white ">

  <Link to={"/new/valuation/"}    className="underline text-blue-400"  target="" rel="noopener noreferrer" >                    Go Back   </Link>
<div class="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-lg flex items-center space-x-2" role="alert">
  <svg class="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
  </svg>
  <span className="font-semibold">{current_status()==="closed"?"File has been closed":" "}</span>
  <span> Update All the information about the </span>
  <span className="font-extrabold">{formclient.valuationFileNo && formclient.valuationFileNo}</span>
</div>
  
 <h1 className="text-lg text-bold text-gray-600 py-4">Customer Detail</h1>
  <div  class="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3  shadow-lg  bg-gray-100 border-2 py-7 px-3 rounded">
  
    <div>
    <label className="mt-20 ">Client Name</label>
     <input type="text" placeholder='Client or Company Name'  value={formclient.clientOrcompanyName}   onChange={(e)=>{setformclient({...formclient, clientOrcompanyName: e.target.value}) ;  }} class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <div>
    <label className="mt-20 ">Client Address</label>
     <input type="text" placeholder="Client Address" value={formclient.clientAddress}   onChange={(e)=>{setformclient({...formclient, clientAddress: e.target.value}) ;console.log(formclient.clientAddress);  }} className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div>
    <label className="mt-20 ">Client Phone</label>
     <input type="text" placeholder="Client Phone"  value={formclient.clientPhone}   onChange={(e)=>{setformclient({...formclient, clientPhone: e.target.value}) ;  }} class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <div>
    <label className="mt-20 ">Owner Name</label>
     <input type="text" placeholder="Owner Name" value={formclient.ownerName}   onChange={(e)=>{setformclient({...formclient, ownerName: e.target.value}) ;  }} className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div>
    <label className="mt-20 ">Owner Address</label>
     <input type="text" placeholder="owner Address" value={formclient.ownerAddress}   onChange={(e)=>{setformclient({...formclient, ownerAddress: e.target.value}) ;  }} className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div>
    <label className="mt-20 ">Owner phone</label>
     <input type="text" placeholder="Owner Phone" value={formclient.ownerPhone}   onChange={(e)=>{setformclient({...formclient, ownerPhone: e.target.value}) ;  }} className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>


    {
      formClose.closeUpdateStatus && formClose.closeUpdateStatus==="verified" ?
      <div><h1></h1></div>:
        formclient.clientUpdateStatus && formclient.clientUpdateStatus==="client-unverified" && formclient.clientMaker===user.email?
       ( <div className="p-2 border-1 bg-slate-400">
          <h1>Please verify from other user</h1>
      </div> ):
   
          formclient.clientUpdateStatus==="client-unverified" && formclient.clientMaker!==user.email ?
      <>  <label className=" ">{}</label>
      <button id="idsaveclientinfo" onClick={()=>verifyClientInfo()} className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 cursor-pointer" >Verify</button>
     </>:        
        <div>
        <label className=" ">{}</label>
         <button id="idsaveclientinfo" onClick={()=>saveClientInfo()} className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 cursor-pointer" >Update</button>
        </div>
  
      }
     

    </div>
     

   <div className="h-4"></div>
     <h1 className="text-lg text-bold text-gray-600 py-4">Others Detail</h1>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3  shadow-lg  border-2 py-7 px-3 rounded  bg-gray-100 ">
  
    <div>
    <label className="mt-20 ">Lat Long</label>
     <input  value={formOther.latlong} onChange={(e)=>{setFormOther({...formOther, latlong: e.target.value}) ;  }} type="text" placeholder="Lat Long" class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <div>
    <label className="mt-20 ">Field Charge Cost</label>
     <input type="text"  value={formOther.fieldchargeCost} onChange={(e)=>{setFormOther({...formOther, fieldchargeCost: e.target.value}) ;  }} placeholder="Field Charge Cost" class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <div>
    <label className="mt-20 ">Bank Name  </label>
     <select  ref={bankRef}    value={currentBank} defaultValue={'Choose One'} onChange={
                        (e) => {
                            setCurrentBank(e.target.value);
                           
                            // setClaimTypeState(e.target.value)
                     
                             setFormOther({ ...formOther, bankName:e.target.value });
                             if(e.target.value==="Select One")return;

                           const filterData=    allBankListLongTerm.filter((object)=>{
                              return object.bankName===e.target.value;
                             }
                             );
                              if(filterData.length>0)
                             setBranchList(filterData[0].branchList)
                            else
                            setBranchList([])
    
                        }} className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Choose One" selected>Choose One</option>
                        {
                            bankList.map((e, index) => {                                
                                return <option key={index} value={e}>{e}</option>
                            })
                        }
     </select>
     </div>

     <div>
    <label className="mt-20 ">Branch Name </label>
     <select  ref={branchRef}    value={currentBranch} defaultValue={'Select One'} onChange={
                        (e) => {
                            setCurrentBranch(e.target.value);
                           
                            // setClaimTypeState(e.target.value)
                             setFormOther({ ...formOther, bankBranch:e.target.value });

                             console.log(branchRef.current.value);
                             
                        }
                    } className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="Choose One" selected>Choose One</option>
                        {
                            branchList.map((e, index) => {                                
                                return <option key={index} value={e}>{e}</option>
                            })
                        }
     </select>
     </div>

     <div>
    <label className="mt-20 ">Property Type</label>
<select   ref={selectRef}    value={currentPropertyType} defaultValue={'Select One'} onChange={
                        (e) => {
                            setCurrentPropertyType(e.target.value);
                           
                            // setClaimTypeState(e.target.value)
                             setFormOther({ ...formOther, propertyType: e.target.value });
                             
                        }
                    }  className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                     <option value="Choose One" selected>Choose One</option>
                        {
                            propertyTypes.map((e, index) => {                                
                                return <option key={index} value={e}>{e}</option>
                            })
                        }
 </select>
</div>
 
 
{
  formClose.closeUpdateStatus && formClose.closeUpdateStatus==="verified" ?
  <div><h1></h1></div>:
        formOther.otherUpdateStatus && formOther.otherUpdateStatus==="other-unverified" && formOther.otherMaker===user.email?
       ( <div className="p-2 border-1 bg-slate-400">
          <h1>Please verify from other user</h1>
      </div> ):
   
          formOther.otherUpdateStatus==="other-unverified" && formOther.otherMaker!==user.email ?
      <>  <label className=" ">{}</label>
      <button id="idsaveotherinfo" onClick={()=>verifyOtherDetail()} className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 cursor-pointer" >Verify</button>
     </>:        
        <div>
        <label className=" ">{}</label>
         <button id="idsaveotherinfo" onClick={()=>saveOtherDetail()} className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 cursor-pointer" >Update</button>
        </div>
  
      }
     

 
      </div>
     


      <div className="h-4"></div>
     <h1 className="text-lg text-bold text-gray-600 py-4">Add File Detail</h1>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3  shadow-lg  border-2 py-7 px-3 rounded  bg-gray-100 ">
  
   

    <div>
    <label className="mt-20 ">File type</label>
     <select   value={currentFileType} onChange={ (event)=>{setCurrentFileType(event.target.value)}} className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option selected  className='bg-gray-600 rounded-lg   font-normal text-white' value="Select One">Select One</option>
                    <option className=' bg-white rounded-lg   font-normal text-black' value="Lalpurja">Lalpurja</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value="Naksa">Naksa</option>
                    <option className=' bg-white rounded-lg   font-normal text-black' value="TwoPage">TwoPage</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value="Book">Book</option>
                    <option className='bg-white rounded-lg  font-normal text-black' value="Other">Other</option>
           
     </select>
     </div>

   <div>
    <label className="mt-20 ">Choose File</label>
     <input type="file"   ref={inputRef}  accept="" onChange={(event)=>{manageObjectFiles(event)}}  placeholder="First Name" class=" text-black w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
 
   
    <div>
    <label className=" "></label>
     <button  onClick={async()=>{
       try{
        

        if(valuationFiles.length<1  || valuationFiles.length>1 ){
          alert("Only one file can be save at a time,either 0 file or more than 1 file selected. ");
          return;
        };
        uploadFile( formCost.valuationFileNo, valuationFiles[0].objectFile, valuationFiles[0].objectFile.name, valuationFiles[0].fileType);           
      
       }
       catch(e){
        alert(e);
       }
     }} type="submit" className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 cursor-pointer" >
        Update
    </button>
    </div>



  <div>
<table className="min-w-full border border-gray-200 text-sm text-left">
  <thead className="bg-gray-100">
    <tr>
      <th className="border px-4 py-2 w-12">#</th>
      <th className="border px-4 py-2 w-32">File Type</th>
      <th className="border px-4 py-2 w-60">File Name</th>
      <th className="border px-4 py-2 w-20">Action</th>
    </tr>
  </thead>
  <tbody>
    {allfileTypeAndUrl &&
      allfileTypeAndUrl.map((e, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="border px-4 py-2">{index + 1}</td>
          <td className="border px-4 py-2">{e.fileType}</td>
          <td className="border px-4 py-2">
            {e.fileName.toString().slice(0, 20)}
          </td>
          <td className="border px-4 py-2 text-red-600 underline cursor-pointer"
              onClick={async () => {
                // deleteFromStorage(form.valuationFileNo, e.fileName.toString());
              }}>
            Delete
          </td>
        </tr>
      ))}
  </tbody>
</table>

</div>
      </div>


  
   <div className="h-4"></div>
     <h1 className="text-lg text-bold text-gray-600 py-4">Add or Update Cost Detail</h1>
  <div class="grid    bg-gray-100   grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3  shadow-lg  border-2 py-7 px-3 rounded">
  
    

    {/* <div>
    <label className="mt-20 ">Total Expense</label>
     <input type="text"  value={formCost.totalExpense} onChange={(e)=>{setFormCost({...formCost, totalExpense: e.target.value}) ;  }} placeholder="Total Expense" class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div> */}

    <div>
    <label className="mt-20 ">FMV Value</label>
     <input type="text"  value={formCost.fmvValue} onChange={(e)=>{setFormCost({...formCost, fmvValue: e.target.value}) ;  }} placeholder="Fmv Value" class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    {/* <div>
    <label className="mt-20 ">Book Value</label>
     <input type="text"  value={formCost.bookValue} onChange={(e)=>{setFormCost({...formCost, bookValue: e.target.value}) ;  } } placeholder="Book Value" class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div> */}

    <div>
    <label className="mt-20 ">Amount Of Bill</label>
     <input type="text" placeholder="Amount of Bill" value={formCost.amountofBill} onChange={(e)=>{setFormCost({...formCost, amountofBill: e.target.value}) ;  }}  class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div>
    <label className="mt-20 ">Final Received Amount From Customer </label>
     <input type="text"  value={formCost.totalIncome} onChange={(e)=>{setFormCost({...formCost, totalIncome: e.target.value}) ;  }}  placeholder="Final Received Amount" class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

   <div>
    <label className="mt-20 ">Two Page Maker</label>
     <input type="text"  value={formCost.twopageMaker} onChange={(e)=>{setFormCost({...formCost, twopageMaker: e.target.value}) ;  }} placeholder="Two Page Maker" class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <div>
    <label className="mt-20 ">Book Maker</label>
     <input type="text" placeholder="Book Maker" value={formCost.bookMaker} onChange={(e)=>{setFormCost({...formCost, bookMaker: e.target.value}) ;  } } class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <div>
    <label className="mt-20 ">Book Close Date</label>
     <input type="date" placeholder="Book Close Date"  value={formCost.bookCloseDate} onChange={(e)=>{setFormCost({...formCost, bookCloseDate: e.target.value}) ;  } } class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
 
 
    {
    formClose.closeUpdateStatus && formClose.closeUpdateStatus==="verified" ?
    <div><h1></h1></div>:

        formCost.costUpdateStatus && formCost.costUpdateStatus==="cost-unverified" && formCost.costMaker===user.email?
       ( <div className="p-2 border-1 bg-slate-400">
          <h1>Please verify from other user</h1>
      </div> ):
   
   formCost.costUpdateStatus==="cost-unverified" && formCost.costMaker!==user.email ?
      <>  <label className=" ">{}</label>
      <button id="idsaveotherinfo" onClick={()=>verifyCost()} className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 cursor-pointer" >Verify</button>
     </>:        
        <div>
        <label className=" ">{}</label>
         <button id="idsaveotherinfo" onClick={()=>saveCostInfo()} className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 cursor-pointer" >Update</button>
        </div>
  
      }
     

 
 




      </div>
{//--------------------------close
}

      <div className="h-4"></div>
     <h1 className="text-lg text-bold text-gray-600 py-4">Add any remarks</h1>
  <div class="grid   bg-gray-100  grid-cols-1  gap-4 sm:grid-cols-1 lg:grid-cols-3  shadow-lg  border-2 py-7 px-3 rounded">
  
    <div>
    <label className="mt-20 "> Closing Remarks</label>
     <textarea   value={formClose.closeRemarks} onChange={(e)=>{setFormClose({...formClose, closeRemarks: e.target.value}) ;  } } rows="3" cols="10" type="text" placeholder="First Name" class=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    {
     formClose.closeUpdateStatus && formClose.closeUpdateStatus==="verified" ?
     <div><h1></h1></div>:

        formClose.closeUpdateStatus && formClose.closeUpdateStatus==="close-unverified" && formClose.closeMaker===user.email?
       ( <div className="p-2 border-1 bg-slate-400">
          <h1>Please verify from other user</h1>
      </div> ):
   
   formClose.closeUpdateStatus==="close-unverified" && formClose.closeMaker!==user.email ?
      <> <div>  <label className=" ">{}</label>
      <button id="idsaveotherinfo" onClick={()=>verifyClose()} className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-600 cursor-pointer" >Verify</button>
      </div>
     </>:        
        <div>
        <label className=" ">{}</label>
         <button id="idsaveotherinfo" onClick={()=>saveClose()} className="mt-6 text-black w-full px-4 py-2 border hover:bg-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 cursor-pointer" >Update</button>
        </div>
  
      }



    
      </div>




</div>


<div className="h-11  bg-white"> </div>

</>
}
</div>
   </div>
   
    );

}