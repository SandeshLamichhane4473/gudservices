import React, { useEffect, useState } from 'react';
 
import { getDoc,query, getDocs, collection } from 'firebase/firestore';
 import { db } from '../../firebase/Firebase';
import { doc } from 'firebase/firestore';
import swal from 'sweetalert';
 
import { HiPlusSm,HiViewBoards,HiMinusSm } from 'react-icons/hi';

 
import logo from '../../images/logo512.png';
 
import { addDoc } from 'firebase/firestore';
import { UserAuth } from '../../context/AuthContext';

import { updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { deleteDoc } from 'firebase/firestore';
 
import { Popover, ArrowContainer } from 'react-tiny-popover'


export default function Bank() {

     const [isLoading, setLoading] = useState(false);
    const { user} = UserAuth()
    const [form, setForm]= useState({
        bankName:"",
        bankBranches:[]
    });
    const [allBankListLongTerm, setAllBankListLongTerm]=useState([]);
    const [allBankList, setAllBankList]= useState([]);
    const [listFileNoSuggestion, setListFIleNoSuggestion]= useState([]);
   const [isPopoverOpen, setIsPopoverOpen]=useState(true);
   const [selectedBranchList, setSelectedBranchList]=useState([]);
  const  [activeBank, setActiveBank]=useState("");
 
    
    
    useEffect(() => {   
         getAllBankInformation();
    }, []);

 
      
 
 
async function AddNewBank() {
  const { value: text } = await Swal.fire({
    input: "text",
    inputLabel: "Add New Bank Name",
    inputPlaceholder: "Type new bank name here...",
    inputAttributes: {
      "aria-label": "Type your remarks",
    },
    showCancelButton: true,
    background: "#1e293b", // dark background
    color: "#ffffff",      // white text
  });

  // 🔹 Handle cancel or empty input safely
  if (!text || text.trim() === "") {
    
    return;
  }

  try {
    // Create new document
    const docRef = await addDoc(collection(db, "bankdetail"), {
      bankId: "",
      bankName: text.trim(),
      branchList: [],
      remarks:"",
      files: [],
    });

    const userDocRef = doc(db, "bankdetail", docRef.id);
    await updateDoc(userDocRef, { bankId: docRef.id }, { merge: true });

    swal("Successfully inserted/updated");
    getAllBankInformation();
  } catch (e) {
    swal(e.message || "Error inserting bank");
  }
}


async function addRemarks(bankid, bank) {
const { value: text } = await Swal.fire({
  input: "textarea",        // <-- change from "text" to "textarea"
  inputLabel: "Add remarks for "+bank,
  inputPlaceholder: "Add remarks for...",
  inputAttributes: {
    "aria-label": "Type your remarks",
    rows: 10,                // number of visible lines
    maxlength: 700
  },
  showCancelButton: true,
  background: "#1e293b",
  color: "#ffffff",
});


  // 🔹 Handle cancel or empty input safely
  if (!text || text.trim() === "") {  
    return;
  }
 

  try {
    // Create new document
 
    const userDocRef = doc(db, "bankdetail", bankid);
    await updateDoc(userDocRef, { bankId:bankid, remarks:text }, { merge: true });

    swal("Successfully  updated remarks");
 
  } catch (e) {
    swal(e.message || "Error inserting bank");
  }
}



async function getAllBankInformation(){
    try{
        const bankref = collection(db, "bankdetail"); 
        const querySnapshot= await getDocs(bankref);
        setAllBankList([]);
       setAllBankListLongTerm([]);
     
        let tempdata=[];
        let tempCollDocData=[];
     
        console.log(querySnapshot.docs.length);
        if (querySnapshot.docs.length >= 1) {      
            querySnapshot.forEach((doc) => {      
             tempdata.push(doc.data())
            let  bankId =doc.data()['bankId'];
            let bankName= doc.data()['bankName'];
            const docData=    { value: bankId,  label: bankName };
            tempCollDocData.push(docData);       
            }
           );
           setListFIleNoSuggestion(tempCollDocData);
        let newTempData= tempdata.reverse();
      
       setAllBankList(newTempData);
       setAllBankListLongTerm(newTempData);
     
        }
        
    }
    catch(e){
        swal(e);
    }
}

async function addBranch(id,name){
  try{

    const { value: text,  } = await Swal.fire({
      input: "text",
      inputLabel: "Add New Branch Name for "+name,
      inputPlaceholder: "...",
      inputAttributes: {
        "aria-label": "Type your remarks"
      },
      showCancelButton: true,
      background: "#1e293b", // dark background
    color: "#ffffff",
    });
     if (!text || text.trim() === "") {
    
    return;
  }
    if(text.trim() !=="" || text!==undefined){
      let userDocRef = doc(db, "bankdetail", id);
      let listofUrls=[];
      //filter the older list 
   let objectInfo=allBankListLongTerm  && allBankListLongTerm.filter((object)=>{
        return object.bankId===id;
      });
      console.log("Branch List...");
      console.log(objectInfo[0].branchList);
    if(objectInfo[0].branchList===undefined || objectInfo[0].branchList.length<1){
      swal("old emty data");
      listofUrls.push(text.trim());
    }else{
  
   objectInfo[0].branchList.map((object)=>{
      listofUrls.push(object);
   });
   listofUrls.push(text.trim());
    };


      await updateDoc(userDocRef, {branchList: listofUrls}, { merge: true }).catch((error) => { swal(error); });
      swal("Updated", "success");
      
 
      getAllBankInformation();
      setSelectedBranchList(listofUrls)
       setActiveBank(id);
     
    }
    
    // listofUrls= allfileTypeAndUrl.filter((object)=> {
    
    
  //  
  // setAllFileTypeAndUrl(listofUrls) 

  }
  catch(e){
    swal(e)
  }
}

async function deleteBranchList(id, branchName){
 try{
  const { value: text,  } = await Swal.fire({
    input: "text",
    inputLabel: "Type delete to delete"+branchName,
    inputPlaceholder: "Type delete here",
    inputAttributes: {
      "aria-label": "Type your remarks"
    },
    showCancelButton: true,
     background: "#1e293b", // dark background
    color: "#ffffff",
  });

  if (!text || text.trim() === "") {  
    return;
  }

 
  if(text.trim() ==="delete" ){
     
   let objectInfo=allBankListLongTerm  && allBankListLongTerm.filter((object)=>{
    return object.bankId===id;
  })
console.log(objectInfo);

    if(objectInfo[0].branchList===undefined || objectInfo[0].branchList.length<1){
    }else{

   const listofUpdatedBranch=   objectInfo[0].branchList.filter((_object)=>{
        return _object!==branchName;

      })
      console.log(listofUpdatedBranch);
  
  //slect first object
  let userDocRef = doc(db, "bankdetail", id);
  await updateDoc(userDocRef, {branchList: listofUpdatedBranch}, { merge: true }).catch((error) => { swal(error); });
  
  getAllBankInformation();
  setSelectedBranchList(listofUpdatedBranch)
  setActiveBank(id);

  swal("Successfully Deleted"+ branchName);
}
    //get all 
    
  }

 }
 catch(e){
  swal(e);
 }


}
 

 
//////////////////////////////&&&&&&&&&&&&&&&&&&&&9999&&&&&&&&&&&&&&&&&&


async function deleteBankName(bankId,bankName){

    try{

      const x = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover " +bankName ,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    });
    if(!x)return;
    return;
 
         
         if(user.role!=="admin"){
            swal("Unauthorize access right");
            return;
         }
       ;
        swal(bankId);
          await deleteDoc(doc(db, "bankdetail", bankId));
          swal("successfully deleted");
          setActiveBank("");
          setSelectedBranchList([]);
          getAllBankInformation();
    }
    catch(e){
        swal("Error : "+ e);
    }
}

//////////%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 
return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-5">
  {/* Bank Table */}
  <div className="overflow-x-auto">
    <button
      onClick={AddNewBank}
      className="flex items-center bg-green-900 gap-2 px-3 py-2 rounded-lg text-white bg-sky-950 hover:bg-sky-900 mb-2"
    >
      <HiPlusSm size={24} />
      <span>Add New Bank</span>
    </button>

    <table className="min-w-full text-black border border-gray-200 text-sm text-left">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-2 py-2 border">Bank Name</th>
          <th className="px-2 py-2 border">Add</th>
          <th className="px-2 py-2 border">Cut</th>
           <th className="px-2 py-2 border">Rem</th>
          <th className="px-2 py-2 border">Branches</th>
        </tr>
      </thead>
      <tbody>
        {allBankList &&
          allBankList.map((object, index) => (
            <tr
              key={index}
              className={activeBank === object.bankId ? "bg-gray-400 hover:bg-gray-100 cursor-pointer" : "hover:bg-gray-100 cursor-pointer"}
            >
              <td className="px-1 py-2 border w-56 whitespace-nowrap">{object.bankName}</td>
              <td className="px-1 py-2 border text-center">
                <HiPlusSm
                  onClick={() => addBranch(object.bankId, object.bankName)}
                  className="text-green-900 cursor-pointer bg-sky-950 hover:bg-sky-900 rounded p-1"
                  size={"30px"}
                />
              </td>
              <td className="px-1 py-2 border text-center">
                <HiMinusSm
                  onClick={() => deleteBankName(object.bankId, object.bankName)}
                  className="text-green-900 cursor-pointer bg-sky-950 hover:bg-sky-900 rounded p-1"
                  size={"30px"}
                />
              </td>
               <td className="px-1 py-2 border text-center">
                <HiPlusSm
                  onClick={() => addRemarks( object.bankId, object.bankName)}
                  className="text-green-900 cursor-pointer bg-sky-950 hover:bg-sky-900 rounded p-1"
                  size={"30px"}
                />
              </td>
              <td className="px-1 py-2 border text-center">
                <HiViewBoards
                  onClick={() => {
                    setActiveBank(object.bankId);
                    setSelectedBranchList(object.branchList);
                  }}
                  className="text-green-900 cursor-pointer bg-sky-950 hover:bg-sky-900 rounded p-1"
                  size={"30px"}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>

  {/* Branch Table */}
  <div className="overflow-x-auto">
    <p className="text-lg text-black font-bold underline mb-2">Branch List of { 
    allBankListLongTerm.find(bank => bank.bankId === activeBank)?.bankName || "Unknown Bank"
  }</p>
    <table className="min-w-full border border-gray-300 text-sm text-left text-black">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
       
          <th className="px-4 py-2 border">Branch Name</th>
          <th className="px-4 py-2 border w-20 text-center">Delete</th>
        </tr>
      </thead>
      <tbody>
        {selectedBranchList.map((object, index) => (
          <tr key={index} className="hover:bg-gray-50 text-black">
             
            <td className="px-4 py-2 border">{object}</td>
            <td className="px-4 py-2 border text-center">
              <button
                onClick={() => deleteBranchList(activeBank, object)}
                className="cursor-pointer p-1 rounded hover:bg-gray-200"
              >
                <HiMinusSm className="inline-block text-red-600" size={"22px"} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <hr></hr>
    <p className='text-black mt-5'>
      Remarks
     { 
    allBankListLongTerm.find(bank => bank.bankId === activeBank)?.remarks || " "
      }
    </p>

  </div>
</div>

    )
}
