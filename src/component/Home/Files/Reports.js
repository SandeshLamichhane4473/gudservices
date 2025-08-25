import { useEffect } from "react";
import swal from "sweetalert";
import { useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
 import { db } from "../../../firebase/Firebase";
import { saveAs } from 'file-saver';
import { HiDownload, HiMinusCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { HiBan } from "react-icons/hi";
import { HiCheckCircle } from "react-icons/hi";
import { UserAuth } from "../../../context/AuthContext";



const ExcelJS = require('exceljs');
const Excel = require('exceljs');

export default function Reports() {
   const myNavigate=useNavigate();

   const [insuranceName, setAllInsuranceName] = useState([]);
   const [referenceDetails, setReferenceDetails]=useState([]);
   const [referenceDetailsOriginal, setReferenceDetailsOriginal]=useState([]);
   const [useAllExportData, setUseAllExportData]=useState([]);
   const [useSelectedInsuranceComoany,setUserSelectedInsuranceCompany]=useState("");
   const [useCurrentRadioButtonValue, setUserCurrentRadioButtonValue]=useState("all");
   const { user, logout, userRole, setUserData } = UserAuth()
   useEffect(()=>{
     getALlInsuranceName();
   },[]);

 

 
      
   
   const columns = [
    { header: 'S N', key: 'index' },
    { header: 'Reference No', key: 'referenceNo' },
    { header: 'Vehicle No', key: 'vehicleNo' },
    { header: 'Insured', key: 'insured' },
    { header: 'Policy No', key: 'policyNo' },
    { header: 'Date of Loss', key: 'incidentDate' },
    { header: 'File Receipt Date', key: 'fileIntroDate' },
    { header: 'File Submit Date', key: 'fileSubmitDate' },
    
    { header: 'Survey Date', key: 'surveyDate' },
    { header: 'Place of Survey', key: 'placeofSurvey' },

    { header: 'Representative Contact', key: 'representativeContact' },
  
    { header: 'Loss To', key: 'lossTo' },
    { header: 'Expected Fee', key: 'expectedFee' },
    { header: 'Actual Fee Paid', key: 'actualFeePaid' },
    { header: 'Date Remarks', key: 'dateRemarks' },
    { header: 'Reason For Pending Made', key: 'reasonForPending' }
  ];
 
const workSheetName = 'Worksheet-1';
const workBookName = 'MyWorkBook';
const myInputId = 'myInput';
const myData = {
  name: 'Some thing',
  price: 123
}


  async function getALlInsuranceName() {
           
            try {
                const insRefs = collection(db, "insurance")
                const querySnapshot = await getDocs(insRefs);
                if (querySnapshot.docs.length < 1) {
                    setAllInsuranceName([])
                } else {
                    setAllInsuranceName([])
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        setAllInsuranceName(prev => [...prev, docData])
                    });
                }
            
            } catch (e) {
                swal({
                    title: "Unable to fecth users from database" + e,
                    timer: 3000
                })
                
            }
     
    //    workbookx.xlsx.writeBuffer().then((buffer)=>{
    //     const blob= new Blob([buffer],{
    //         type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //     }
    //     )

    //     SVGAnimatedPreserveAspectRatio()
    }

    //**************** FUNCTION TO get all INSURANCE NAME************ */
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }


    //////////////////////////////
    async function getDetailsOfCompany(insName){

      try{
         
        const refReference = collection(db, "reference");
        const q = query(refReference, where("insurance", "==", insName));
        const querySnapshot = await getDocs(q);  
        let i=0;;
        let temDbFileArray = [];
        querySnapshot.forEach((doc) => {
    
                i++;
              const jsonData={
                index:i,
                referenceNo:doc.data()['referenceNo'],
                vehicleNo:doc.data()['vehicleNo'],
                insured:doc.data()['insuredCustName'] !==null?capitalizeFirstLetter(doc.data()['insuredCustName']):doc.data()['insuredCustName'] ,
                insuredCustName:doc.data()['insuredCustName'] !==null?capitalizeFirstLetter(doc.data()['insuredCustName']):doc.data()['insuredCustName'] ,
                policyNo:doc.data()['policyNo'],
                incidentDate:doc.data()['incidentDate'],
                fileIntroDate:doc.data()['fileIntroDate'],
                fileReceiptDate:doc.data()['fileReceiptDate'],
                fileSubmitDate:doc.data()['fileSubmitDate'],
                surveyDate:doc.data()['firstSurveyDate']+" / " +doc.data()['secondSurveyDate'] ,
                placeofSurvey:doc.data()['placeofSurvey'],
                representativeContact : doc.data()['representativeName'] +" / "+ doc.data()['representativeContact'],
                lossTo: doc.data()['lossTo'],
                expectedFee: convertToString( doc.data()['expectedFee']),
                actualFeePaid:  convertToString(doc.data()['actualFeePaid']),
                dateRemarks: doc.data()['dateRemarks'],
                reasonForPending: "All documents are pending"
              }
              temDbFileArray.push(jsonData);
            
       
          // doc.data() is never undefined for query doc snapshots
          
        });
       setReferenceDetails(temDbFileArray);
       setReferenceDetailsOriginal(temDbFileArray);
       setUseAllExportData([]);
        setUseAllExportData(temDbFileArray);
        setUserCurrentRadioButtonValue('all')
       
      }
      catch(e){
        swal("Error :"+e);
      }
        
    }
    //**************************** */
    async function filterTheInsSurveyDetail(stringValue){

    
      setUserCurrentRadioButtonValue(stringValue);
      try{
      let fileterQuer="";
        //filter according to stringValue
        switch (stringValue) {
            case 'fileSubmited':
              const filterList = referenceDetailsOriginal && referenceDetailsOriginal.filter((object) => {
                if(object.fileSubmitDate==="" || object.fileSubmitDate===undefined){
                  return false;
                }
                else if(object.fileSubmitDate && object.fileSubmitDate.length>5){
                  return true;
                }
                return false;
                });
                setReferenceDetails( filterList);
                setUseAllExportData(filterList);
                   
            break;
        
            case 'fileUnSubmited':
              const filterLists = referenceDetailsOriginal && referenceDetailsOriginal.filter((object) => {
                if(object.fileSubmitDate==="" || object.fileSubmitDate===undefined){
                  return true;
                }
                else if(object.fileSubmitDate && object.fileSubmitDate.length>5){
                  return false;
                }
                return true;
                  })
                 setReferenceDetails( filterLists);
                  setUseAllExportData(filterLists);
              break;

              case 'paid':
                //pahila file submit gareko hunupardaxa // ani maatr paid and unpaid hune garx
                const fileSubmitLists = referenceDetailsOriginal && referenceDetailsOriginal.filter((object) => {
                  if(object.fileSubmitDate==="" || object.fileSubmitDate===undefined){
                    return false;
                  }
                  else if(object.fileSubmitDate && object.fileSubmitDate.length>5){
                    return true;
                  }
                  return false;
                  });
                const paidLists = fileSubmitLists && fileSubmitLists.filter((object) => {
                if(object.actualFeePaid==="" || object.fileSubmitDate===undefined){
                  return false;
                }
                else if(object.actualFeePaid && object.actualFeePaid>10){
                  return true;
                }
                return false;
                  })
                   
                  setReferenceDetails( paidLists);
                  setUseAllExportData(paidLists);
              break;
               
              case 'unpaid':
                const fileSubmitListsAgain = referenceDetailsOriginal && referenceDetailsOriginal.filter((object) => {
                  if(object.fileSubmitDate==="" || object.fileSubmitDate===undefined){
                    return false;
                  }
                  else if(object.fileSubmitDate && object.fileSubmitDate.length>5){
                    return true;
                  }
                  return false;
                  });

                const unPaidLists = fileSubmitListsAgain && fileSubmitListsAgain.filter((object) => {
                if(object.actualFeePaid==="" || object.fileSubmitDate===undefined){
                  return true;
                }
                else if(object.actualFeePaid && object.actualFeePaid>10){
                  return false;
                }
                return true;
                  });
                  
                  setReferenceDetails( unPaidLists);
                  setUseAllExportData(unPaidLists);
              break;
              case 'all':
                setReferenceDetails(referenceDetailsOriginal);
                setUseAllExportData(referenceDetailsOriginal);
                break;


          default:
            break;
        }
      }
      catch(e){
        swal("Error"+e);
      }
    }
    const data1 = {
      from: "Link #1",
      message: "Welcome to KindaCode.com",
      timestamp: Date.now(),
    };

    ///********************************** */
   
    async function getALlInsuranceName() {
       
        try {
            const insRefs = collection(db, "insurance")
            const querySnapshot = await getDocs(insRefs);
            if (querySnapshot.docs.length < 1) {
                setAllInsuranceName([])
            } else {
                setAllInsuranceName([])
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    setAllInsuranceName(prev => [...prev, docData])
                });
            }
        
        } catch (e) {
            swal({
                title: "Unable to fecth users from database" + e,
                timer: 3000
            })
            
        }
    }

  
     
      const workbook = new Excel.Workbook();
//*************************** FUNCTION TO SAVE AS EXCEL ********************************** */
      const saveExcel = async () => {
        try {
          const myInput = document.getElementById(myInputId);
          const fileName =     useSelectedInsuranceComoany+" - "+ useCurrentRadioButtonValue // myInput.value || workBookName;
    
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
            column.alignment = { horizontal: 'center' };
          });
    
          // loop through data and add each one to worksheet
          useAllExportData.forEach(singleData => {
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
        } catch (error) {
          console.error('<<<ERRROR>>>', error);
          console.error('Something Went Wrong', error.message);
        } finally {
          // removing worksheet's instance to create new one
          workbook.removeWorksheet(workSheetName);
        }
      };
      function convertToString(value){
        let xyz=" * ";
        if(!value){
          return xyz;
        }
        xyz=value;
        return  xyz;
      
      }
////convert the actual fee paid status
function fileStatusReport(actualFeePaid){
 console.log("value amount is "+actualFeePaid)
  if( actualFeePaid===" * "   || actualFeePaid  <=10){
    return false;
  }
  return true;
}
     
      ////convert the   
      return (
        <> 
        <div className="    bg-gray-300 overflow-x-auto h-full p-5 border-2 border-gray-400  font-normal "> 
   

        <div className=" flex space-x-10  w-11/12  overflow-x-auto bg-white border-2 border-slate-400 border-solid px-2 py-3">             
                     <div className='bg-transparent  text-xs   font-normal ' >
                     <select value={useSelectedInsuranceComoany}  onChange={(event)=>{ 
                        if(user.insurance){
                           if(user.role==="insurance"){
                            setUserSelectedInsuranceCompany(user.insurance);
                            getDetailsOfCompany(user.insurance)
                            return; 
                           }
                        }
 
                      setUserSelectedInsuranceCompany(event.target.value);
                      getDetailsOfCompany(event.target.value)
                    }
                     }     className='shadow-lg shadow-gray-900-500/10   text-xs p-2 border-2 border-gray-500 border-solid focus:border-2 focus:border-blue focus:border-blue-300 w-80 bg-transparent rounded-lg   font-normal text-black' >
                    <option key={"Choose One"} className="bg-gray-300 text-white" value={"Choose One"}>Choose One</option>
                    {
                     insuranceName && insuranceName.map((object, index)=>{
                      return (
                        <option key={index} className=' bg-white rounded-sm  font-normal text-gray-950  text-xs ' value={object['name']}>
                            {object['name']}
                          </option>
                      );;
                     })
                   
                   }    </select>
                     </div>
         
                
              
                     
                     <div className='bg-white   text-black   text-1xl font-normal  flex flex-row' >
                       
                      <div className="text-2xl flex items-center ml-4">
                         <input type="radio" value="all" onChange={(event)=>{filterTheInsSurveyDetail(event.target.value)}}  checked={useCurrentRadioButtonValue==="all"?true:false} className="w-4 h-4  focus:ring-blue-500  text-sm font-medium text-gray-900 " name="default-radio" />
                         <label for="default-radio-1" class="ml-2 text-sm font-normal   ">All</label>
                      </div>

                      <div className="text-2xl flex items-center  ml-4">
                         <input type="radio" value="fileSubmited" onChange={(event)=>{filterTheInsSurveyDetail(event.target.value)}}  checked={useCurrentRadioButtonValue==="fileSubmited"?true:false} className="w-4 h-4  focus:ring-blue-500  text-sm font-medium text-gray-900 " name="default-radio" />
                         <label for="default-radio-1" class="ml-2 text-sm font-normal   ">File Submited</label>
                      </div>

                      <div className="text-2xl flex items-center  ml-4">
                         <input type="radio" value="fileUnSubmited"  onChange={(event)=>{filterTheInsSurveyDetail(event.target.value)}} checked={useCurrentRadioButtonValue==="fileUnSubmited"?true:false}  className="w-4 h-4  focus:ring-blue-500  text-sm font-medium text-gray-900 " name="default-radio" />
                         <label for="default-radio-1" class="ml-2 text-sm font-normal   ">File UnSubmited</label> 
                      </div>
                     
                      <div className="text-2xl flex items-center  ml-4">
                         <input type="radio" value="unpaid"  onChange={(event)=>{filterTheInsSurveyDetail(event.target.value)}} checked={useCurrentRadioButtonValue==="unpaid"?true:false}  className="w-4 h-4  focus:ring-blue-500  text-sm font-medium text-gray-900 " name="default-radio" />
                         <label for="default-radio-1" class="ml-2 text-sm font-normal   ">Fee UnPaid</label> 
                      </div>
                      <div className="text-2xl flex items-center  ml-4">
                         <input type="radio" value="paid" onChange={(event)=>{filterTheInsSurveyDetail(event.target.value)}}  checked={useCurrentRadioButtonValue==="paid"?true:false} className="w-4 h-4  focus:ring-blue-500  text-sm font-medium text-gray-900 " name="default-radio" />
                         <label for="default-radio-1" class="ml-2 text-sm font-normal   ">Fee Paid</label>
                      </div>


                     </div>
 
   
              
                <button   onClick={()=>{
                  saveExcel()
                   
                }} className= "flex items-center px-3 py-2 shadow-lg shadow-gray-400  bg-teal-800 rounded-lg border-2 hover:bg-slate-950">
                  <HiDownload   className="text-sm"/>
                  Export
                </button>
                 
        </div>

{/* 
   //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& LETS BUILD TABLE &&&&&&&&&&&&&&&&&&&&&&
*/}
 

 <div className="h-8 w-11/12 p-2 ">
<span className="text-xs">{user.name +'/'+user.email+'/'+user.role+'/'+user.insurance}</span>
 </div>


        <div className=" border-2  w-11/12  bg-white cursor-pointer  overflow-x-scroll bg-border-2  border-slate-400 border-solid px-2  ">
       
   
        <table class=" table-auto w-1/2 overflow-scroll cursor-pointer border-separate ">
        

          <thead class="  font-medium border-gray-500  bg-gray-300 text-white" >
            <tr className="text-xs border-gray-50 border-2 text-black    bg-[rgb(220,230,243)] "> 
                 <th className="border px-2 py-2 ">SN </th>
                 <th scope="col" className="  px-2 py-2    text-left whitespace-nowrap">Report No </th>
                 <th scope="col" className="  px-2 py-2 w-9  text-left  whitespace-nowrap">Vehicle No </th>

              
                 {/* <th scope="col" className="  px-2 py-2 whitespace-nowrap text-left">Insured </th> */}
                 <th scope="col" className="  px-2 py-2 whitespace-nowrap text-left">Intro Date</th>
                 <th scope="col" className="  px-2 py-2 whitespace-nowrap text-left">Submit Date</th>
                 <th scope="col" className="  px-2 py-2 whitespace-nowrap text-left">Survey date</th>
                 <th scope="col" className="  px-2 py-2 whitespace-nowrap text-left">Fee</th>
                 <th scope="col" className="  px-2 py-2 whitespace-nowrap text-left ">Place</th>
                 <th scope="col" className="  px-2 py-2 w-9  text-left  whitespace-nowrap">Insured </th>
                  <th scope="col" className="  px-2 py-2 whitespace-nowrap text-left">Rep Name/Contact</th>
                 {/* <th scope="col" className="  px-2 py-2 whitespace-nowrap text-left">Loss to </th> */}
                 
 
            </tr>
          </thead>
          <tbody className="bg-white">

            {
              referenceDetails && referenceDetails.map((object, index)=>{

                return (
                <tr   
                 onClick={()=>{
                 // window.open('home/view/'+object["referenceNo"], '_blank', 'noopener,noreferrer');

              //    myNavigate(`view/${object["referenceNo"]}`, {state:{id: object["referenceNo"]}})
                 }}
          

              class="border-2   border-red-100  text-base cursor-pointer hover:bg-gray-300  text-black" key={index}>
               <td class="whitespace-nowrap px-2 py-3 font-normal text-xs">
               <span className=  {fileStatusReport(object['actualFeePaid'])?"   bg-green-200 border-2 border-solid flex justify-center align-center":"border-gray-500  bg-red-200 border-2 border-solid flex justify-center align-center"}>
                {index+1}</span></td>
                <td class="whitespace-nowrap px-2 py-3 text-xs font-bold hover:underline hover:text-blue-500  "> 
                <Link to={"view/"+object["referenceNo"] } state={"hellow"}  target="_blank">{object['referenceNo']}</Link></td>
                <td class="whitespace-nowrap px-2 py-3  text-xs">{object['vehicleNo']}</td>
              
                {/* <td class="whitespace-nowrap px-2 py-3 text-xs">{object['insured']}</td> */}
                {/* <td class="whitespace-nowrap px-2 py-3 text-xs">{object['policyNo']}</td> */}
                {/* <td class="whitespace-nowrap px-2 py-3  text-xs">{object['incidentDate']}</td> */}
                {/* <td class="whitespace-nowrap px-2 py-3 text-xs">{object['fileReceiptDate']}</td> */}
                <td class="whitespace-nowrap px-2 py-3 text-xs">{object['fileIntroDate']}</td>
                <td class="whitespace-nowrap px-2 py-3  text-xs">{object['fileSubmitDate']}</td>
                <td class="whitespace-nowrap px-2 py-3 text-xs">{object['surveyDate']}</td>
                <td class="whitespace-nowrap px-2 py-3 text-xs">{convertToString(object['expectedFee'])+" / "+ convertToString( object['actualFeePaid'])}
               </td>
                
                <td class="whitespace-nowrap px-2 py-3 text-xs w-5 ">{object['placeofSurvey']?.substr(0, 15)}</td>
                <td class="whitespace-nowrap px-2 py-3  text-xs">{object['insuredCustName']}</td>
                <td class="whitespace-nowrap px-2 py-3  text-xs">{object['representativeContact']}</td>
                
                {/* <td class="whitespace-nowrap px-2 py-3  text-xs">{object['lossTo']}</td> */}
                {/* <td class="whitespace-nowrap px-2 py-3  text-xs">{object['lossTo']}</td> */}
                {/* <td class="whitespace-nowrap px-2 py-3  text-xs">{object['expectedFee']}</td>
                <td class="whitespace-nowrap px-2 py-3  text-xs">{object['actualFeePaid']}</td>
                <td class="whitespace-nowrap px-2 py-3  text-xs">{object['dateRemarks']}</td>
                <td class="whitespace-nowrap px-2 py-3  text-xs">{object['reasonForPending']}</td> */}
             
              </tr>
             )
              })
            }

          </tbody>
        </table>
       
      </div>
              <table className="  border-2 border-solid px-2 py-3">
                
              </table>
            </div>
        
        
        </>
      );
    }
    