import React from 'react'
import { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { getDocs, setDoc,getDoc,query,orderBy } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';
import { doc, deleteDoc } from "firebase/firestore";
import { FidgetSpinner } from 'react-loader-spinner';
import { HiOutlineTrash } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi'
import { addDoc } from 'firebase/firestore';
import { ThreeDots } from 'react-loader-spinner';
import { UserAuth } from '../../context/AuthContext';
import { json } from 'react-router-dom';
import jsonData from '../../refarray.json';
import { limit } from 'firebase/firestore'; 
 

export default function References() {
    const [allReferenceNos, setAllReferenceNos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [openAddNewTab, setAddNewTab] = useState(true);
    const [referenceForm, setreferenceForm] = useState({ referenceNo: "", claimOn: "" })
    const { user, userRole } = UserAuth();

    let currentIndex = 0;
    useEffect(() => {
        getAllReferenceNo();
    }, []);

    let i = 0;
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const recordsPerPage = 15;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = allReferenceNos.slice(firstIndex, lastIndex);
    const npage = Math.ceil(allReferenceNos.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    function showAddInsTab() {
        setAddNewTab(!openAddNewTab)
    }
 
async function getAllReferenceNo() {
    setLoading(true);
    let temp = [];

    try {
        const refNo = collection(db, "reference");
        const q = query(refNo, orderBy("timestamp", "desc"), limit(15));
        const querySnapshot = await getDocs(q);

        const docsLength = querySnapshot.docs.length;

        if (docsLength < 1) {
            setAllReferenceNos([]);
        } else {
            let index = docsLength;

            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                docData.index = index--;
                temp.push(docData);
            });

            setAllReferenceNos(temp);
        }
    } catch (e) {
        swal({
            title: "Unable to fetch users from database: " + e.message,
            timer: 3000
        });
    } finally {
        setLoading(false);
    }
}


  
async function updatetimestamp(){
for (const item of jsonData) {
    console.log(item.referenceNo+"---"+item.timestamp)
 
    const docRef = doc(db, "reference", item.referenceNo); 

    await  setDoc(
            docRef,
             {
              referenceNo :  item.referenceNo,
              timestamp : item.timestamp 
            }, { merge: true });
  }
}

   function exportToJsonFile(data, filename = "data.json") {
  const jsonString = JSON.stringify(data, null, 2); // Pretty print with 2 spaces
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}




    function isAUthorized() {

        if (!user || user.role === "user") {
            swal("Warning !!!", "Unauthorize access", "error");
            return false;
        }
        return true;
    }



    async function handleDelete(id, claimON, index) {

        if (!user || user.role !== "admin") {
            swal("Warning !!!", "Unauthorize access", "error");
            return false;
        }

        try {
            // alert(name + id);
            const x = await swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this !" + id,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            //check the reference information
            
            
            /// check the contain insurance company name
            //after that you cannot delete the information
            swal("Sorry, unable to delete...");
              return;

            if (x) {
              await deleteDoc(doc(db, "reference", id));
                const temp = [...allReferenceNos];
                temp.splice(index, 1)
                setAllReferenceNos(temp);
                //   setAllInsuranceName((prev) => [...prev, { name: insForm.name, id: insForm.id }])
                swal("Your file is Deleted...");
            } else {
                swal("Your file is safe!");
            }
        }
        catch (e) {
            swal("Error", e)

        }
    }
    //////////////

    function hadnleRadio(_refNo, _claimOn) {
        setreferenceForm({ referenceNo: _refNo, claimON: _claimOn })

    }

    async function addNewRefNo() {

        //add a time stamp to asced or decedn
        ////////////////end
        if (!isAUthorized()) { return; };
        try {

            var regEx = /[0-9][0-9][0-9][0-9][-][0-9][0-9][0-9][-]/;
 
   
            if ( referenceForm.claimOn===null || referenceForm.claimON.length < 2) {
                swal("Select claim ON" +referenceForm.claimON)
                return;
            }
 
            if (regEx.test(referenceForm.referenceNo) ) {

            } else {
                swal("Error", "Reference should be in 2080-081-15 format")
                return;
            }

            const alreadyPresent = allReferenceNos.some(ref => ref.referenceNo == referenceForm.referenceNo)
            if (alreadyPresent) {
                swal("Error", "Reference no already present")
                return;
            }
/// check the reference already present
        try {
        const docRef = doc(db, "reference", referenceForm.referenceNo.trim()); // Get document reference
        const docSnap = await getDoc(docRef); // Fetch the document snapshot

        if (docSnap.exists()) {
        
            alert("already code exists");
            console.log(docSnap.data())
            return;
        }  
      } catch (err) {
       
        alert("something error happen while fetching");
      } 

      //to check reference already exists

            const x = await swal({
                title: "Are you sure ?",
                text: "After saved, you will no able to delete the reference No : "+referenceForm.referenceNo ,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            //check the reference information
            
            
            /// check the contain insurance company name
            //after that you cannot delete the information

 

            if (x) {
            setSaveLoading(true);
            let timestamp_current = Date.now();
            await setDoc(doc(db, "reference", referenceForm.referenceNo), {
                claimON: referenceForm.claimON,
                timestamp: timestamp_current,
                referenceNo: referenceForm.referenceNo
            }, { merge: true });
            swal("Hurry", "Successfully Saved!");
            const temp = [...allReferenceNos];
            let anotherTempvariable = [];
            for (var i in temp) {
                temp[i].index = temp[i].index + 1;
                anotherTempvariable.push(temp[i]);

            }
            setAllReferenceNos(anotherTempvariable)
            setAllReferenceNos((prev) => [{ index: 1, referenceNo: referenceForm.referenceNo, claimON: referenceForm.claimON }, ...prev])
            setreferenceForm({ referenceNo: "", claimON: "" });

            setSaveLoading(false);
          
            await setDoc(doc(db, "referenceSuggestion", referenceForm.referenceNo), {            
                referenceNo: referenceForm.referenceNo
            }, { merge: true });
        }
    }
        catch (e) {
            setSaveLoading(false)
            swal({
                title: "Error " + e,
                timer: 3000
            })
        }
    }
/// function for generating the new Reference ID
async function generateReferenceFileNo() {
  try {
     const valuationRef = collection(db, "reference");; 
     const q = query(valuationRef, orderBy("timestamp","desc"), limit(1));
   
     let tempdata=[];
     const querySnapshot= await getDocs(q);
     if (querySnapshot.docs.length >= 1) {      
       querySnapshot.forEach(async (doc) => {  
       let tempValFileNo=doc.data()['referenceNo'];
       let lastno= tempValFileNo.split('-')[2];
       let middle= tempValFileNo.split('-')[1];
       let first= tempValFileNo.split('-')[0];
        
       const num = parseInt(lastno, 10)
       let newAuto=first+"-"+middle+"-"+(num+1).toString();
       const timestamp = Math.floor(Date.now());
       setreferenceForm({ ...referenceForm, referenceNo: newAuto, timestamp:timestamp})
        
       });
      
     
     
    } else {
      // if no document exists, return a default first file no
       
          setreferenceForm({ ...referenceForm, referenceNo: "***"})
    }
  } catch (e) {
    alert(e);
    return null;
  }
}



    return (

        <div>
 
            {
                openAddNewTab ?
                    <>
  <div className="border-2 border-dashed rounded-2xl shadow-sm bg-white p-6 mt-5">
    <h1 className="text-lg font-bold text-black mb-6 border-b pb-2">
      Unique File No
    </h1>

    {/* Input Section */}
<div className="mb-6">
  <label
    htmlFor="referenceNo"
    className="block mb-2 text-sm font-semibold text-black"
  >
    New Reference No
  </label>

  <div className="flex">
    {/* Input box */}
    <input
      disabled
      type="text"
      id="referenceNo"
      placeholder="..."
      value={referenceForm.referenceNo}
      onChange={(e) =>
        setreferenceForm({ ...referenceForm, referenceNo: e.target.value })
      }
      className="flex-1 p-3 text-sm font-semibold text-black border border-gray-300 rounded-l-lg shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
      required
    />

    {/* Button beside input */}
    <button
      type="button"
      onClick={()=>{generateReferenceFileNo()}} // <-- create this function
      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-r-lg focus:ring-2 focus:ring-amber-400"
    >
      Generate
    </button>
  </div>
 

    </div>

    {/* Radio Options */}
    <ul className="flex flex-col sm:flex-row border rounded-lg overflow-hidden divide-y sm:divide-y-0 sm:divide-x border-gray-200 text-sm text-black">
      {["Vehicle", "Property", "Others"].map((option) => (
        <li key={option} className="w-full">
          <div className="flex items-center px-4 py-3">
            <input
              type="radio"
              name="list-radio"
              value={option}
              checked={referenceForm && referenceForm.claimON === option}
              onChange={() => hadnleRadio(referenceForm.referenceNo, option)}
              className="w-5 h-5 text-black border-gray-300 focus:ring-amber-400"
            />
            <label className="ml-3 font-medium text-black">{option}</label>
          </div>
        </li>
      ))}
    </ul>

    {/* Buttons */}
    <div className="flex space-x-4 mt-6">
      {saveLoading ? (
        <ThreeDots
          height="40"
          width="40"
          radius="9"
          color="#f59e0b"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      ) : (
        <button
          onClick={() => addNewRefNo()}
          type="button"
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-500 focus:ring-2 focus:ring-amber-300"
        >
          Add & Save
        </button>
      )}
      <button
        onClick={() => showAddInsTab()}
        type="button"
        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gray-500 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300"
      >
        Cancel
      </button>
    </div>
  </div>
</> :

                    <div>
                        <div onClick={() => showAddInsTab()} className='bg-transparent mt-6 p-4 tex-4xl border-dashed border-2 font-bold  '>
                            <h1 className='w-72  p-3 cursor-pointer hover:bg-green-700 bg-blue-950 font-mono font-bold  rounded-md shadow-md text-xs flex'> <span className='mr-4'> Add New </span><HiPlus className='mt-1' /> </h1>
                        </div>
                    </div>
            }


                <div className=' bg-gray-300 text-black max-w-full p-5 w-full'> 
<h1>Last 10 rows</h1>
         <table className="w-full mt-7 border-collapse rounded-xl overflow-hidden shadow-lg bg-white">
  <thead className="bg-gradient-to-r from-amber-100 to-amber-200 text-sm text-black font-semibold">
    <tr>
      <th className="px-4 py-3 text-center">SN</th>
      <th className="px-4 py-3 text-left">Insurance Company Name</th>
      <th className="px-4 py-3 text-left">Insurance Id</th>
      <th className="px-4 py-3 text-center">Remove</th>
    </tr>
  </thead>

  <tbody className="text-sm text-gray-700">
    {loading ? (
      <tr>
        <td colSpan="4" className="text-center py-6">
          <FidgetSpinner
            visible={true}
            height="60"
            width="60"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="mx-auto"
            ballColors={["#ff0000", "#00ff00", "#0000ff"]}
            backgroundColor="#F4442E"
          />
        </td>
      </tr>
    ) : (
      records &&
      records.map((e, i) => (
        <tr
          key={i}
          className="even:bg-gray-50 odd:bg-white hover:bg-amber-50 transition-colors"
        >
          <td className="px-4 py-3 text-center font-medium">{e.index}</td>
          <td className="px-4 py-3 font-semibold">{e.referenceNo}</td>
          <td className="px-4 py-3">{e.claimON}</td>
          <td className="px-4 py-3 text-center">
            <button
              onClick={() =>
                handleDelete(e.referenceNo, e.claimON, i, e.insurance)
              }
              className="p-2 rounded-full bg-red-100 hover:bg-red-500 transition-colors"
            >
              <HiOutlineTrash className="text-red-600 hover:text-white text-lg" />
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

            </div>
          

            <div>
                <nav>
                    <ul className=' flex justify-center items-center p-1 mt-6  bg-transparent border-2 border-dotted'>
                          <li className='p-3 text-xs'><a href="#" className='PageLink' onClick={prePage}>Prev</a> </li>
                            {numbers.map((n, i) => (<li key={i} className={currentPage === n ? "bg-green-500" : "bg-transparent"}>
                            <a className='p-3 text-xs' href='#' onClick={() => changePage(n)}>{n}</a>
                        </li>))}
                        <li className='p-3 text-xs'><a href="#" className='PageLink' onClick={nextPage}>Next</a> </li>
                    </ul>
                </nav>
            </div>
        </div>
    )

    function nextPage() {
        if (currentPage !== lastIndex) {
            setCurrentPage(currentPage + 1);
            setCurrentPageIndex(currentPage)

        }


    }
    function prePage() {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
            setCurrentPageIndex(currentPage)
        }

    }
    function changePage(id) {
        setCurrentPage(id);
        setCurrentPageIndex(currentPage)
    }
}

