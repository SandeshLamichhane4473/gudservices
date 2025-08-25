import React, { useRef } from 'react'
import { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert';
import { db } from '../../../firebase/Firebase';
import { collection, setDoc, updateDoc } from 'firebase/firestore';
import { doc , query, getDocs} from 'firebase/firestore';
import { storage } from '../../../firebase/Firebase';
import { uploadString } from 'firebase/storage';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Resizer from "react-image-file-resizer";
import { deleteObject } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { HiTrash } from 'react-icons/hi';
import { Query } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import {HiOutlineMinusCircle} from 'react-icons/hi';
import { UserAuth } from '../../../context/AuthContext';
 
export default function SurveyDetails({ selectedRef, setOpenEditTab, callbackRefNo }) {
    const { user  } = UserAuth()
    const [percent, setPercent] = useState(0);
    const [file, setFile] = useState([]);
    const [newImage, setnewImage] = useState();
    const [compressedImageLists, setCompressImageList] = useState([]);
    const [base64Urls, setbase64Urls] = useState([])
  
    const [loading, setLoading] = useState(false);
    const [loadingSurveyDate, setLoadingSurveyDate] = useState(false)
    const [loadingFile, setLoadingFile] = useState(false);
    const [fileloading, setFileLoading] = useState(false);
    const [hideFileSaveButton, setHideFileSaveButton] = useState(false);

    const [progess, setProgress] =useState("");
    const [dbPhotosList, setDbPhotosList]=useState([]);
    const [loadingPhotosTable, setLoadingPhotosTable]= useState(false);
    const [showModal, setShowModal]=useState(false);
    const [imageUrl, setImageUrl]= useState("");
    const [selectedDateType, setSelectedDateType]= useState("");
    const [selectedDate, setSelectedDate]= useState("");
    const  refDateSelected= useRef();

    let tempUrlVariable = [];
   const   inputFilePhotosRef=useRef();

    const [dateForm, setDateForm] = useState({
        referenceNo: selectedRef.referenceNo,
        firstSurveyDate: selectedRef.firstSurveyDate && selectedRef.firstSurveyDate !== "" ? selectedRef.firstSurveyDate : "",
        secondSurveyDate: selectedRef.secondSurveyDate && selectedRef.secondSurveyDate !== "" ? selectedRef.secondSurveyDate : "",
        thirdSurveyDate: selectedRef.thirdSurveyDate && selectedRef.thirdSurveyDate !== "" ? selectedRef.thirdSurveyDate : "",
        afterCompleteSUrvey: selectedRef.afterCompleteSUrvey && selectedRef.afterCompleteSUrvey !== "" ? selectedRef.afterCompleteSUrvey : "",
        dateRemarks: selectedRef.dateRemarks && selectedRef.dateRemarks !== "" ? selectedRef.dateRemarks : "",
    });

    const [form, setform] = useState({
        referenceNo: selectedRef.referenceNo,
        surveyor: selectedRef.surveyor && selectedRef.surveyor !== "" ? selectedRef.surveyor : "",
        estimation: selectedRef.estimation && selectedRef.estimation !== "" ? selectedRef.estimation : "",
        placeofSurvey: selectedRef.placeofSurvey && selectedRef.placeofSurvey !== "" ? selectedRef.placeofSurvey : "",
        lossTo: selectedRef.lossTo && selectedRef.lossTo !== "" ? selectedRef.lossTo : "",

    });

    function handleChange(event) {
        setFile(event.target.files);
    }

    const resizeFile = (file, name) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                300,
                300,
                "JPEG",
                100,
                0,
                (uri) => {
                    resolve(uri)
                    // setnewImage(uri);
                    // setCompressImageList(...compressedImageLists, uri)
                    // addImagetoStorage(uri, name)
                },
                "base64"
            );
        });

    const resizeImage = (file)
    let tempImageLinkArrays = [];
    const handleUpload = async () => {
        setProgress("")
        if (!file) {
            alert("Please upload an image first!");
            return;
        }
     
        let lengthofFile = file.length;  
        for (let i = 0; i < lengthofFile; i++) {
        
             //resize the image
            const compressedImage = await resizeFile(file[i], file[i].name);
            addImagetoStorage(compressedImage, file[i].name, i, lengthofFile);
            
        }
    };
    
    //first of all add image to storage
    async function addImagetoStorage(_currentFile, name, index, length) {
        try {
            setFileLoading(true);
            const message4 = _currentFile;
            ///////////   old  var storageRef = ref(storage, `/${selectedRef.referenceNo}/${index}`);
            var storageRef = ref(storage, `/surveyPhotos/${selectedRef.referenceNo}/${name}`);

            await uploadString(storageRef, message4, 'data_url').then((snapshot) => {
              
                getDownloadURL(snapshot.ref).then(async (url) => {
                    //first of all check the  updateUrlinFirestore(url, index)
                    // setbase64Urls(oldArray => [...oldArray, url]);
                    const userDocRef = doc(db, `reference/${selectedRef.referenceNo}/photos/`, name );
                    const docData = { fileName: name,  fileUrl: url }
                    await setDoc(userDocRef, docData, {merge:true}).then(()=>{                                   
                         setProgress(index+1 + " Image uploaded...");
                         if(length===index+1){
                            inputFilePhotosRef.current.value="";
                            setFile([]);
                            loadPhotosOfSurvey();
                         }
                         setFileLoading(false); 
                        }).
                        catch(e=>{
                        swal("Error on updating..."+e.message4)
                    });
           
                   
                })
            });

            return;
            setFileLoading(false)
        }
        catch (e) {
            swal(e);
            setFileLoading(false)
        }
        finally{
            setFileLoading(false);
        }
    }
    let i = 0;
    async function updateUrlinFirestore(tempUrl) {
        try {
            //  base64Urls.map((e) => alert("and length..." + (i++) + e));
            setFileLoading(true)
            // 
            let tempArrayUrlsLength = 0;
            tempArrayUrlsLength = tempUrl && tempUrl.length;
            let firestoreUrlsLenth = 0;
            firestoreUrlsLenth = selectedRef.pdfUrl && selectedRef.pdfUrl.length;
            tempArrayUrlsLength = tempArrayUrlsLength;
            for (let index = tempArrayUrlsLength; tempArrayUrlsLength < firestoreUrlsLenth; tempArrayUrlsLength++) {
                var storageRef = ref(storage, `/${selectedRef.referenceNo}/${index}`);
                deleteObject(storageRef).then(() => {
                }).catch((error) => {
                    alert(error)
                });

            }
            setHideFileSaveButton(true);
            setFileLoading(false);
            callbackRefNo(selectedRef.referenceNo);

        }
        catch (e) {
            setFileLoading(false)
            swal(e);
        }
    }

    async function editAndSaveSurveryDate() {
        try {

            if (dateForm.firstSurveyDate === "") {
                swal("Survey Date is undefined.")
                return;
            }
            setLoadingSurveyDate(true);
            const userDocRef = doc(db, "reference", selectedRef.referenceNo);
            await updateDoc(userDocRef, dateForm, { merge: true })
            swal("Success !!!", " SUrvey Date Details updated... Please refresh", "success");
            setLoadingSurveyDate(false);
            callbackRefNo(selectedRef.referenceNo);

        }
        catch (e) {
            swal(e);
        }

    }
//////////////////////////////////////////////////////////////////PHOTOS Loafing &&&&&&&&&&&&&&&&&&&&&&&&&&
    async function loadPhotosOfSurvey(){
        try{
            setProgress();
             setDbPhotosList([]);
             setLoadingPhotosTable(true)
            const fileQuery = query(collection(db, `reference/${selectedRef.referenceNo}/photos/`));
            const querySnapshot = await getDocs(fileQuery);
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
            setLoadingPhotosTable(false)
        }
    }
    ///    *****************   TRASH ALL RECORD  *****************/

    async function trashAllRecord(){
        try{
            const  emptyDocData={
                firstSurveyDate:"",
                secondSurveyDate:"",
                thirdSurveyDate:"",
                afterCompleteSUrvey:"",
                dateRemarks:"",
            };

         //const userDocRef = doc(db, "testreference", selectedRef.referenceNo);
         //real db reference  and test db is testreference
           const userDocRef = doc(db, "reference", selectedRef.referenceNo);
           await updateDoc(userDocRef, emptyDocData, { merge: true }).catch((e)=>{
           });

          // setShowModal(false);
           let x=form.expectedFee;

           selectedRef.firstSurveyDate="";
           selectedRef.secondSurveyDate="";
           selectedRef.thirdSurveyDate="";
           selectedRef.afterCompleteSUrvey="";
           selectedRef.dateRemarks="";

           setDateForm({
            firstSurveyDate: "",
            secondSurveyDate:"",
            thirdSurveyDate:"",
            afterCompleteSUrvey:"",
            dateRemarks:"",
             });
          
           callbackRefNo(selectedRef.referenceNo);
           swal("Success !!!", "All record cleared.");
        
        }
        catch(e){
            swal("Error"+e);
        }
        finally{
            setShowModal(false);
        }
    }

    ///////////  DELETE Image from reference ###################################################
      async function deleteImageFromReference(fileName)
       {

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
        try{
            setLoadingPhotosTable(true);////2080-80-120
            //note real firestore collection id name is : testotherfiles and real firestore name is: otherfiles
            await deleteDoc(doc(db, `reference/${selectedRef.referenceNo}/photos/${fileName}`)).catch(e => swal("error is"+e));
            const desertRef = ref(storage, `surveyPhotos/${selectedRef.referenceNo}/${fileName}`);
            await deleteObject(desertRef).then(async () => {
                swal("Image successfully deleted");
                loadPhotosOfSurvey();
             }).catch((error) => { swal(error); });
        }
        catch(e){
          swal("Error"+e);
        }finally{
            setLoadingPhotosTable(false)
        }
       } 

    ///////////////EDIt and Save Survey &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    async function editAndSaveSurvery() {
        try {
            if (form.estimation.length < 3) {
                swal("Invalid Cost estimation");
                return;
            }
            if (form.surveyor.trim().length < 3) {
                swal("Please fill surveyor")
                return;
            }
            if (form.lossTo.trim().length < 5) {
                swal("Please fill Loss to")
                return;
            }
            setLoading(true);
            const userDocRef = doc(db, "reference", selectedRef.referenceNo);
            await updateDoc(userDocRef, form, { merge: true })
            swal("Success !!!", "User information updated... Please refresh", "success");
            setLoading(false);
            callbackRefNo(selectedRef.referenceNo);

        }
        catch (e) {
            swal(e);
        }
    }
  

    async function saveSurveyDate(){
        try{
       
            if (selectedDate=== "" || selectedDateType==="") {
            swal("Date and Date type is missing.");
            return;
             }

           setLoadingSurveyDate(true);
           let docData="";
            selectedDateType==="firstSurveyDate"?
              docData={"firstSurveyDate":selectedDate, "dateRemarks":dateForm.dateRemarks}
              :
              selectedDateType==="secondSurveyDate"?
              docData={"secondSurveyDate":selectedDate , "dateRemarks":dateForm.dateRemarks}:
              selectedDateType==="thirdSurveyDate"?
              docData={"thirdSurveyDate" :selectedDate,   "dateRemarks":dateForm.dateRemarks}:
              docData={"afterCompleteSUrvey": selectedDate,  "dateRemarks":dateForm.dateRemarks};
        
        const userDocRef = doc(db, "reference", selectedRef.referenceNo);
        await updateDoc(userDocRef, docData, { merge: true }).catch((e)=>{swal(e)}) ;
        callbackRefNo(selectedRef.referenceNo);
        
        selectedRef.dateRemarks=dateForm.dateRemarks;
        if(selectedDateType==="firstSurveyDate"){
            selectedRef.firstSurveyDate=selectedDate;
        }else if(selectedDateType==="secondSurveyDate"){
            selectedRef.secondSurveyDate=selectedDate;
        }else if(selectedDateType==="thirdSurveyDate"){
            selectedRef.thirdSurveyDate=selectedDate;
        }else{
            selectedRef.afterCompleteSUrvey=selectedDate;
        }
           
        
        setSelectedDate("");
        setSelectedDateType("Select One");
        refDateSelected.current.value="Select One";

         swal("Success !!!", "Updated", "success");
         setLoadingSurveyDate(false);              

        }
        catch(e){
            swal(e);
        }
        finally{
            setLoadingSurveyDate(false);
        }
    }

    const testNames=[1,2,3,4,5,6,7,8,9,10,11,12,13,14, 15]
    return (
        <div className='bg-white p-6 w-11/12 shadow-lg shadow-gray-300   border-2 text-sm border-gray-400'>
            <div className='w-full h-full'>
                <h1 className='text-xs text-orange-600 font-semibold'>Survey Details <span className='  ml-0'> {selectedRef.referenceNo} <span className='text-sm text-gray-400'>{selectedRef.insurance}</span> </span>
                    <span onClick={() => { setOpenEditTab(false) }} className='text-xs border  rounded-lg p-2 hover:bg-slate-100 text-green-600 cursor-pointer'>Go Back</span>
                </h1>

                {/* <h1>hey{file && file[0].name}</h1>
                <h1>hey{file && file[1].name}</h1>
                <h1>hey{file && file[2].name}</h1> */}

                <div className='h-5'></div>

                <div class="  p-2  gap-20 border-1    rounded-lg w-full">
                    <div className='flex flex-col pt-0 bg-inherit  border-1  bg-gray-200  w-full  border-gray-600 shadow-lg rounded-lg text-black '>
                    <h1 className='text-left  uppercase mt-10 text-black text-xs underline font-bold'>Survey Dates</h1>

                    <div className='flex flex-col mt-4 '>
                        <label for="first_name" class=" mb-2  text-xs font-normal text-gray-500   ">Select Survey Date</label>
                    <div className='bg-transparent   text-white   text-1xl font-medium ' >
                    <select onChange={(event) => { setSelectedDateType(event.target.value)}}  ref={refDateSelected}   className='mr-3 text-xs  p-2 w-2/4 bg-gray-300 rounded-lg   font-normal text-black' >
                    <option selected disabled className='bg-gray-300 rounded-lg   text-xs font-normal text-gray-800' value="Select One">Select One</option>
                    <option className='bg-gray-300 rounded-lg   font-normal text-gray-950  text-xs ' value="firstSurveyDate">First Survey Date</option>
                    <option className='bg-gray-300 rounded-lg   font-normal text-black  text-xs ' value="secondSurveyDate">Second Survey Date</option>
                    <option className='bg-gray-300 rounded-lg    font-normal text-black text-xs' value="thirdSurveyDate">Third Survey Date</option>
                    <option className='bg-gray-300 rounded-lg   font-normal text-black text-xs' value="afterCompleteSUrvey"> After Complete Survey</option>
                    </select>
                     </div>
                    </div>
                
                       <div className='flex flex-col pt-5'>
                            <label for="first_name" placeholder='Policy No' class=" mb-2   text-xs font-normal    text-gray-500">Select Date</label>
                            <input type='date' value={selectedDate} placeholder='2072-12-15' onChange={(e) =>  setSelectedDate(e.target.value)} className='p-2 text-xs w-2/4 rounded  placeholder:text-gray-500 text-black bg-gray-300 ' />
                        </div>
                        

                        <div className='flex flex-col pt-4'>
                            <label for="first_name" class=" mb-2  text-xs font-bold text-gray-500">Remarks </label>
                            <textarea id="w3review" value={dateForm.dateRemarks} name="w3review" onChange={(e) => setDateForm({ ...dateForm, dateRemarks: e.target.value })} rows="3" placeholder='Property  or third party loss ' className='text-black p-1 placeholder:text-gray-500 bg-gray-300 w-2/4 rounded-lg  text-xs' cols="50"></textarea>
                        </div>

                          {
                            loadingSurveyDate?
                            <><><div className='text-black'> Loading...</div></></>
                       :
                        <button className='bg-green-600 text-white text-xs p-3 mt-7 w-28 hover:bg-purple-500 border rounded-lg shadow-lg' onClick={() => {
                                              { saveSurveyDate(); }  }}> Save</button>
                        }

                    <div className='h-20'>

                    </div>
                        {/* ****************************** ITS LETS SEARCH  INTO TABLE ********************* */}
               <div  className="grid grid-col-1 overflow-x-auto   ">
               <table   className=' border-collapse w-full  border-spacing-1 min-w-max   text-xs '>
                    <thead >
                  <tr className='bg-gray-400 '>
                    <th className="border px-3 py-2 w-20">SN</th>
                    <th className="border px-3 py-2">First S Date</th>
                    <th className="border px-3 py-2">Second S Date</th>
                    <th className="border px-3 py-2" >Third S Date</th>
                    <th className="border px-3 py-2">After C Date</th>
                    <th className="border px-3 py-2">Remarks</th>
                    <th className="border px-3 py-2"> Trash</th>
                  </tr>
                </thead>
                     {
                      false ?
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
                            <td className="px-6 py-4 border w-20"> <span>{ 1 }</span></td>
                            <td className="px-6 py-4 border  ">{selectedRef.firstSurveyDate }</td>
                            <td className="px-6 py-4 border">  {selectedRef.secondSurveyDate  }   </td>
                            <td className="px-6 py-4 border rounded-lg">{selectedRef.thirdSurveyDate }  </td>
                            <td className="px-6 py-4 border rounded-lg"> {selectedRef.afterCompleteSUrvey} </td>
                            <td className="px-6 py-4 border rounded-lg  break-words whitespace-pre-wrap overflow-hidden"><div className='max-w-lg overflow-x-auto'> <p>{selectedRef.dateRemarks} </p></div></td>
                            <td  className="px-6 py-4 cursor-pointer border text-orange-900">
                                <HiOutlineMinusCircle  onClick={()=>{ setShowModal(true)}} className='  hover:text-xs '  />
                            </td> 
                          </tr>
                      }
                      </tbody>
                }
                    </table>

                    </div>
                        {/**************************************TABLE */}                        
                    </div>
            <div className='h-10 bg-red-200 mt-2'></div>
                     
                    <div className='flex flex-col pt-0  bg-inherit text-black bg-gray-200 p-2 border-gray-400 shadow-lg rounded-lg'>
                        <h1 className='text-left  uppercase mt-10 text-black font-semibold underline text-xs'>Surveor Information</h1>
                        <div className='flex flex-col mt-7'>
                            <label for="first_name" class=" mb-2  text-xs font-normal text-gray-500 ">Surveyor</label>
                            <input type='text' value={form.surveyor} onChange={(e) => setform({ ...form, surveyor: e.target.value })} placeholder='Survoyer' className="rounded-lg p-2 placeholder:text-gray-500 bg-gray-300  w-2/4 text-xs text-black" />
                        </div>

                        <div className='flex flex-col mt-7'>
                            <label for="first_name" class=" mb-2  text-xs font-normal text-gray-500 ">Estimation</label>
                            <input type='number' value={form.estimation} onChange={(e) => setform({ ...form, estimation: Number(e.target.value) })} placeholder='Estimation' className="rounded-lg p-2 placeholder:text-gray-500 w-2/4 bg-gray-300   text-xs text-black" />
                        </div>
                        <div className='flex flex-col mt-7'>
                            <label for="first_name" class=" mb-2 text-xs font-normal text-gray-500 ">Place of Survey</label>
                            <input type='text' value={form.placeofSurvey} onChange={(e) => setform({ ...form, placeofSurvey: e.target.value })} placeholder='Ex. pokhara' className="rounded-lg p-2 placeholder:text-gray-500 bg-gray-300  w-3/4  text-xs text-black" />
                        </div>

                        <div className='flex flex-col pt-4'>
                            <label for="first_name" class=" mb-2  text-xs font-normal text-gray-500">Loss to </label>
                            <textarea id="w3review" value={form.lossTo} name="w3review" onChange={(e) => setform({ ...form, lossTo: e.target.value })} rows="3" placeholder='Property  or third party loss ' className='text-black p-1 w-3/4 placeholder:text-gray-500 bg-gray-300  rounded-lg  text-xs' cols="50"></textarea>
                        </div>
                        <div className='flex flex-col pt-4'>
                            {loading ?
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
                                <button className='bg-green-600 text-white  text-xs p-3 mt-7 w-28 hover:bg-purple-500 border rounded-lg shadow-lg' onClick={() => {
                                    { editAndSaveSurvery(); }
                                }}> Save</button>
                            }
                        </div>
                    </div>
                     
                     
                    <div className='h-10 bg-red-200 mt-2'></div>

                    <div className='flex flex-col    bg-inherit    bg-gray-100 p-2 shadow-2xl rounded-lg'>
                        <div className='w-2/3'>
                        <h1 className='text-left  uppercase mt-10 text-black text-xs underline font-semibold'>Survey Photos</h1>
                        <div className='flex flex-col mt-10 '>
                            <label for="first_name" class=" mb-2  text-xs font-normal text-gray-500 ">Photos</label>
                            <input type='file' accept="image/png,  image/jpeg" multiple  ref={inputFilePhotosRef} onChange={handleChange} placeholder='Remarks' className=" rounded-lg p-2 placeholder:text-gray-500 bg-gray-300 text-xs text-black" />
                        </div>
                          <h1 className='h-4 text-xs p-3 text-green-700'> {progess}   </h1>                  
                         <div className='h-3'></div>
                          
                            {
                                fileloading?
                                <><ThreeDots /></>:
                                <>
                                   <button className='bg-green-700 w-28  text-xs p-3 mt-2 hover:bg-purple-500 border rounded-lg shadow-lg'
                                 onClick={() => {
                                    {
                                         handleUpload()
                                    }
                                }}> Save Photo</button></>
                            }
                          
                       </div>
       {/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& TABLE AND PHOTOS DETAIL***************** */}

                {
                    loadingPhotosTable?<><div className='border p-3 mt-10 w-fit  hover:bg-blue-600 text-black hover:text-white'>..........Loading.....</div></>:
            
                  <button  className='border p-1 mt-10 w-fit  text-blue-700 underline    rounded-lg shadow-2xl text-xs  hover:bg-blue-600 hover:text-white'
                   onClick={()=>{
                         loadPhotosOfSurvey()
                     }}> Click here to refresh and load photos</button>

                    }

                   

<div className='   flex space-x-1  flex-wrap shadow-lg p-2 '>
    {
         dbPhotosList  && dbPhotosList.length <1?
         <h1 className='p-1 font-serif rounded-lg shadow-2xl text-black bg-gray-200'>Click above to view image</h1>:
          dbPhotosList.map((object, index)=>{
    
            return  (
           <div className='mt-0 border-2 border-gray-300   shadow-sm shadow-gray-400 hover:shadow-lg hover:shadow-gray-500'>
              <a href= {object['fileUrl']}  className='' target="_blank">
            <img
             src={object["fileUrl"]}
             className="w-52 h-52 "
                alt="..." />
             </a>
               {/* <h3 className='text-xs w-80 overflow-clip '> <span className=' text-white'>{object['fileName']}</span></h3> */}
              <div className='flex space-x-1 font-mono text-sm cursor-pointer'>
              <button   onClick={()=>{   deleteImageFromReference(object["fileName"])  }} className=' shadow-lg mt-2 p-1 text-black hover:bg-orange-600  '>
                Delete
            </button>
          </div>
         
        </div>);
        })   
    }
</div>

       <div className=' bg-gray-200 p-5 rounded-lg shadow-lg flex flex-wrap '>

           {
           selectedRef.pdfUrl && selectedRef.pdfUrl.map((object, index) =>{          
         return  (
           <div className='mt-6'>
            <img
             src={object}
             className="w-96 h-96 rounded border bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
                alt="..." />
               <h3 className='text-xs w-80 overflow-clip '> <span className=' text-white'>{object['fileName']}</span></h3>
              <div className='flex space-x-5 font-mono text-sm cursor-pointer'>
          </div>
        </div>)
           })
        }                      </div>
                    </div>
                </div>



            </div>

            {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}

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
                                        <h4 className="text-sm font-medium text-gray-800">
                                            Delete Records ?
                                        </h4>
                                        <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                                            Expected fee, Actual fee, Fee payment date, File submit date will be deleted
                                        </p>
                                        <div className="items-center gap-2 mt-3 sm:flex">
                                            <button
                                                className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                                onClick={() =>
                                                  trashAllRecord()
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
        
        

        </div >
    )
}
