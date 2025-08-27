import React, { useEffect, useState } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { getDoc,query, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebase/Firebase';
import { doc } from 'firebase/firestore';
import swal from 'sweetalert';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import logo from '../../../images/logo512.png';
import { ref,  getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/Firebase';
import { saveAs } from 'file-saver';
import {AiFillPrinter} from 'react-icons/ai'
import { HiArrowSmUp, HiCheckCircle, HiDocumentAdd, HiEye, HiMinusSm, HiPlusSm, HiViewBoards, HiViewList } from 'react-icons/hi';
import {HiViewGrid} from 'react-icons/hi'
import {AiFillFileExcel} from 'react-icons/ai';
import {AiOutlineMail} from 'react-icons/ai';
import {BsSearchHeart}  from 'react-icons/bs';
import { addDoc } from 'firebase/firestore';
 
import {AiOutlineVerticalAlignBottom} from 'react-icons/ai';
import Stepper from 'react-stepper-horizontal';

import {BsFiletypeDocx} from 'react-icons/bs';
import Modal from './Modal';
import FileSaver from 'file-saver';
import { Document, ImageRun, Packer, Paragraph , TextRun} from "docx";
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
 
import ModalLoader from '../Files/ModalLoader';
import { UserAuth } from '../../../context/AuthContext';
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

 
      
//DOWNLOAD ALL PHOTOS AND FILE END *******************************
     
/////////// *******************************************************SEND DETAILS IN MAILS ****************

 
////  *****************  CONVERT JSON FIELD TO ROW *****************************************//

 
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

 
//****************************************** */
  

  /////////////////////////////ABOVE IS IMAGE ????????????????????????????????
 
async function AddNewBank(){
    const { value: text,  } = await Swal.fire({
        input: "text",
        inputLabel: "Add New Bank Name",
        inputPlaceholder: "Type  new bank name here...",
        inputAttributes: {
          "aria-label": "Type your remarks"
        },
        showCancelButton: true
      });
      if(text.trim() ===""){
        swal("Empty Bank Name");
        return;
      }
      if(text.trim() !=="" || text!==undefined){
          
        //create new documnet
        try{
        const docRef = await addDoc(collection(db, "bankdetail"), {
            bankId:"",    
            bankName: text,
            branchList:[],
            files:[],

          });
        
          const userDocRef = doc(db, "bankdetail", docRef.id);
          //  await updateDoc(userDocRef, {files: listofUrls}, { merge: true });
            await updateDoc(userDocRef, {bankId: docRef.id}, { merge: true });
            
        swal("Successfully inserted/updated");
        getAllBankInformation();

        
        }

          catch(e){
            swal(e);
          }

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

async function addBranch(id){
  try{

    const { value: text,  } = await Swal.fire({
      input: "text",
      inputLabel: "Add New Branch Name",
      inputPlaceholder: "Your branch name here",
      inputAttributes: {
        "aria-label": "Type your remarks"
      },
      showCancelButton: true
    });
    if(text.trim() ===""){
      swal("Empty branch name");
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
   swal("new data empty");
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
    inputLabel: "type delete to delete",
    inputPlaceholder: "Input delete here",
    inputAttributes: {
      "aria-label": "Type your remarks"
    },
    showCancelButton: true
  });

  if(text.trim() ===""){
    swal("Empty field");
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

  swal("Successfully Deleted"+ id+branchName);
}
    //get all 
    
  }

 }
 catch(e){
  swal(e);
 }


}
 

 
//////////////////////////////&&&&&&&&&&&&&&&&&&&&9999&&&&&&&&&&&&&&&&&&


async function deleteBankName(bankId){

    try{

      const x = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover " ,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    });
    if(!x)return;

 
         
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
        <div className=' w-full h-full bg-slate-950 p-5'>
            <div className='   flex flex-row  m-2 text-center bg-slate-950'>
                <div className='h-10  z-10 flex'><img src={logo}  className='shadow-2xl rounded-full' alt='Image' /></div>
                <p className='text-sm   font-bold p-5 text-orange-400'>Gudx Engineering Sevice</p>
                <p className='text-md   font-normal p-5 text-orange-400'>Bank and Branch Detail</p>
               

            </div>
            <div>
             
            </div>
            <div>{
                 user.email
                }
                </div>
           
 
 
          

                <div  >
            
                    <div className='text-black bg-white text-lg p-11 font-thin '>
                      
               
                             <div className='font-bold mt-5 p-5 text-sm mb-5'>
                                  


                                    <div class="grid grid-cols-2 border  p-5">
                                        <div className=''>
                                            <p className='text-sm font-bold underline'>Bank List</p>
                                             <div className='cursor-pointer' onClick={()=>{
                                                AddNewBank()
                                             }}><HiPlusSm size={"30px"} className='rounded-tr-lg rounded-br-lg text-white cursor-pointer bg-sky-950 hover:bg-sky-900 ' /></div>

                                            <div className=' text-xs space-x-2'>                                       
                                              <ul>
                                                {
                                              allBankList &&      allBankList.map((object,index)=>{
                                                        return   (
                                                        <li  key={index} className="flex pt-2 hover:bg-gray-200 cursor-pointer  ">
                                                         <span className='w-56'>
                                                            {
                                                                object.bankName
                                                            }
                                                       </span>
                                                      
                                                       <span>
                                                             <HiPlusSm  onClick={()=>{
                                                              addBranch(   object.bankId)
                                                             }} className='rounded-tr-lg rounded-br-lg text-white cursor-pointer bg-sky-950 hover:bg-sky-900 ' size={"30px"} />
                                                       </span>

                                                       <span className='w-2'>

                                                       </span>
                                                        <span>
                                                             <HiMinusSm  onClick={()=>{
                                                                    deleteBankName(object.bankId)

                                                             }}  className='rounded-tr-lg rounded-br-lg text-white cursor-pointer bg-sky-950  hover:bg-sky-900' size={"30px"} />
                                                       </span>
                                                       <span className='w-2'></span>
                                                    
                                                  <span>
                                                    <HiViewBoards   onClick={()=>{
                                                      setActiveBank(object.bankId);
                                                      setSelectedBranchList(object.branchList)
                                                    }
                                                    }
                                                     className= {activeBank===object.bankId?"rounded-tr-lg rounded-br-lg text-white cursor-pointer bg-rose-900  hover:bg-rose-700":  "rounded-tr-lg rounded-br-lg text-white cursor-pointer bg-sky-950  hover:bg-sky-900"} size={"30px"} />
                                                  </span>
                                               
                                                       
                                                    </li>)
                                                    })
                                                }
                                              
                                              </ul>
                                               
                                            </div>
                                        </div>
 
                                       
                                        <div className='text-xs font-normal'>
                                            <p className='text-xs font-bold underline'>Branch List</p>
                                                 <ul>
                                                  {
                                                    selectedBranchList.map((object,index)=>{
                                                      return <li  className='pl-2 pt-2 pb-2 font-semibold rounded-md border border-gray-500 '  key={index}>   
                                                        <span className='rounded-lg bg-slate-950 text-white pl-2 pr-2 mr-2 pt-1 pb-1'  >{index+1}</span> <span> <span  onClick={()=>{
//delete from branch lis                                      
                                                         deleteBranchList(activeBank, object);
                                                        }} className='inlibe-block rounded-lg cursor-pointer '  > <HiMinusSm className=' inline-block text-black '/> </span> </span><span >{object}</span> <span> </span>
                                                         </li>
                                                    })
                                                  }
                                                 </ul>

                                        </div>
                                    </div>
                                    <hr />
                                    <div class="grid grid-cols-2 border  p-5">
                                        <div className=''>
                                           
                                            <div className=' text-xs space-x-2'>
                                              
                                                 </div>
                                        </div>

                                   
                                        <div className='text-xs font-normal'>
                                           
                                            
                                        </div>
                                    </div>
                                </div>



                          


                      
                    </div>

                      

                </div>


        
    
    {/* ITS SHOWS THE FILE HERE STARTING IS HERE */}

<div className=' bg-white text-black mt-4 mb-4 w-full overflow-x-scroll '>
     
     {/* <table className=' border font-normal text-sm   w-full'>
        <thead>
            <tr className='border font-semibold bg-orange-700 text-left text-white   '>
            <th className='border px-2 py-3 '>SN</th>
            <th className='border px-2 py-3'>File Name</th>
            <th className='border px-2 py-3'>File Type</th>
            <th className='border px-2 py-3'>View</th>
            </tr>
        </thead>
        <tbody>
        <tr  className='bg-slate-100 py-5' ><td colSpan="4" className='py-3 font-bold'>File Details</td></tr>
            {
                 
                <>
                <tr className='border bg-slate-100 hover:bg-gray-600 hover:text-white cursor-pointer  '>
                <td className='border px-2 py-4'><span>{ }</span></td>
                <td  className='border px-2 py-4'><span>{ }</span></td>
                <td  className='border px-2 py-1 font-semibold'><span>{ }</span></td>
               
                  <td  className='border px-2 py-1'>
                  <div className='flex'>
                  <a href="" target='_blank'>
                    <HiEye className=' ' size="20px" /></a>  
                  <button onClick={async()=>{ 
                  
                     //  const 
                      }}>
                  <AiOutlineVerticalAlignBottom  size="20px" /></button> 
                  </div> 
                  </td>
               </tr>

                </>
              
            }
             
          
  
        </tbody>
     </table> */}
        
</div>


 
        </div>
    )
}
