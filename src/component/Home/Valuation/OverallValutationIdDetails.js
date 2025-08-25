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
 
import ModalLoader from '../Files/ModalLoader';
import { UserAuth } from '../../../context/AuthContext';

export default function OverallValutationIdDetails() {

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

    const [valuationObject, setValuationObject] = useState();

    const [insuranceCompanysOption, setInsuranceCompanyOptions]= useState();

    const [openModal, setOpenModal]=useState(false);
   const [imageUrl, setImageUrl]=useState("");
   const [imageName, setImageName]=useState("");
   const [excelExportData, setExcelExportData]= useState([]);
   const [searchReferenceNo, setSearchReferenceNo]=useState("")
   const Excel = require('exceljs');
    const { user} = UserAuth()
   const myNavigate= useNavigate();

   const location = useLocation();
    const [showLoaderModal, setShowLoaderModal]= useState(false);
   const { id } =  useParams();
 

var searchId =  "";

 location.state!==null?
  searchId=location.state.id:
  searchId=id;
 
    
    
    useEffect(() => {
     // location.state.id;
  
     //getReferenceSuggestion();
     getReferenceIdDEtails();
    //  loadPhotosOfSurvey();
    //  getAllFIleDetail();
    

    }, []);

    



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
            const ref = doc(db, "valuation", searchId);
            const docSnap = await getDoc(ref);
            setValuationObject({});
            setExcelExportData([]);
            if (docSnap.exists()) {
            
                setValuationObject(docSnap.data());
                console.log("/////");
                console.log(docSnap.data());
             
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
                 
                 convertJsonFieldToRow(index=index+1, "maker", docSnap.data()['maker']);  
                
                 convertJsonFieldToRow(index=index+1, "checker", docSnap.data()['checker']);  
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
                                 
            }
            else {

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


function sentRefDetailInMail(){
  try{
   
  }
  catch(e){
    swal("Error : "+ e)
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
            <div className='   flex flex-row  m-2 text-center bg-slate-950'>
                <div className='h-10  z-10 flex'><img src={logo}  className='shadow-2xl rounded-full' alt='Image' /></div>
                <p className='text-sm   font-bold p-5 text-orange-400'>Gud Engineering Sevice</p>
                <p className='text-sm   font-normal p-5 text-orange-400'>Details of valutaion id {id}</p>
                 {user && user.role==='insurance'?<></>: <Select  className='w-96 max-w-full text-black font-normal text-sm'
                                options={insuranceCompanysOption}
                                placeholder="Search Reference No"
                                defaultSelectValue="Select Reference"
                                isSearchable
 
                                onKeyDown={(event)=>{
                                    if(event.key==="Enter"){
                                      console.log("Entered... clicked.....");
                                    }

                                }}
                                
                                onChange={async(e)=>{
                                 setSearchReferenceNo(e.value);
                                    handleRoute(e.value);
                                }} />

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
                    <div className='text-black bg-white text-lg p-11 font-thin '>
                      
                        {
                            valuationObject &&
                            <>
                                <div className='font-bold mt-5 p-5 text-sm mb-5'>
                                    {
                                       valuationObject.clientOrcompanyName && valuationObject.clientOrcompanyName
                                    }


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
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> maker  :</div> <span className='font-normal'> {valuationObject.maker && valuationObject.maker}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> checker : </div> <span className='font-normal'> {valuationObject.checker && valuationObject.checker}</span></p>
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
                                             <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> twoPageDate : </div> <span className='font-normal'>{valuationObject.twoPageMakingDate && valuationObject.twoPageMakingDate}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> fmvValue : </div> <span className='font-normal'>{valuationObject.fmvValue &&valuationObject.fmvValue}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> twopageMaker :</div>  <span className='font-normal'> {valuationObject.twopageMaker && valuationObject.twopageMaker}</span></p>
                                            <p><div className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden '> twoPageRemarks :</div>  <span className='font-normal'> {valuationObject.twoPageRemarks && valuationObject.twoPageRemarks}</span></p>
  
                                            </div>
                                        </div>

                                   
                                        <div className='text-xs font-normal'>
                                            <p className='text-xs font-bold underline'>Completion</p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> bookCloseDate :</span> <span className='font-normal'> {valuationObject.bookCloseDate}</span></p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'>amountofBill :</span> <span className='font-normal'> {valuationObject.amountofBill}</span></p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> closeRemarks  :</span> <span className='font-normal'> {valuationObject.closeRemarks}</span></p>
                                            <p><span className='font-semibold mr-2  w-32 inline-block whitespace-nowrap overflow-hidden'> closeMaker  :</span> <span className='font-normal'> {valuationObject.closeMaker}</span></p>
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
                   <div className='flex text-center align-center space-x-2   bg-slate-950 flex-shrink-0  p-2     '>    
                  
                    <div className='bg-green-950 p-2 rounded-lg box-border  cursor-pointer  hover:bg-green-600 hover:text-red-100'>
                    <button className='   text-white rounded-xl shadow-black ' onClick={geneRatePDF}>
                    <><AiFillPrinter className=' text-3xl' /> </>  
                   
                    </button>
                   
                    </div>


                    <></>

                    <div  onClick= { ()=>{ saveExcel()}} className='bg-green-950 p-2 rounded-lg box-border  cursor-pointer  hover:bg-green-600 hover:text-red-100'>
                    <button className='   text-white rounded-xl shadow-black ' >
                       <><AiFillFileExcel className=' text-3xl' /> </>  
                     
                    </button>
                  
                    </div>

                    <div className='bg-green-950 p-2 rounded-lg box-border  cursor-pointer  hover:bg-green-600 hover:text-red-100'>
                       <button className='   text-white rounded-xl shadow-black ' onClick={()=>{generateFromUrl();}}>
                       <><BsFiletypeDocx className=' text-3xl' /> </>  
                   
                       </button>
                    
                    </div>

{/* 
                    <div className='bg-green-950 p-2 rounded-lg box-border  cursor-pointer  hover: hover:bg-green-600  hover:text-red-100'>
                       <button className='   text-white rounded-xl shadow-black '
                        onClick={()=>{alert("Update soon...")}}>
                       <><AiOutlineMail className=' text-3xl' /> </>  
                    
                       </button>
                  
                    </div> */}

                     {/* <div>
                     <a href="mailto:manish@simplygraphix.com?subject=Feedback for 
webdevelopersnotes.com&body=The Tips and Tricks section is great
&cc=anotheremailaddress@anotherdomain.com
&bcc=onemore@anotherdomain.com">Send me an emscxzcacdail</a>
                      </div> */}
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
                <tr className='border bg-slate-100 hover:bg-gray-600 hover:text-white cursor-pointer  '>
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
