import React, { useEffect, useRef } from 'react'
import swal from 'sweetalert'
import { addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { storage, usersRef } from '../../../firebase/Firebase';
import { uploadString } from 'firebase/storage';
import { Query } from 'firebase/firestore';
import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';

import { db } from '../../../firebase/Firebase';
import { setDoc, } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Resizer from "react-image-file-resizer";
import { deleteObject } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { HiEye, HiTrash } from 'react-icons/hi';
import { collection } from 'firebase/firestore';
import { query, where, getDocs } from "firebase/firestore";

import { UserAuth } from "../../../context/AuthContext";


export default function VehicleExtraDetails({ selectedRef, setOpenEditTab, callbackRefNo }) {

  const { user  } = UserAuth()
  const [pdffile, setPdfFile] = useState("");

  const refFile = useRef();
  const refSelect = useRef();

  const refOuterFileType=  useRef();
  const refOuterUploadFile= useRef();
  
  const refInsuredFileType=useRef();
  const refInsuredFileUpload=useRef();

  let tempUrlVariable = [];
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState([]);

  const [insuredPdfFileType, setInsuredPdfFileType]=useState("");
  const [insuredPdfFile, setInsuredPdfFile] = useState();

  const [newImage, setnewImage] = useState();
  const [compressedImageLists, setCompressImageList] = useState([]);
  const [base64Urls, setbase64Urls] = useState([])
  const [fileloading, setFileLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [dbFileDetails, setDbFileDetails] = useState([])
  const [selectedPdfFile, setSelectedPdfFile] = useState("");
  const [outerSelectedFileType, setOuterSelectedFileType] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [outerBtnLoading, setOuterBtnLoading] = useState(false);
  const [outerDltBtnLoading, setOuterDltBtnLoading] = useState(false);
  const [outerDbFileDetails, setOuterDbFileDetails] = useState([])
  const [outerPdfFile, setOuterPdfFile] = useState();
  const [outerFileLoading, setOuterFileLoading] = useState(false);
  // ***************************** START OF PROGRAM *******************//


  const [form, setform] = useState({
    // claimOn: "",
    pdfFileType: "Select One",
    pdfFileName: "",
  });

  useEffect(() => {
      getAllVehicleExtraDetail();
      getAllOuterVehicleExtraDetail();
  }, []);



  async function getAllVehicleExtraDetail() {
    setFileLoading(true)
    try {
      // const q = query(collection(db, `vehicleInfo/${selectedPdfFile}/${selectedRef.referenceNo}/${name}`"), where("capital", "==", true));
      const vehicleQuery = query(collection(db, `vehicleExtra/${selectedRef.referenceNo}/fileDetails/`));
      const querySnapshot = await getDocs(vehicleQuery);
      let temDbFileArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        const newDocData = {
          docId: doc.id,
          pdfFileName: doc.data()['pdfFileName'],
          pdfType: doc.data()['pdfType'],
          pdfUrl: doc.data()['pdfUrl'],
        }
        temDbFileArray.push(newDocData);



      });
      setDbFileDetails(temDbFileArray);
      setFileLoading(false);

    }
    catch (e) {
      swal("Error" + e);
      setFileLoading(false);
    }
  }

  //############################## get all outer vehicle Details ########################

  async function getAllOuterVehicleExtraDetail() {
    setOuterDltBtnLoading(true)
    try {
      // const q = query(collection(db, `vehicleInfo/${selectedPdfFile}/${selectedRef.referenceNo}/${name}`"), where("capital", "==", true));
      const vehicleQuery = query(collection(db, `OuterVehicleExtra/${selectedRef.referenceNo}/fileDetails/`));
      const querySnapshot = await getDocs(vehicleQuery);
      let temDbFileArray = [];
      querySnapshot.forEach((doc) => {

        const newDocData = {
          docId: doc.id,
          pdfFileName: doc.data()['pdfFileName'],
          pdfType: doc.data()['pdfType'],
          pdfUrl: doc.data()['pdfUrl'],
        }
        temDbFileArray.push(newDocData);
      });

      setOuterDbFileDetails(temDbFileArray);
      setOuterDltBtnLoading(false);
    }

    catch (e) {
      swal("Error" + e);
      setOuterDltBtnLoading(false);
    }
  }



  //########################################################################################

  function handleFile1Change(event) {
      if(event.target.files){
         setInsuredPdfFile(event.target.files[0])
      }
  }


  function handleOuterFileInput(event) {
    if (event.target.files) {
      setOuterPdfFile(event.target.files[0]);
      const length = event.target.files.length;

    }
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

  //&&&&&&&&&&&&&&&&&  HANDLE OUTER FILE UPLOAD ################################
  const handleOuterFileUpload = async () => {

    if (outerSelectedFileType === "" || outerSelectedFileType === "Select One") {
      swal("Select file type name")
      return;
    }

    if (!outerPdfFile) {
      swal("upload the photo from device")
      return;
    }

    /// check the list of padffilename before uploading into firetore
   let imageAlreadyExist=false;
    outerDbFileDetails && outerDbFileDetails.map((object, index) => {

      if(object['pdfFileName']===outerPdfFile.name){
        imageAlreadyExist=true;
      }      
    }
    );

    if(imageAlreadyExist){
      swal("Image name already exists")
      return;
    }
       
    const compressedImage = await resizeFile(outerPdfFile, outerPdfFile.name);

    setOuterBtnLoading(true);
    var storageRef = ref(storage, `outerVehicleInfo/${outerSelectedFileType}/${selectedRef.referenceNo}/${outerPdfFile.name}`);
    await uploadString(storageRef, compressedImage, 'data_url').then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        setOuterBtnLoading(false);
        //******************   Update data into firestore **************** */


        const userDocRef = collection(db, `OuterVehicleExtra/${selectedRef.referenceNo}/fileDetails/`);
        const docData = { pdfFileName: outerPdfFile.name, pdfType: outerSelectedFileType, pdfUrl: url }
        await addDoc(userDocRef, docData)
          .then(docRef => {
            setOuterBtnLoading(false);
            swal("Successfull");
           
            setOuterSelectedFileType("")
            refOuterFileType.current.value="Select One";
            refOuterUploadFile.current.value="";
            setOuterPdfFile()


            getAllOuterVehicleExtraDetail();
            //clear the form field value
          })
          .catch(error => {
            alert(error);
            setOuterBtnLoading(false);
          })
        //*********************************** */
      }).catch(error => {
        alert(error);
        setOuterBtnLoading(false);
      })
    });


  }



  //&&&&&&&&&&&&&&&&&&&&&&& END OF OUTER FILE UPLOAD #############################


  const handleUpload = async () => {
    try{
   
    if (insuredPdfFileType === ""  || insuredPdfFileType==="Select One") {
      swal("Select insured file type ");
      return;
    }

    if (!insuredPdfFile) {
      swal("No any image selected ");
      return;
    }
  
  /// check the list of padffilename before uploading into firetore
   let imageAlreadyExist=false;
    dbFileDetails && dbFileDetails.map((object, index) => {
    if(object['pdfFileName']===insuredPdfFile.name){
      imageAlreadyExist=true;
    }      
  }
  );
 

  if(imageAlreadyExist){
    swal("Image name already exists")
    return;
  } 

  setBtnLoading(true)
  const compressedImage = await resizeFile(insuredPdfFile,  insuredPdfFile.name);
  addImagetoStorage(compressedImage,  insuredPdfFile.name);

}
catch(e){
  swal(e);
}
 
  };

  async function addImagetoStorage(_currentFile, name) {
    try {
      setBtnLoading(true);
      const message4 = _currentFile;
      var storageRef = ref(storage, `vehicleInfo/${insuredPdfFileType}/${selectedRef.referenceNo}/${name}`);
    
      await uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
            updateUrlinFirestore(url, name)
        })
      });
     
      return;

    }
    catch (e) {
      swal(e);
      setBtnLoading(false);
      setFileLoading(false)
    }
  }


  let i = 0;


  //########################## HANDLE FILE DELETE ####################################################
  async function handleFileDelete(docId, pdfType, pdfUrl, pdfFileName) {

    try {

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

      await setFileLoading(true);
      await deleteDoc(doc(db, `vehicleExtra/${selectedRef.referenceNo}/fileDetails/${docId}`)).catch(e => alert(e));
      const desertRef = ref(storage, `vehicleInfo/${pdfType}/${selectedRef.referenceNo}/${pdfFileName}`);
      await deleteObject(desertRef).then(async () => {
        swal("Successfully deleted...Please Refresh");
        getAllVehicleExtraDetail();
        setFileLoading(false);
      }).catch((error) => {
        swal(error);
        setFileLoading(false);
      });
    }
    catch (e) {
      setFileLoading(false);
      swal(e)
    }
  }

  ///###########################  HENDLE DELETE #######################


  //%%%%%%%%%%%%%%%%%%%%% HANDLE OUTER FILE DETAILS #####################
  async function handleOuterFileDelete(docId, pdfType, pdfUrl, pdfFileName) {
 
    try {

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


      await setOuterDltBtnLoading(true);
      await deleteDoc(doc(db, `OuterVehicleExtra/${selectedRef.referenceNo}/fileDetails/${docId}`)).catch(e => alert(e));
      const desertRef = ref(storage, `outerVehicleInfo/${pdfType}/${selectedRef.referenceNo}/${pdfFileName}`);
      await deleteObject(desertRef).then(async () => {
        swal("Successfully deleted...Please Refresh");
        getAllOuterVehicleExtraDetail();
        setOuterDltBtnLoading(false);
      }).catch((error) => {
        swal(error);
        setOuterDltBtnLoading(false);
      });
    }
    catch (e) {
      setOuterDltBtnLoading(false);
      swal(e)
    }

  }




  //*************************************END OF OUTER FILE DETAILS&&&&&&&&&&&&&&&&&&&&&&&& */
  async function updateUrlinFirestore(tempUrl, pdfFileName) {
    try {
      //  base64Urls.map((e) => alert("and length..." + (i++) + e));
      setBtnLoading(true)
      const userDocRef = collection(db, `vehicleExtra/${selectedRef.referenceNo}/fileDetails/`);
      let indexx = 0;
      const docData = { pdfFileName: pdfFileName, pdfType: insuredPdfFileType, pdfUrl: tempUrl }
      await addDoc(userDocRef, docData)
        .then(docRef => {
          swal("updated in the databse...successfully");
          
          setInsuredPdfFile("");
          setInsuredPdfFileType("");
          refInsuredFileType.current.value="Select One";
          refInsuredFileUpload.current.value="";
          setBtnLoading(false);
          getAllVehicleExtraDetail();
          //clear the form field value
        })
        .catch(error => {
          alert(error);
          setBtnLoading(false)
        })

      setBtnLoading(false);



      // const userDocRef = doc(db, "vehicleExtraDetails", selectedRef.referenceNo);
      // await setDoc(userDocRef, { referenceNo: selectedRef.referenceNo, pdfType: selectedPdfFile, pdfUrl: tempUrl }, { merge: true })
      // swal("Success !!!", "Url information updated... Please refresh to see effect", "success");
      //conditon check the  selected ref pdfurl

      // let tempArrayUrlsLength = 0;
      // tempArrayUrlsLength = tempUrl && tempUrl.length;
      // let firestoreUrlsLenth = 0;
      // firestoreUrlsLenth = selectedRef.pdfUrl && selectedRef.pdfUrl.length;
      // tempArrayUrlsLength = tempArrayUrlsLength;
      // for (let index = tempArrayUrlsLength; tempArrayUrlsLength < firestoreUrlsLenth; tempArrayUrlsLength++) {
      //   var storageRef = ref(storage, `/${selectedRef.referenceNo}/${index}`);
      //   // deleteObject(storageRef).then(() => {
      //   // }).catch((error) => {
      //   //    alert(error)
      //   // });

      // }
      // setHideFileSaveButton(true);
      // setFileLoading(false);
      //  callbackRefNo(selectedRef.referenceNo);

    }
    catch (e) {
      setFileLoading(false)
      swal(e);
    }
  }



  //**************************END OF PROGRAM***************** */
  async function editAndSave() {

    // if (!form.fileSubmitDate || form.fileSubmitDate === "") {
    //     swal("Empty file submit date")
    //     return;
    // }


    if (pdffile) {

      setLoading(true);

      try {
        const storageRef = ref(storage, `vehicleInfo/${selectedPdfFile}/${selectedRef.referenceNo}`);
        const uploadTask = uploadBytesResumable(storageRef, pdffile);
        const x = await uploadTask.on("state_changed",
          (snapshot) => {
            const progress =
              Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          },
          (error) => {
            swal(error);
          },
          () => {
             
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              swal(downloadURL)
              // setLoading(true);
              // const userDocRef = doc(db, "vehicleInfo", selectedRef.referenceNo);
              // await updateDoc(userDocRef, { reportUrl: downloadURL }, { merge: true })
              // swal("Success !!!", "Hurry Image updated", "success");
              // setLoading(false);
              //  callbackRefNo(selectedRef.referenceNo);
            });
          }
        );
        setLoading(false);
      }
      catch (e) {
        swal(e);
        setLoading(false);
      }
    }

  }
  const [loading, setLoading] = useState(false);

  return (
    <div className='bg-white px-10 py-6 w-11/12 shadow-lg shadow-gray-300   border-2 text-sm border-gray-400'> 
     <h1 className='text-xs text-yellow-500 mt-2 font-semibold'> 
         <span onClick={() => { setOpenEditTab(false) }} className='text-xs  border rounded-lg p-2 hover:bg-slate-100 text-green-600 cursor-pointer ml-2'>Go Back</span>
         </h1>
      <div className='  p-2'>
        <div className='bg-ye  rounded-lg shadow-2xl shadow-gray-600 bg-slate-900'>
      
          <div className="grid     grid-cols-2 ">
         
            <div className=" p-5   bg-tra">
              <div className='  rounded-lg p-5'>
                <h2 className=' text-xs underline text-left  font-semibold mt-4 text-teal-500'>Insured Vehicle Detail</h2>
                <div className='mt-5'>
                  <span className='font-thin text-xs  text-white'> Reference No :</span>
                  <span className='  text-left  font-thin mt-4 text-xs text-white'>{selectedRef.referenceNo}</span>
                </div>
                {/* <div className='border w-full rounded border-solid bg-transparent p-6 mt-5'>
                <h3 className='text-3xl'> Insured Vehicle and related Files </h3>
              </div> */}
                <div className='mt-4'> <label className='text-1xl font-extralight'>File type</label></div>

                {/* value={form.representativeName} placeholder='Ex. Mamata Yadav' onChange={(e) => setform({ ...form, representativeName: e.target.value })}  */}
                <div className='bg-transparent  text-white   text-xs font-medium ' >
                  <select onChange={(event) => setInsuredPdfFileType(event.target.value)} ref={refInsuredFileType} className='mr-3 p-2  bg-gray-600 rounded-lg w-full   font-normal text-white' >
                    <option selected disabled className='bg-gray-600 rounded-lg   font-semibold text-white' value="Select One">Select One</option>
                    <option className='bg-gray-600 rounded-lg   font-semibold text-white' value="BillBook">Bill Book</option>
                    <option className='bg-gray-600 rounded-lg  font-semibold text-white' value="Liscence">Driving Liscence</option>
                    <option className='bg-gray-600 rounded-lg  font-semibold text-white' value="JackPass">Jack Pass</option>
                    <option className='bg-gray-600 rounded-lg  font-semibold text-white' value="RoadPermit">Road Permit</option>
                    <option className='bg-gray-600 rounded-lg  font-semibold text-white' value="Others">Others</option>
                  </select>
                </div>

                <div className='flex flex-col mt-3   '>
                  <div className='mt-4'> <label className='text-1xl font-extralight'>Upload Files</label></div>
                  <input type='file' ref={refInsuredFileUpload} accept="image/png, image/jpeg" onChange={handleFile1Change}
                    className='ml-0 mt-2 p-2  bg-gray-600 rounded-lg text-xs  font-semibold text-white' name='BlueBook' placeholder='Select BlueBook Image' />
                </div>


                <div className='flex justify-center mt-11 text-lg '>
                  {
                    btnLoading ?
                      <ThreeDots />
                      :
                      <button onClick={() => {
                        handleUpload();
                      }} className='bg-teal-800  w-full     p-2 font-semibold rounded-lg hover:bg-blue-800 text-white'>
                        <span className='text-xs'>
                          Save
                        </span>
                      </button>
                  }
                </div>
              </div>
            </div>
            <div className="..."></div>
          </div>


          <div className='grid grid-col-1 p-2 overflow-x-auto  '>
            <div class=" overflow-x-auto    ">


              <button className='border hover:bg-orange-700 hover:rounded-lg hover:shadow-lg p-2 font-extralight' onClick={() => { getAllVehicleExtraDetail() }}>Click here to load files</button>
              <table className='  border-collapse w-full  border-spacing-1 min-w-max   text-1xl      '>
                {/* <table class="text-4xl min-w-max border-collapse w-full  "> */}
                <thead >
                  <tr className='bg-teal-700'>
                    <th className="border px-3 py-2 w-20  ">SN</th>
                    <th className="border px-3 py-2  ">File Name</th>
                    <th className="border px-3 py-2  ">Files</th>
                    <th className="border px-3 py-2" >View File</th>
                    <th className="border px-3 py-2  ">Delete</th>

                  </tr>
                </thead>

                {
                  fileloading ?

                    <tr className='   w-2/3 h-10'>

                      <td></td>
                      <td></td>
                      <td className='text-center'>Loading....</td>
                      <td></td>
                      <td></td>
                    </tr>
                    :


                    <tbody className=''>

                      {
                        dbFileDetails && dbFileDetails.map((object, index) => {
                          return (


                            <tr className='border'>
                              <td className="px-6 py-4 border w-20">{index + 1}</td>
                              <td className="px-6 py-4 border">{object['pdfFileName']}</td>
                              <td className="px-6 py-4 border">{object['pdfType']}</td>
                              <td className="px-6 py-4 border rounded-lg focus:bg-slate-600  text-teal-700"><a href={object['pdfUrl']} target="_blank"><HiEye /></a></td>
                              <td className="px-6 py-4 border"><HiTrash onClick={() => {

                                handleFileDelete(object['docId'], object['pdfType'], object['pdfUrl'], object['pdfFileName'])
                              }} className='cursor-pointer hover:bg-red-600 hover: rounded-lg'></HiTrash></td>

                              {/* <td className="px-6 py-4 border">{object['docId']}</td> */}
                            </tr>
                          )
                        })
                      }
                    </tbody>
                }
              </table>
            </div>

          </div>

        </div>
      </div>
      {/* *****************Third party details ******************************* */}
      <div className='h-8'></div>

      <div className='  bg-transparent p-5'>
        <div className='bg-slate-900 rounded-2xl shadow-2xl shadow-gray-300  rounded-lg shadow-2xl shadow-gray-600  '>

          <div className="grid   grid-cols-2 ">
            <div className=" p-5   bg-transparent">
              <div className='  rounded-lg p-2'>
                <h2 className=' text-xs underline text-left  font-semibold mt-4 text-teal-500'>Third Party Vehicle Details</h2>
                <div className='mt-5'>
                  <span className='font-thin text-xs  text-white'> Reference No :</span>
                  <span className='  text-left  font-thin mt-4 text-xs text-white'>{selectedRef.referenceNo}</span>
                </div>



                <div className='mt-4'> <label className='text-xs font-extralight'>File type</label></div>


                {/* value={form.representativeName} placeholder='Ex. Mamata Yadav' onChange={(e) => setform({ ...form, representativeName: e.target.value })}  */}
                <div className='bg-transparent  text-white  pt-2 text-1xl font-medium ' >
                  <select onChange={(event) => setOuterSelectedFileType(event.target.value)} ref={refOuterFileType}
                    className='mr-3 p-2 bg-inherit border w-full text-white   rounded-lg   font-semibold' name="cars" id="cars">
                    <option selected disabled className='bg-gray-600 rounded-lg   font-semibold text-gray' value="Select One">Select One</option>
                    <option className='bg-gray-600 rounded-lg   font-semibold text-white' value="BillBook">Bill Book</option>
                    <option className='bg-gray-600 rounded-lg  font-semibold text-white' value="Liscence">Driving Liscence</option>
                    <option className='bg-gray-600 rounded-lg  font-semibold text-white' value="JackPass">Jack Pass</option>
                    <option className='bg-gray-600 rounded-lg  font-semibold text-white' value="RoadPermit">Road Permit</option>
                    <option className='bg-gray-600 rounded-lg  font-semibold text-white' value="Others">Others</option>
                  </select>
                </div>





                <div className='flex flex-col mt-3   '>
                  <div className='mt-4'> <label className='text-1xl font-extralight'>Upload Files</label></div>
                  <input type='file' ref={refOuterUploadFile}  accept="image/png, image/jpeg" onChange={handleOuterFileInput}
                    className= ' mt-2 p-2   border rounded-lg text-1xl  font-semibold text-white' name='BlueBook' placeholder='Select BlueBook Image' />
                </div>


                <div className='flex justify-center mt-11 text-lg '>
                  {
                    outerBtnLoading ?
                      <ThreeDots />
                      :
                      <button onClick={() => {
                        handleOuterFileUpload();
                      }} className='bg-teal-800  w-full     p-2 font-semibold rounded-lg hover:bg-blue-800 text-white'>
                        <span className='text-xs'>
                          Save
                        </span>
                      </button>
                  }

                </div>
              </div>

            </div>


            <div className="..."></div>
          </div>

          <div className='grid grid-col-1 p-2 overflow-x-auto  '>
            <div className=" overflow-x-auto    ">

              <button  className='border hover:bg-orange-700 hover:rounded-lg hover:shadow-lg p-2 font-extralight' onClick={() => { getAllOuterVehicleExtraDetail() }}>Click here to loads file</button>
              <table className='  border-collapse w-full  border-spacing-1 min-w-max   text-1xl      '>
                {/* <table class="text-4xl min-w-max border-collapse w-full  "> */}
                <thead >
                  <tr className='bg-teal-700'>
                    <th className="border px-3 py-2 w-20  ">SN</th>
                    <th className="border px-3 py-2  ">File Name</th>
                    <th className="border px-3 py-2  ">Files</th>
                    <th className="border px-3 py-2" >View File</th>
                    <th className="border px-3 py-2  ">Delete</th>

                  </tr>
                </thead>

                {
                  outerDltBtnLoading ?

                    <tr className='   w-2/3 h-10'>

                      <td></td>
                      <td></td>
                      <td className='text-center'>Loading....</td>
                      <td></td>
                      <td></td>
                    </tr>
                    :


                    <tbody className=''>
                      {
                        outerDbFileDetails && outerDbFileDetails.map((object, index) => {
                          return (
                            <tr className='border'>
                              <td className="px-6 py-4 border w-20">{index + 1}</td>
                              <td className="px-6 py-4 border">{object['pdfFileName']}</td>
                              <td className="px-6 py-4 border">{object['pdfType']}</td>
                              <td className="px-6 py-4 border rounded-lg focus:bg-slate-600  text-teal-700"><a href={object['pdfUrl']} target="_blank"><HiEye /></a></td>
                              <td className="px-6 py-4 border">
                                <HiTrash onClick={() => {

                                handleOuterFileDelete(object['docId'], object['pdfType'], object['pdfUrl'], object['pdfFileName'])
                              }} className='cursor-pointer hover:bg-red-600 hover: rounded-lg'></HiTrash></td>

                              {/* <td className="px-6 py-4 border">{object['docId']}</td> */}
                            </tr>
                          )
                        })
                      }
                    </tbody>
                }
              </table>
            </div>

          </div>
        </div>
      </div>
    </div >
  )
}
