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
import { HiCheckCircle, HiEye } from 'react-icons/hi';
import {HiViewGrid} from 'react-icons/hi'
import {AiFillFileExcel} from 'react-icons/ai';
import {AiOutlineMail} from 'react-icons/ai';
import {BsSearchHeart}  from 'react-icons/bs'
import Select from 'react-select';
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

export default function ValuationVerify() {

    const [isLoading, setLoading] = useState(false);
    const [referenceData, setReferenceData] = useState({});
    
    const [ activeStep, setActiveStep ] = useState();
    const steps = [
        { title: 'Site Visited' },
        { title: 'Two Page Making' },
        { title: 'Book Making' },
      ];
  
    const componentRef = useRef();
    const  imageToPrintRef = useRef();
 
    const [valuationObject, setValuationObject] = useState();
 
 
   const [excelExportData, setExcelExportData]= useState([]);
 
   const Excel = require('exceljs');
    const { user} = UserAuth()


   const location = useLocation();
    const [showLoaderModal, setShowLoaderModal]= useState(false);
   const { id } =  useParams();
 

var searchId =  "";

 location.state!==null?
  searchId=location.state.id:
  searchId=id;
 
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
   
    useEffect(() => {    
        console.log()
         
      getReferenceIdDEtails();
    }, []);

    async function verifyValuationId(){
        try{
            if(!user){
                swal("Empty User" );
                return;
            }
       
        //    if( valuationObject.initchecker.trim()!==""){
        //     swal("Already checked" );
        //     return;
        //    }

        //for close case
     
        let  userDocRef = doc(db, "valuation", valuationObject.valuationFileNo);
        if(valuationObject.curentState.trim()==="01CNV"){
          await updateDoc(userDocRef, {curentState:"01CV"}, { merge: true }).catch((error) => { swal(error); });
          swal("Verified and file completed");
          getReferenceIdDEtails();
          return;
        }

           if( valuationObject.initmaker.trim()===""){
            swal("Maker is empty" );
            return;
           }
           if(  user.email.trim()===valuationObject.initmaker.trim()){
            swal("Maker and Checker are same, different required");
            return;
           }
         
           
           if(valuationObject.curentState==="01NV" ||  valuationObject.curentState==="01"){
          await updateDoc(userDocRef, {curentState:"01V", initchecker: user.email}, { merge: true }).catch((error) => { swal(error); });
          swal("Verified");
          getReferenceIdDEtails();
        }
        if(valuationObject.curentState==="012NV"){
            await updateDoc(userDocRef, {curentState:"012V"}, { merge: true }).catch((error) => { swal(error); });
            swal("Verified");
            getReferenceIdDEtails();
          }
          if(valuationObject.curentState==="0123NV"){
            await updateDoc(userDocRef, {curentState:"0123V"}, { merge: true }).catch((error) => { swal(error); });
            swal("Verified and file completed");
            getReferenceIdDEtails();
          }
          if(valuationObject.curentState==="01CNV"){
            await updateDoc(userDocRef, {curentState:"01CV"}, { merge: true }).catch((error) => { swal(error); });
            swal("Verified and file completed");
            getReferenceIdDEtails();
          }

        }
        catch(e){
            swal(e);
        }
    }

      
//DOWNLOAD ALL PHOTOS AND FILE END *******************************
    async function getReferenceIdDEtails() {
   
   
      setLoading(true);          
        let temp = [];
        try {
            const ref = doc(db, "valuation", searchId);
            setValuationObject(objform);
            setExcelExportData([]);
            const docSnap = await getDoc(ref);
   
            if (docSnap.exists()) { 
            
           setValuationObject(docSnap.data());
       
                 var index=1;
                 convertJsonFieldToRow(index,"Valuation No", docSnap.data()['valuationFileNo']);   
                 convertJsonFieldToRow(index=index+1,"clientOrcompanyName", docSnap.data()['clientOrcompanyName'] && capitalizeFirstLetter(docSnap.data()['clientOrcompanyName'])  );
                  convertJsonFieldToRow(index=index+1,"clientAddress",   docSnap.data()['clientAddress'] && capitalizeFirstLetter(docSnap.data()['clientAddress']));  
                 convertJsonFieldToRow(index=index+1, "clientPhone",  docSnap.data()['clientPhone']&& capitalizeFirstLetter(docSnap.data()['clientPhone']));              
                  ;

                 convertJsonFieldToRow(index=index+1, "ownerName", docSnap.data()['ownerName']);  
                 convertJsonFieldToRow(index=index+1, "ownerAddress", docSnap.data()['ownerAddress']);
                 

                 convertJsonFieldToRow(index=index+1, "ownerPhone", docSnap.data()['ownerPhone']);
              
                 convertJsonFieldToRow(index=index+1, "propertyType", docSnap.data()['propertyType']);
               

                 convertJsonFieldToRow(index=index+1, "bankName", docSnap.data()['bankName']); 
              
                 convertJsonFieldToRow(index=index+1, "bankBranch", docSnap.data()['bankBranch']);  
                 convertJsonFieldToRow(index=index+1, "fieldchargeCost", docSnap.data()['fieldchargeCost']); 
                 convertJsonFieldToRow(index=index+1, "latlong", docSnap.data()['latlong']);  
                 convertJsonFieldToRow(index=index+1, "curentState", docSnap.data()['curentState']);  
                 
                   
                 convertJsonFieldToRow(index=index+1, "initSubmitDate", docSnap.data()['initSubmitDate']); 
                 convertJsonFieldToRow(index=index+1, "initmaker", docSnap.data()['initmaker']);   
               
                 convertJsonFieldToRow(index=index+1, "initchecker", docSnap.data()['initchecker']);
                 
                 convertJsonFieldToRow(index=index+1, "fmvDate", docSnap.data()['fmvDate']);  
                 convertJsonFieldToRow(index=index+1, "twoPageMakingDate", docSnap.data()['twoPageMakingDate']);  
                 convertJsonFieldToRow(index=index+1, "fmvValue", docSnap.data()['fmvValue']);  
                 convertJsonFieldToRow(index=index+1, "twopageMaker", docSnap.data()['twopageMaker']);  
                convertJsonFieldToRow(index=index+1, "twoPageRemarks", docSnap.data()['twoPageRemarks']);

                 convertJsonFieldToRow(index=index+1, "bookCloseDate", docSnap.data()['bookCloseDate']);  
              
                 convertJsonFieldToRow(index=index+1, "amountofBill", docSnap.data()['amountofBill']);    
                 convertJsonFieldToRow(index=index+1, "closeMaker", docSnap.data()['closeMaker']);  
                 convertJsonFieldToRow(index=index+1, "closreRemarks", docSnap.data()['closreRemarks']);
                 
                 
                 //active steps
                setActiveStepFunction(docSnap.data()['curentState']);
                                 
            }
            else {
                
              setActiveStepFunction("100");

            }
            setLoading(false);

        } catch (e) {
            swal({
                title: "  Error" + e,
                 
            })
            setLoading(false)
        }

    }
/////////// *******************************************************SEND DETAILS IN MAILS ****************


function setActiveStepFunction(_currentState){


    try{
        if(_currentState==="0" ){
           setActiveStep(0)
          }
           else if(_currentState==="01"  || _currentState==="01NV" || _currentState==="01V"){
            setActiveStep(1)
           }
          else if(_currentState==="012V" || _currentState==="012NV"){
            setActiveStep(2)
          }
          else if(_currentState==="0123V" || _currentState==="0123NV"){
            setActiveStep(3)
          }
          else if(_currentState==="012C"){
            setActiveStep(2)
          }

          else if(_currentState==="100"){
            setActiveStep(-1)
          }
 
 
 
    }
    catch(e){
        swal(e);
    }
}
////  *****************  CONVERT JSON FIELD TO ROW *****************************************//

function convertJsonFieldToRow(index,field ,value=""){

    const jsonData={index:index, field:field, detail:value};

    setExcelExportData((oldArray)=>[...oldArray, jsonData]);
    return "";
}

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

//****************************************** */
  

  /////////////////////////////ABOVE IS IMAGE ????????????????????????????????
  async function downloadFile(url,fileName){
    try{
      setLoading(true);
      fetch(url).then(response => {
        response.blob().then(blob => {
            const fileURL = window.URL.createObjectURL(blob);
            let alink = document.createElement('a');
            alink.href = fileURL;
            alink.download = fileName;
            alink.click();
            setLoading(false);
            swal("File Downloaded#")
        })
    })
  
  }
  catch(e){
    setLoading(false);
    swal("Error"+e);
  }
  finally{
  
  }
  
  }


 
 

 
//////////////////////////////&&&&&&&&&&&&&&&&&&&&9999&&&&&&&&&&&&&&&&&&

//////////%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function convertToString(value){
  let xyz="";
  if(!value){
    return ""
  }
  xyz=value;
  return  xyz;

}
return (
        <div className=' w-full h-full bg-slate-950 p-5'>
            <div className='   flex flex-row  m-2 text-center bg-slate-950'>
                <div className='h-10  z-10 flex'><img src={logo}  className='shadow-2xl rounded-full' alt='Image' /></div>
                <p className='text-sm   font-bold p-5 text-orange-400'>Gud Engineering Sevice</p>
                <p className='text-sm   font-normal p-5 text-orange-400'>Details of valutaion id  {id}</p>
                
            </div>
            <div>

            </div>
            <div>{
                 user &&  user.email
                }
                </div>
            {
              isLoading?
         
            <ModalLoader  showLoaderModal      setLoader={(val)=>{setShowLoaderModal(val)}}/>
            :
            <></>
            }
 
 
            <>


                <div ref={componentRef}  >
                  {isLoading?<></>:
                    <div className='text-black bg-white text-lg p-6 font-thin '>
                      <Stepper   
                       
  defaultColor="#D49801"

  completeBarColor="blue" 
  completeColor="blue"
  completeTitleColor="blue"

  activeTitleColor="green"
  activeColor="green"

  defaultTitleColor="#D49801"
  
  defaultBarColor="#D49801"

  circleFontColor="white"
 
  steps={  steps}  
  activeStep={activeStep}
  
  />
                        {
                        valuationObject && valuationObject!==undefined
                        ?
                             
                            <>
                                <div className='font-bold mt-5 p-5 text-sm mb-5'>
                                    <span>
                                    {
                                   valuationObject.clientOrcompanyName && valuationObject.clientOrcompanyName
                                    }
                                    </span>

                                    <span  className=' ml-3   font-normal text-green-500 border border-solid border-gray-400'>
                                        {
                                               valuationObject && valuationObject.curentState==="0123V"?
                                               "File Completed with book value and fmv value":
                                               valuationObject && valuationObject.curentState==="012C"?
                                               "File closed before book making":
                                               
                                               ""

                                        }

                                    </span>
                                    <span>

                                    
                                    {
                                        valuationObject &&   valuationObject.curentState==="01CNV" || valuationObject.curentState==="01NV"  || valuationObject.curentState==="012NV"  ||  valuationObject.curentState==="0123NV"
                                        ?
                                        <button  onClick={()=>{
                                            verifyValuationId();
                                             }} className =" text- pl-2 text-green-900 pr-2 m-auto  underline"><HiCheckCircle  size={"30px"} className='text-lg inline-block text-red-800' />Authorize</button>

                                           :
                                           <></>  
                                    }
                                   

                                    </span>



                                    <div class="grid grid-cols-2 border  p-5">
                                        <div className=''>
                                            <p className='text-sm font-bold underline'>Person Details</p>
                                            <div className=' text-xs space-x-2'>
                                                <p className='ml-2'> <div className='font-semibold mr-2 w-28 inline-block whitespace-nowrap overflow-hidden '> valuationFileNo : </div> <span className='font-normal'>  {valuationObject.valuationFileNo}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '> clientOrcompanyName : </div> <span className='font-normal'>  {valuationObject.clientOrcompanyName}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '> clientAddress :</div> <span className='font-normal'> {valuationObject.clientAddress}</span></p>
                                                <p className=''> <div className='font-semibold mr-2   w-28 inline-block whitespace-nowrap overflow-hidden '>clientPhone :</div> <span className='font-normal'>  {valuationObject.clientPhone}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '>ownerName:</div> <span className='font-normal'>  {valuationObject.ownerName}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '> ownerAddress :</div> <span className='font-normal'>  {valuationObject.ownerAddress}</span></p>
                                                <p className=''> <div className='font-semibold mr-2   w-28 inline-block whitespace-nowrap overflow-hidden '> ownerPhone : </div><span className='font-normal'>  {valuationObject.ownerPhone}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '>propertyType :</div> <span className='font-normal'>  {valuationObject.propertyType}</span></p>
                                                <p className=''> <div className='font-semibold mr-2   w-28 inline-block whitespace-nowrap overflow-hidden '>bankName :</div> <span className='font-normal'>  {valuationObject.bankName}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '>bankBranch :</div> <span className='font-normal'>  {valuationObject.bankBranch}</span></p>
                                                <p className=''> <div className='font-semibold mr-2   w-28 inline-block whitespace-nowrap overflow-hidden '>fieldchargeCost :</div> <span className='font-normal'>  {valuationObject.fieldchargeCost}</span></p>
                                                <p className=''> <div className='font-semibold mr-2   w-28 inline-block whitespace-nowrap overflow-hidden '>latlong :</div> <span className='font-normal'>  {valuationObject.latlong}</span></p>

                                            </div>
                                        </div>
 
                                       
                                        <div className='text-xs font-normal'>
                                            <p className='text-xs font-bold underline'>Other Details</p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> curentState :</div> <span className='font-normal'> {valuationObject.curentState && valuationObject.curentState}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> initSubmitDate:</div> <span className='font-normal'> {valuationObject.initSubmitDate && valuationObject.initSubmitDate}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> initmaker :</div> <span className='font-normal'> {valuationObject.initmaker && valuationObject.initmaker}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> initchecker : </div> <span className='font-normal'>{valuationObject.initchecker && valuationObject.initchecker}</span></p>
                                           
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="grid grid-cols-2 border  p-5">
                                        <div className=''>
                                            <p className='text-xs font-bold underline'>Two Page Making</p>
                                            <div className=' text-xs space-x-2'>
                                             <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> fmvValue : </div> <span className='font-normal'>{valuationObject.fmvValue &&valuationObject.fmvValue}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> twopageMaker :</div>  <span className='font-normal'> {valuationObject.twopageMaker && valuationObject.twopageMaker}</span></p>

                                     <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> twoPagegDate :</div>  <span className='font-normal'> {valuationObject.twoPageMakingDate &&  String( valuationObject.twoPageMakingDate)}</span></p>

                                               </div>
                                        </div>

                                   
                                        <div className='text-xs font-normal'>
                                            <p className='text-xs font-bold underline'>Completion</p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> bookDate :</span> <span className='font-normal'> {valuationObject.bookCloseDate}</span></p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'>amountofBill :</span> <span className='font-normal'> {valuationObject.amountofBill}</span></p>
                                            {/* <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> closeRemarks  :</span> <span className='font-normal'> {valuationObject.closeRemarks}</span></p> */}
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> bookMaker  :</span> <span className='font-normal'> {valuationObject.closeMaker}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> Remarks :</div>  <span className='font-normal   w-8 overflow-x-auto'> {valuationObject.twoPageRemarks && valuationObject.twoPageRemarks}</span></p>
                                        </div>
                                    </div>
                                </div>



                            </>
                            :
                            <>Not found</>


                        }
                    </div>

                      }

                </div>


        
    
    {/* ITS SHOWS THE FILE HERE STARTING IS HERE */}

<div className=' bg-white text-black mt-4 mb-4 w-full overflow-x-scroll '>
     
     <table className=' border font-normal text-sm   w-full'>
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
                valuationObject && valuationObject.files.map((object, index)=>{
                return (
                <>
                <tr key={index} className='border bg-slate-100 hover:bg-gray-600 hover:text-white cursor-pointer  '>
                <td className='border px-2 py-4'><span>{index+1}</span></td>
                <td  className='border px-2 py-4'><span>{object['fileType']}</span></td>
                <td  className='border px-2 py-1 font-semibold'><span>{object['fileName']}</span></td>
               
                  <td  className='border px-2 py-1'>
                  <div className='flex'>
                  <a href={object['fileUrl'] } target='_blank'>
                    <HiEye className=' ' size="20px" /></a>  
                  <button onClick={async()=>{ 
                   downloadFile(object['fileUrl'],object['fileName'])
                     //  const 
                      }}>
                  <AiOutlineVerticalAlignBottom  size="20px" /></button> 
                  </div> 
                  </td>
               </tr>

                </>)
                })
            }
             
          
  
        </tbody>
     </table>
        
</div>

{

 
}
  
            </> 

 
        </div>
    )
}
