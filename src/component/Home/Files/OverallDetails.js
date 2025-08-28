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
import { HiEye } from 'react-icons/hi';
import {HiViewGrid} from 'react-icons/hi'
import {AiFillFileExcel} from 'react-icons/ai';
import {AiOutlineMail} from 'react-icons/ai';
import {BsSearchHeart}  from 'react-icons/bs'
import Select from 'react-select';
import {AiOutlineVerticalAlignBottom} from 'react-icons/ai';

import {BsFiletypeDocx} from 'react-icons/bs';
import Modal from './Modal';
import FileSaver from 'file-saver';
import { Document, ImageRun, Packer, Paragraph , TextRun} from "docx";
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ModalLoader from './ModalLoader';
import { UserAuth } from '../../../context/AuthContext';

export default function OverallDetails() {

    const [isLoading, setLoading] = useState(false);
    const [referenceData, setReferenceData] = useState({});
    

    const [searchIdNo, setSearchIdNo]=useState("");
    const componentRef = useRef();
    const  imageToPrintRef = useRef();
    const [dbPhotosList, setDbPhotosList]=useState([]);
    const [dbFileList,setDbFileList]=useState([]);
    const [dbVehicleFileList,setDbVehicleFileList]=useState([]);
    const [dbThirdPartyList, setDbThirdPartyList]=useState([]);

    const [referenceObject, setReferenceObjecct] = useState();

    const [insuranceCompanysOption, setInsuranceCompanyOptions]= useState();

    const [openModal, setOpenModal]=useState(false);
   const [imageUrl, setImageUrl]=useState("");
   const [imageName, setImageName]=useState("");
   const [excelExportData, setExcelExportData]= useState([]);
   const [searchReferenceNo, setSearchReferenceNo]=useState("")
   const Excel = require('exceljs');
    const { user} = UserAuth()
   const myNavigate= useNavigate();

   
    const [showLoaderModal, setShowLoaderModal]= useState(false);
   
const { id } = useParams();
const location = useLocation();
const searchId = location.state?.id || id;

useEffect(() => {
  if (!searchId) {
    swal({
      title: "Error",
      text: "No Reference ID provided",
      icon: "error",
    });
    return; // exit early from effect
  }

  // Safe to call your functions
  getReferenceSuggestion();
  getReferenceIdDEtails();
  loadPhotosOfSurvey();
  getAllFIleDetail();
}, [searchId]); // inc
    



    //lets create the function to get all insurance company details

   async function getReferenceSuggestion(){

    try{
       const insRefs = collection(db, "referenceSuggestion");
      
         const querySnapshot= await    getDocs(insRefs);

         setInsuranceCompanyOptions([]);
 
            if (querySnapshot.docs.length >= 1) {      
                    querySnapshot.forEach((doc) => {

                    //check if the  insurance name is related to the 
              const referenceNo = doc.data()['referenceNo']  ;
              let _insurance="";
              _insurance=doc.data()['insurance']&& doc.data()['insurance'] ;          
              const object={ value: referenceNo, label: referenceNo,insurance:_insurance };
              
              setInsuranceCompanyOptions(prev => [...prev, object]);
              }
             );
         }
 
    
      
    }
    catch(e){
      swal("Error "+e)
    }

    }
///********************************** */
    const geneRatePDF = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User Data",
    });

//******************************************GET ALL INSURANCE COMPANY DETAILS ***************** */
 


//*********************** */


    ///@@@@@@@@@@@@@@@@@@@@@@@@@ -------------------PRINT------------------------@@@@@@@@@@@@@@@@@@@@@@@
    const columns = [
        { header: 'S N', key: 'index' },
        { header: 'Field', key: 'field' },
        { header:  'Detail',  key: 'detail' },
        
      ];

    const workSheetName = 'Worksheet-1';
    const workBookName = 'MyWorkBook';
    const myInputId = 'myInput';


    const workbook = new Excel.Workbook();
    //*************************** FUNCTION TO SAVE AS EXCEL ********************************** */
          const saveExcel = async () => {
            try {

              setLoading(true);
              const myInput = document.getElementById(myInputId);
              const fileName =      searchIdNo+ " Detail" // myInput.value || workBookName;
        
              // creating one worksheet in workbook
              const worksheet = workbook.addWorksheet(workSheetName);
       
              // add worksheet  columns
              // each columns contains header and its mapping key from data
              worksheet.columns = columns;
        
              // updated the font for first row.
              worksheet.getRow(1).font = { bold: true };
        
              // loop through all of the columns and set the alignment with width.
              worksheet.columns.forEach(column => {
                column.width = column.header.length + 20;
                column.alignment = { horizontal: 'left' };
              });
        
              // loop through data and add each one to worksheet
              excelExportData.forEach(singleData => {
                worksheet.addRow(singleData);
              });
        
              // loop through all of the rows and set the outline style.
               worksheet.eachRow({ includeEmpty: false }, row => {
                // store each cell to currentCell
                const currentCell = row._cells;
        
                // loop through currentCell to apply border only for the non-empty cell of excel
                currentCell.forEach(singleCell => {
                  // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
                  const cellAddress = singleCell._address;
        
                  // apply border
                  worksheet.getCell(cellAddress).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                  };
                });
              });
        
              // write the content using writeBuffer
              const buf = await workbook.xlsx.writeBuffer();
        
              // download the processed file
              saveAs(new Blob([buf]), `${fileName}.xlsx`);
              setLoading(false);
            } catch (error) {
              console.error('<<<ERRROR>>>', error);
              console.error('Something Went Wrong', error.message);
            } finally {
              // removing worksheet's instance to create new one
              workbook.removeWorksheet(workSheetName);
              setLoading(false);
            }
          };
    /// @@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //////////////////////////////////////////////////////////////////PHOTOS Loafing &&&&&&&&&&&&&&&&&&&&&&&&&&
    async function loadPhotosOfSurvey(){
        try{
              setLoading(true);

             setDbPhotosList([]);
           
             
            const fileQuery = query(collection(db, `reference/${searchId}/photos/`));
            const querySnapshot = await getDocs(fileQuery).catch((e)=>swal(e));
            let temDbFileArray = [];
            querySnapshot.forEach((doc) => {
            const newDocData = {
                docId: doc.id,
                fileName: doc.data()['fileName'],
                fileUrl: doc.data()['fileUrl'],
              }
              temDbFileArray.push(newDocData);
            });
            setDbPhotosList(temDbFileArray);     
          }
 
        catch(e){
            swal("error"+e)
        }
        finally{
            setLoading(false)
        }
    }
// ********************** LOAD PHOTOS OF SURVEY END ********************************//

// DOWNLOAD ALL THE PHOTOS AND FILE   .....................********

async function downloadphoto(url, name)
{
  //   https://firebasestorage.googleapis.com/v0/b/gudservices-c1836.appspot.com/o/surveyPhotos%2F2080-80-120%2F1%20(1).JPG?alt=media&token=c4169fc3-944c-4461-990e-bb7b64a8c910
   
  //FileSaver.saveAs("https://fastly.picsum.photos/id/360/200/300.jpg?hmac=Fl1CgUfxrFjmcS1trYDG80XpEjYixcXfc2uTtCxFkDw", "hello.jpg")
 
  FileSaver.saveAs("https://firebasestorage.googleapis.com/v0/b/gudservices-c1836.appspot.com/o/surveyPhotos%2F2080-80-120%2F1%20(1).JPG?alt=media&token=c4169fc3-944c-4461-990e-bb7b64a8c910","WHtas up")
 
  var storageRef = ref(storage, `/surveyPhotos/${searchIdNo}/${name}`);

 try{
  
  
    
    // Get the download URL
      getDownloadURL(storageRef)
      .then((url_url) => {
        FileSaver.saveAs("https://firebasestorage.googleapis.com/v0/b/gudservices-c1836.appspot.com/o/surveyPhotos%2F2080-80-120%2F1%20(1).JPG?alt=media&token=c4169fc3-944c-4461-990e-bb7b64a8c910", "name.jpg") 
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
                swal("Storage image not exist");
            break;
          case 'storage/unauthorized':
            swal("Unathorise");
            break;
          case 'storage/canceled':
            swal("Canceled");
            break;
     
    
          case 'storage/unknown':
              swal("Unknown errr")
            break;
        }
      });
 
 
   // Put your image url here.

    
     }
    catch(e){
        swal(e);
    }
}
////get alll 
function capitalizeFirstLetter(string) {
  if(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return "";
}

//DOWNLOAD ALL PHOTOS AND FILE END *******************************
    async function getReferenceIdDEtails() {
  
      setLoading(true);          
        let temp = [];
        try {
            const ref = doc(db, "reference", searchId);
            const docSnap = await getDoc(ref);
            setReferenceObjecct({})
            setExcelExportData([]);
            if (docSnap.exists()) {
           

                setReferenceObjecct(docSnap.data());
             
             
                 var index=1;
                 convertJsonFieldToRow(index,"Reference No", docSnap.data()['referenceNo']);
                         
                

                 convertJsonFieldToRow(index=index+1,"Insurance", docSnap.data()['insurance'] && capitalizeFirstLetter(docSnap.data()['insurance'])  );
 

                 convertJsonFieldToRow(index=index+1,"Insured",   docSnap.data()['insured'] && capitalizeFirstLetter(docSnap.data()['insured']));  
                 convertJsonFieldToRow(index=index+1, "Insured Customer Name",  docSnap.data()['insuredCustName']&& capitalizeFirstLetter(docSnap.data()['insuredCustName']));  
              

                  ;

                 convertJsonFieldToRow(index=index+1, "Vehicle No", docSnap.data()['vehicleNo']);  
                 
               
                 convertJsonFieldToRow(index=index+1, "Policy No", docSnap.data()['policyNo']);
                 

                 convertJsonFieldToRow(index=index+1, "Claim Type", docSnap.data()['claimType']);
              
                 convertJsonFieldToRow(index=index+1, "Claim No", docSnap.data()['claimNo']);
               

                 convertJsonFieldToRow(index=index+1, "Surveyor", docSnap.data()['surveyor']); 
              
                 convertJsonFieldToRow(index=index+1, "Place Of Survey", docSnap.data()['placeofSurvey']);  
                 convertJsonFieldToRow(index=index+1, "Representative Name", docSnap.data()['representativeName']); 
                 convertJsonFieldToRow(index=index+1, "Representative Contact", docSnap.data()['representativeContact']);  
                 convertJsonFieldToRow(index=index+1, "Loss To", docSnap.data()['lossTo']);  
                 
                 convertJsonFieldToRow(index=index+1, "Estimation", docSnap.data()['estimation']);  
                
                 convertJsonFieldToRow(index=index+1, "Expected Fee", docSnap.data()['expectedFee']);  
                 convertJsonFieldToRow(index=index+1, "Actual Fee Paid", docSnap.data()['actualFeePaid']); 
                 convertJsonFieldToRow(index=index+1, "Date Remarks", docSnap.data()['dateRemarks']);   
               
                 convertJsonFieldToRow(index=index+1, "File Intro Date", docSnap.data()['fileIntroDate']);
                 
                 convertJsonFieldToRow(index=index+1, "Date of Loss", docSnap.data()['incidentDate']);  
                 convertJsonFieldToRow(index=index+1, "File Receipt Date", docSnap.data()['fileReceiptDate']);  
                 convertJsonFieldToRow(index=index+1, "File Submit Date", docSnap.data()['fileSubmitDate']);  
                 convertJsonFieldToRow(index=index+1, "First Survey Date", docSnap.data()['firstSurveyDate']);  
                 convertJsonFieldToRow(index=index+1, "Second Survey Date", docSnap.data()['secondSurveyDate']);  
                 convertJsonFieldToRow(index=index+1, "Third Survey Date", docSnap.data()['thirdSurveyDate']);  
              
                 convertJsonFieldToRow(index=index+1, "After Complete SUrvey", docSnap.data()['afterCompleteSUrvey']);    
                                 
            }
            else {

            }
            setLoading(false);

        } catch (e) {
          console.log(e)
            swal({
                title: "  Error" + e,
                 
            })
            setLoading(false)
        }

    }
/////////// *******************************************************SEND DETAILS IN MAILS ****************

 

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

 

//********************************** */

async function getAllFIleDetail(){
    try{
 /// first of get all files details
 const fileQuery = query(collection(db, `otherfiles/${searchId}/fileDetails/`));
 const querySnapshot = await getDocs(fileQuery);
 let temDbFileArray = [];
 querySnapshot.forEach((doc) => {
  //first of all check the user role
  //skip the file if ... userrole is admin
  let nextIterationValue="donot-skip";
 
 const newDocData = {
     docId: doc.id,
     fileName: doc.data()['fileName'],
     fileType: doc.data()['fileType'],
     fileUrl: doc.data()['fileUrl'],
   }

   if(doc.data()['fileType']==="FinalAdminReport" && user.role!=='admin'){
    //skip 
    return  true;
    }

   temDbFileArray.push(newDocData);
 });
 setDbFileList(temDbFileArray);
 //at second place load all files from vehicle and insured vehicle details
 const vehicleQuery = query(collection(db, `vehicleExtra/${searchId}/fileDetails/`));
 const _querySnapshot = await getDocs(vehicleQuery);
 let _temDbFileArray = [];
 _querySnapshot.forEach((doc) => {
   // doc.data() is never undefined for query doc snapshots

   const newDocData = {
     docId: doc.id,
     pdfFileName: doc.data()['pdfFileName'],
     pdfType: doc.data()['pdfType'],
     pdfUrl: doc.data()['pdfUrl'],
   }
   _temDbFileArray.push(newDocData);
 }
)
setDbVehicleFileList(_temDbFileArray)

///AT third pick data from insured Third party vehicle details

const vehicleQuery_ = query(collection(db, `OuterVehicleExtra/${searchId}/fileDetails/`));
const querySnapshot_ = await getDocs(vehicleQuery_);
let temDbFileArray_ = [];
querySnapshot_.forEach((doc) => {

  const newDocData = {
    docId: doc.id,
    pdfFileName: doc.data()['pdfFileName'],
    pdfType: doc.data()['pdfType'],
    pdfUrl: doc.data()['pdfUrl'],
  }
  temDbFileArray_.push(newDocData);
});
setDbThirdPartyList(temDbFileArray_);
//after that place into grouped table
    }

    catch(e)
    {
        swal("Error" +e);
    }
}

function createHeader(){
 return new Paragraph({
  children: [
    new TextRun({
     
      text: "Reference Detail",
      bold: true,
      color:"453648",
      size: "16pt",
      scale:200,
      style: "wellSpaced",
      font: {
        name: "Times New Roman",
    },
    }),
  ]
})
}

////#####################################  FUNCTION TO FOR REACT DOCS ############################
function createRowInDocs(index="", title="", value=""){

  return new Paragraph({
    children: [
        new TextRun({
          text: index,
          bold: false,
          color:"000000",
          size: "12pt",
           
          style: "wellSpaced",
          font: {
            name: "Mangal",
        },
        }),

        new TextRun({
            text: title,
            bold: true,
            color:"453648",
            size: "12pt",
            
            style: "aside",
            font: {
              name: "Mangal",
          },
        }),

        new TextRun({
            text:  value,
            bold: false,
            font: {
              name: "Bahnschrift Condensed",
          },
            size:"13pt",
            style: "aside"
        }),
    ],
})
} 
async function generateFromUrl() {
 
  ///////////////////////////////////////////////BELOW IS IMAGE 
 
  setLoading(true);
  let blobArray= [ ];
  try{
   ////
   let objectFileUrl="";
   let myBlob;
   let photosArray=[
   ];
  
   for(let i=0; i<dbPhotosList.length;i++ ){
        photosArray.push(dbPhotosList[i]['fileUrl'])
   }
  //  dbPhotosList && dbPhotosList.map((object, index)=>{
  //          objectFileUrl= object['fileUrl'];
  //          photosArray.push(objectFileUrl);
  //  }
      
  //    ); 
       
      blobArray=[];

     for(let i=0; i<photosArray.length;i++){
     const x= await fetch(
        photosArray[i]
      );
      const xyz=await x.blob();
      blobArray.push(

        new ImageRun({
          data: xyz,
          transformation: {
            width: 200,
            height: 150
          }
        })
      );
     }
  ///////////////////////////////////////////////////////////////////////////////////////BELOW IS TEXT ???
  
  let index=1;
    const doc = new Document({
      sections: [
        {
          children: [

        createHeader(),
         createRowInDocs(index=index+1, "Reference No :  ",  referenceObject && referenceObject.referenceNo),
         createRowInDocs(index=index+1, "Insurance : ",  referenceObject && referenceObject.insurance),
         createRowInDocs(index=index+1, "Insured : ",  referenceObject && referenceObject.insured),
         createRowInDocs(index=index+1, "Insured Customer Name :  ",  referenceObject && referenceObject.insuredCustName),
         createRowInDocs(index=index+1, "Vehicle No :  ",  referenceObject && referenceObject.vehicleNo),
         createRowInDocs(index=index+1, "Policy No :  ",  referenceObject && referenceObject.policyNo),
         createRowInDocs(index=index+1, "Claim Type :  ",  referenceObject && referenceObject.claimType),
         createRowInDocs(index=index+1, "Claim No :  ",  referenceObject && referenceObject.claimNo),
         createRowInDocs(index=index+1, "Surveyor :  ", referenceObject && referenceObject.surveyor  ),
         createRowInDocs(index=index+1, "Place Of Survey :  ",  referenceObject && referenceObject.placeofSurvey),
         createRowInDocs(index=index+1, "Representative Name :  ",  referenceObject && referenceObject.representativeName),
         createRowInDocs(index=index+1, "Rep. Contact : ",referenceObject && referenceObject.representativeContact),
         createRowInDocs(index=index+1, "Loss To :  ",  referenceObject && referenceObject.lossTo),
         createRowInDocs(index=index+1, "Estimation :  ", "" +convertToString(referenceObject && referenceObject.estimation) ),
         createRowInDocs(" ", "  ", ""),
         createRowInDocs(index=index+1, "Expected Survey Fee :  ", ""+ convertToString(referenceObject && referenceObject.expectedFee)),
         createRowInDocs(index=index+1, "Actual Survey Fee Paid : ",""+  convertToString( referenceObject && referenceObject.actualFeePaid)),
         createRowInDocs(index=index+1, "Date Remarks : ",  referenceObject && referenceObject.dateRemarks),
         createRowInDocs(" ", "  ", ""),
         createRowInDocs(index=index+1, "File Introduction Date : ",  referenceObject && referenceObject.fileIntroDate) ,
         createRowInDocs(index=index+1, "Date of Loss : ",  referenceObject && referenceObject.incidentDate)      ,
         createRowInDocs(index=index+1, "File Receipt Date :  ",  referenceObject && referenceObject.fileReceiptDate)      ,
         createRowInDocs(index=index+1, "File Submit Date :  ",  referenceObject && referenceObject.fileSubmitDate)      ,
          createRowInDocs(index=index+1, "First Survey Date :  ",  referenceObject && referenceObject.firstSurveyDate)  ,    ,
          createRowInDocs(index=index+1, "Second Survey Date :  ",  referenceObject.secondSurveyDate && referenceObject.secondSurveyDate)  , 
           createRowInDocs(index=index+1, "Third Survey Date :  ",  referenceObject.thirdSurveyDate && referenceObject.thirdSurveyDate)  , 
          createRowInDocs(index=index+1, "After Complete Survey :  ",  referenceObject.afterCompleteSUrvey && referenceObject.afterCompleteSUrvey)  , 
            
          createRowInDocs(" ", "  ", ""),
          createRowInDocs(" ", "  ", ""),
          new Paragraph({
              children: blobArray
            })
          ]
        }
      ]
    });

  /////////////////////////////ABOVE IS IMAGE ????????????????????????????????

  let jsonDataArray=[];
  jsonDataArray.push();
    Packer.toBlob(doc).then(blob => {  
      saveAs(blob, searchId +" "+".docx");
       swal("Document created successfully");
    });
}
catch(e){
  swal("Error"+e)
}
finally{
  setLoading(false)
}
}


function handleRoute(val){
  try{

   //check the insured one...

if(user && user.role==='insurance'){
  
let _objectsLength=insuranceCompanysOption.length;
  //checkt the value exist on the 
   let unAuthoriseAccess=false;
  for(let i=0;i<_objectsLength;i++ ){

   //  console.log("object", insuranceCompanysOption[i]);
    //console.log("##", insuranceCompanysOption[i].value +"/"+insuranceCompanysOption[i].insurance)
   
    if(insuranceCompanysOption[i].insurance===user.insurance &&
       insuranceCompanysOption[i].value===insuranceCompanysOption[i].value){
            unAuthoriseAccess=true;
        //go foread abd 
        break;
       }
       else{
        //unauthorise access 
        unAuthoriseAccess=false
       }
  }

  if(!unAuthoriseAccess){
    swal("Warning !!!", "Unauthorize access, Bad Company Selected.", "error");
    return;
  }
  ///check the current selected reference number belong to current
}
 

   // myNavigate(`/home/view/${searchIdNo}`);
    myNavigate(`/home/view/${val}`,{state:{id:val}});
    searchId=val;
  
    getReferenceIdDEtails();
    getAllFIleDetail();
    loadPhotosOfSurvey();
    
    //  setDbPhotosList([]);
    // setDbVehicleFileList([]);
    // setReferenceData([])
    // setReferenceObjecct([]);
  }
  catch(e){
    swal("error"+e);
  }
}


////######################################## FUNCTION FOR REACT DOCS END ##########################
 
/////////////////////////////$$$$$$$$$$$$$$$$$$$$$$$$$$ DOWNLOAD FILE $$$$$$$$$$$$$$$$$
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
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-200 text-black p-4 rounded-xl shadow-lg m-2 gap-4">
  {/* Logo */}
  <div className="flex items-center h-12">
    <img src={logo} alt="Logo" className="h-12 w-12 rounded-full shadow-2xl" />
  </div>

  {/* Titles */}
  <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
    <p className="text-sm font-bold text-black">Gud Engineering Service</p>
    <p className="text-sm font-normal text-black">Details of {id}</p>
  </div>

  {/* Conditional Select */}
  {user?.role !== "insurance" && (
    <Select
      className="w-full sm:w-96 max-w-full text-black font-normal text-sm"
      options={insuranceCompanysOption}
      placeholder="Search Reference No"
      defaultSelectValue="Select Reference"
      isSearchable
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          console.log("Entered... clicked.....");
        }
      }}
      onChange={async (e) => {
        setSearchReferenceNo(e.value);
        handleRoute(e.value);
      }}
    />
  )}
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
                    <div className='text-black bg-white text-lg p-11 font-thin '>
                      
                        {
                            referenceObject &&
                            <>
                                <div className='font-bold mt-5 p-5 text-sm mb-5'>
                                    {
                                        referenceObject.insurance && referenceObject.insurance
                                    }


                                    <div class="grid grid-cols-2 border  p-5">
                                        <div className=''>
                                            <p className='text-sm font-bold underline'>File Details</p>
                                            <div className=' text-xs space-x-2'>
                                                <p className='ml-2'> <div className='font-semibold mr-2 w-28 inline-block whitespace-nowrap overflow-hidden '> Reference No : </div> <span className='font-normal'>  {referenceObject.referenceNo}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '> Insured Name : </div> <span className='font-normal'>  {referenceObject.insuredCustName}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '> Insured :</div> <span className='font-normal'> {referenceObject.insured&&capitalizeFirstLetter(referenceObject.insured)}</span></p>
                                                <p className=''> <div className='font-semibold mr-2   w-28 inline-block whitespace-nowrap overflow-hidden '>Claim Type :</div> <span className='font-normal'>  {referenceObject.claimType}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '>Policy No :</div> <span className='font-normal'>  {referenceObject.policyNo}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '> Claim No :</div> <span className='font-normal'>  {referenceObject.claimNo}</span></p>
                                                <p className=''> <div className='font-semibold mr-2   w-28 inline-block whitespace-nowrap overflow-hidden '> Vehicle No : </div><span className='font-normal'>  {referenceObject.vehicleNo}</span></p>
                                                <p className=''> <div className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden '>Insured Rep. :</div> <span className='font-normal'>  {referenceObject.representativeName}</span></p>
                                                <p className=''> <div className='font-semibold mr-2   w-28 inline-block whitespace-nowrap overflow-hidden '>Rep Contact :</div> <span className='font-normal'>  {referenceObject.representativeContact}</span></p>
                                            </div>
                                        </div>
                                        <div className='text-xs font-normal'>
                                            <p className='text-xs font-bold underline'>Survey Details</p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> 1st Survey Date :</div> <span className='font-normal'> {referenceObject.firstSurveyDate && referenceObject.firstSurveyDate}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> 2nd Survey Date  :</div> <span className='font-normal'> {referenceObject.secondSurveyDate && referenceObject.secondSurveyDate}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> 3rd Survey Date : </div> <span className='font-normal'> {referenceObject.thirdSurveyDate && referenceObject.thirdSurveyDate}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> Last Survey Date:</div> <span className='font-normal'> {referenceObject.afterCompleteSUrvey && referenceObject.afterCompleteSUrvey}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> Place of Survey :</div> <span className='font-normal'> {referenceObject.placeofSurvey && referenceObject.placeofSurvey}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> Estimation : </div> <span className='font-normal'>{referenceObject.estimation && referenceObject.estimation}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> Surveyor : </div> <span className='font-normal'>{referenceObject.surveyor && referenceObject.surveyor}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> Loss to : </div> <span className='font-normal'>{referenceObject.lossTo && referenceObject.lossTo}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> Remarks :</div>  <span className='font-normal'> {referenceObject.dateRemarks && referenceObject.dateRemarks}</span></p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="grid grid-cols-2 border  p-5">
                                        <div className=''>
                                            <p className='text-xs font-bold underline'>Fee Details</p>
                                            <div className=' text-xs space-x-2'>
                                                <p className='ml-2'> <span className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden'>Exp. Survey Fee : </span> <span className='font-normal'>  {referenceObject && referenceObject.expectedFee}</span></p>
                                                <p className=''> <span className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden'>Act. Survey Fee  : </span> <span className='font-normal'>  {referenceObject.actualFeePaid && referenceObject.actualFeePaid}</span></p>
                                                <p className=''> <span className='font-semibold mr-2  w-28 inline-block whitespace-nowrap overflow-hidden'>Fee Rec. Date   :</span> <span className='font-normal'> {referenceObject.feeReceiptDate && referenceObject.feeReceiptDate}</span></p>
                                            </div>
                                        </div>
                                        <div className='text-xs font-normal'>
                                            <p className='text-xs font-bold underline'>Date</p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> File Introduction Date :</span> <span className='font-normal'> {referenceObject.fileIntroDate && referenceObject.fileIntroDate}</span></p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> File Receipt Date :</span> <span className='font-normal'> {referenceObject.fileReceiptDate && referenceObject.fileReceiptDate}</span></p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> File Submit Date  :</span> <span className='font-normal'> {referenceObject.fileSubmitDate && referenceObject.fileSubmitDate}</span></p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> Date of Loss :</span> <span className='font-normal'> {referenceObject.incidentDate && referenceObject.incidentDate}</span></p>

                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> Photo url  : </span>

                                            </p>
                                        </div>
                                    </div>
                                </div>



                            </>


                        }
                    </div>

                      }

                </div>


                <div  >
                    {
                        isLoading?
                        <></>:
                   <div className='flex text-center align-center space-x-2     flex-shrink-0  p-2     '>    
                  
                    <div className=' bg-green  p-2 rounded-lg box-border  cursor-pointer  hover:bg-green-600 hover:text-red-100'>
                    <button className='   text-orange rounded-xl shadow-black ' onClick={geneRatePDF}>
                    <><AiFillPrinter className=' text-3xl bg-green-600' /> </>  
                   
                    </button>
                   
                    </div>


                    <></>

                    <div  onClick= { ()=>{ saveExcel()}} className='bg-green-950 p-2 rounded-lg box-border  cursor-pointer  hover:bg-green-600 hover:text-red-100'>
                    <button className='   text-white rounded-xl shadow-black ' >
                       <><AiFillFileExcel className=' text-3xl bg-green-600' /> </>  
                    </button>
                  
                    </div>

                    <div className='bg-green-950 p-2 rounded-lg box-border  cursor-pointer  hover:bg-green-600 hover:text-red-100'>
                       <button className='   text-white rounded-xl shadow-black ' onClick={()=>{generateFromUrl();}}>
                       <><BsFiletypeDocx className=' text-3xl bg-green-600' /> </>  
                   
                       </button>
                    
                    </div>

 
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
                dbFileList && dbFileList.map((object, index)=>{
                return (
                <>
                <tr className='border bg-slate-100 hover:bg-gray-600 hover:text-white cursor-pointer  '>
                <td className='border px-2 py-4'><span>{index+1}</span></td>
                <td  className='border px-2 py-4'><span>{object['fileName']}</span></td>
                <td  className='border px-2 py-1 font-semibold'><span>{object['fileType']}</span></td>
               
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
             <tr  className='  py-5' ><td colSpan="4" className=' py-3 font-bold  bg-slate-50'>Vehicle Details</td></tr>
             {
                dbVehicleFileList && dbVehicleFileList.map((object, index)=>{
                return (<>
                <tr className='border   hover:bg-slate-900 bg-slate-50  cursor-pointer hover:text-white '>
                <td className='border px-2 py-3'><span>{index+1}</span></td>
                <td  className='border px-2 py-1'><span>{object['pdfFileName']}</span></td>
                <td  className='border px-2 py-1  font-semibold'><span>{object['pdfType']}</span></td>
                <td  className='border px-2 py-1'>
                <div className='flex'>
                  <a href={object['pdfUrl'] } target='_blank'>
                    <HiEye className=' ' size="20px" /> </a>  
                  <button onClick={async()=>{ 
                   downloadFile(object['pdfUrl'],object['pdfFileName'])
                     //  const 
                      }}>
                  <AiOutlineVerticalAlignBottom  size="20px" /></button> 
                  </div> 
                </td> 
               </tr>

                </>)
                })
            }
           <tr  className='bg-slate-100 py-5 ' ><td colSpan="4" className='  py-3 font-bold'>Third party vehicle details</td></tr>
         {
                dbThirdPartyList && dbThirdPartyList.map((object, index)=>{
                return (<>
                <tr className='border bg-slate-100 hover:bg-slate-900 cursor-pointer hover:text-white '>
                <td className='border px-2 py-3'><span>{index+1}</span></td>
                <td  className='border px-2 py-1'><span>{object['pdfFileName']}</span></td>
                <td  className='border px-2 py-1  font-semibold'><span>{object['pdfType']}</span></td>
 
           
                <td  className='border px-2 py-1'>
                  <div className='flex'>
                  <a href={object['pdfUrl'] } target='_blank'>
                    <HiEye className=' ' size="20px" /></a>  
                  <button onClick={async()=>{ 
                  downloadFile(object['pdfUrl'],object['pdfFileName'])
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


{/* END OF THE FILE IS  SHowing */}

                {/* *********************** DISPLAY IMAGE HERE START ************************ */}
 <button onClick={()=>{}}></button>
 <div className='flex space-x-0  flex-wrap shadow-lg p-2'>
    {
         dbPhotosList  && dbPhotosList.length <1?
         <h1 className='p-1 font-serif rounded-lg shadow-2xl bg-gray-800'>  Images  </h1>:
         
             
            
                 <>
                 <ul className='flex gap-2  flex-wrap   justify-center content-center '>
                  
 
                        {
                       dbPhotosList.map((object, index)=>{
                          
           
                                return (
                                    <li className=' flex-grow h-96 sm:w-full lg:w-96 overflow-hidden relative '>
                                              
                                      <img 

                                       onClick={
                                         
                                        ()=>{ setOpenModal(true)
                                          setImageUrl(object["fileUrl"]);
                                          setImageName(object['fileName'])
                                        }} className='  h-full hover:opacity-30 max-w-xl  hover: transform-gpu hover:scale-150  duration-500 ease-linear shadow-[0_50px_25px_-24px_rgb(0,0,0,0.3)]  w-full border-4    border-slate-600 rounded-lg   object-cover object-right-bottom '  
                                        src={object['fileUrl']} alt="alt tag" />
                                       <div className=' absolute  top-0  text-3xl p-1  overflow-clip bg-orange-500 opacity-70'> 
                                        <h4 className=' max-w-md whitespace-nowrap overflow-clip'>{object['fileName']}</h4></div> 
                                      </li>
                                     );

                             })
                        }
              
                    
                 </ul>
                </>
            //    <div className='mt-0  border border-neutral-700  flex justify-center'>
            //    <div   onClick={()=>{
            //     downloadphoto(object['fileUrl'],object['fileName'])}}  className='' >
            //    <img
            //     src={object["fileUrl"]}
            //     className=" rounded  bg-white p-1   dark:bg-neutral-800"
            //     alt="..." />
            //    </div>
            //    {/* <h3 className='text-2xl w-80 overflow-clip '> <span className=' text-white'>{object['fileName']}</span></h3> */} 
            //    </div>
         
       
    }
</div>
{/* <div className="h-8 text-gray-100 w-11/12 p-2 ">
<span className="text-xs text-gray-600">{user.name +'/'+user.email+'/'+user.role+'/'+user.insurance}</span>
 </div>    */}

<>
 <Modal
 referenceNo={id}
 imageUrl={imageUrl}
 imageName={imageName}
 close={()=>{
    setOpenModal(false)}
    } open={openModal}/>
</>     

                {/* ************************* SHOW IMAGE HERE END ************************** */}

                <div className=' inline text-center space-x-3 justify-center'>
                    {
                        referenceObject && referenceObject.pdfUrl === undefined ? <div>
                            No Photos From Old library
                        </div> :
                            <div>
                                {
                                    referenceObject && referenceObject.pdfUrl.map((ex, index) => {
                                        return <div key={index}><img src={ex} className=' border   w-1/2 h-1/2 mt-6 text-sky' alt="image" />{ex}</div>
                                    })
                                }
                            </div>


                    }
                </div>
            </> 

 
        </div>
    )
}
