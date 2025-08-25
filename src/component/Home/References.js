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
 

export default function References() {
    const [allReferenceNos, setAllReferenceNos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [openAddNewTab, setAddNewTab] = useState(true);
    const [referenceForm, setreferenceForm] = useState({ referenceNo: "", claimOn: "" })
    const { user, userRole } = UserAuth();

    let currentIndex = 0;
    useEffect(() => {
        getALlReferenceNo();
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


    async function getALlReferenceNo() {
        //try catch
        setLoading(true);
        let temp = [];
        try {
            let i = 0;
            const refNo = collection(db, "reference")
            const q = query(refNo, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            let docsLength = querySnapshot.docs.length;
            if (docsLength < 1) {
                setAllReferenceNos([])
            } else {

                setAllReferenceNos([])
                  let i=0;
                 querySnapshot.forEach(async(doc) => {
                    let docData = doc.data();
                    let parseDta = (docData);
                    parseDta.index = docsLength--;
                    temp.push(parseDta)
                     // setAllReferenceNos(prev => [...prev, docData])
                });
                //ihere its a new user
          
               //  exportToJsonFile( refarray, "refarrayx");
                setAllReferenceNos(temp);
            }
            setLoading(false);

        } catch (e) {
            swal({
                title: "Unable to fecth users from database" + e,
                timer: 3000
            })
             
            setLoading(false)
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
    return (

        <div>

            <div className='text-yellow-500 text-xs p-4 font-bold   w-auto  bottom-2  border-2 '>
                <h1 className=' overflow-clip'>Add Reference Number<span className='text-orange-700 font-semibold text-xs'></span> </h1>
            </div>
            {
                openAddNewTab ?
                    <>
                        <div className=' border-dashed border-2 p-2  mt-3'>
                            <h1 className='p-4  font-mono font-bold text-sm text-amber-600'>Unique File No</h1>

                            <div className='p-4'>
                                <div class="mb-4">
                                    <label for="email" class="block mb-2    text-yellow-500 font-bold">New Reference No</label>
                                    <input type="text" placeholder="2079-80-01" value={referenceForm.referenceNo} onChange={(e) => setreferenceForm({ ...referenceForm, referenceNo: e.target.value })} id="email" class="shadow-sm   border-gray-300  text-xs rounded-lg text focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5     text-orange-500 font-bold  " required />
                                </div>

                                <ul class="items-center w-full mt-8 mb-15 text-xs font-medium text-orange-600  border border-gray-200 rounded-lg sm:flex     ">
                                    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                                        <div class="flex items-center pl-3">
                                            <input onChange={(e) => { hadnleRadio(referenceForm.referenceNo, "Vehicle") }} checked={referenceForm && referenceForm.claimON === 'Vehicle'} value="Vehicle" type="radio" name="list-radio" class="w-6 h-6 text-black   border-gray-300   " />
                                            <label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-xs font-medium  text-orange-500  ">Vehicle</label>
                                        </div>
                                    </li>

                                    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r  ">
                                        <div class="flex items-center pl-3">
                                            <input onChange={(e) => { hadnleRadio(referenceForm.referenceNo, "Property") }} checked={referenceForm && referenceForm.claimON === 'Property'} value="Property" type="radio" name="list-radio" class="w-6 h-6 text-black   border-gray-300   " />
                                            <label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-xs font-medium text-orange-500 ">Property</label>
                                        </div>
                                    </li>
                                    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r  ">
                                        <div class="flex items-center pl-3">
                                            <input onChange={(e) => { hadnleRadio(referenceForm.referenceNo, "Others") }} checked={referenceForm && referenceForm.claimON === 'Others'} value="Others" type="radio" name="list-radio" class="w-6 h-6 text-black   border-gray-300   " />
                                            <label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-xs font-medium text-orange-500  ">Others</label>
                                        </div>
                                    </li>
                                </ul>


                                <div className='flex space-x-4 mt-5'>
                                    {saveLoading ? <ThreeDots height="50" width="50" radius="9" color="#4fa94d" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true}
                                    /> : <button onClick={() => addNewRefNo()} type="submit" class="text-white  bg-yellow-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300   rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-green-700 dark:focus:ring-green-800 font-bold">Add and Save</button>}
                                    <button onClick={() => showAddInsTab()} type="submit" class="text-white bg-yellow-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-gray-700 "> Cancel</button>
                                </div>
                            </div>
                        </div>
                    </> :

                    <div>
                        <div onClick={() => showAddInsTab()} className='bg-transparent mt-6 p-4 tex-4xl border-dashed border-2 font-bold  '>
                            <h1 className='w-72  p-3 cursor-pointer hover:bg-green-700 bg-blue-950 font-mono font-bold  rounded-md shadow-md text-xs flex'> <span className='mr-4'> Add New </span><HiPlus className='mt-1' /> </h1>
                        </div>
                    </div>
            }


                <div className=' bg-gray-300 max-w-full p-5 w-full'> 
                   
                    <table className="table-auto  bg-white  mt-7 border-separate   border border-slate-500 ">
                        <thead className='text-sm font-serif text-black font-bold p-4 m-5'>

                            <tr className='bg-[rgb(220,230,243)] cursor-pointer '>
                                <th className='px-2 py-3'>SN</th>
                                <th className='px-2 py-3 text-start'>Insurance Company Name</th>
                                <th className='px-2 py-3 text-start'>Insurance Id</th>
                                <th className='px-2 py-3 text-start'>Remove</th>
                            
                            </tr>
                        </thead>
           
                        <tbody className='text-sm font-normal text-black '>
                    {
                        loading ? <FidgetSpinner
                            visible={true}
                            height="80"
                            width="80"
                            user ariaLabel="dna-loading"
                            wrapperStyle={{}}
                            wrapperClass="dna-wrapper"
                            ballColors={['#ff0000', '#00ff00', '#0000ff']}
                            backgroundColor="#F4442E"
                        /> :
                            records && records.map((e, i) => {


                                return (
                                    <tr className=' bg-white cursor-pointer   hover:bg-gray-300 ' key={i}>
                                        <td className='p-5  '>{e.index}</td>
                                        <td className='p-5 font-semibold '>{e.referenceNo}</td>
                                        <td className='p-5  '> {e.claimON} </td>
                                        <td > <button onClick={() => {
                                            handleDelete(e.referenceNo,  e.claimON, i, e.insurance)
                                        }
                                        } className="outline outline-2 text-black outline-offset-2 p-4 rounded-3xl hover:bg-green-950 " ><HiOutlineTrash className='text-black hover:text-white text-xs' /></button>

                                        </td>
                                    </tr>
                                );
                            })
                    }
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

