import React, { } from 'react'
import { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { getDocs, setDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../../../firebase/Firebase';
import { doc, deleteDoc } from "firebase/firestore";
import { FidgetSpinner } from 'react-loader-spinner';
import { ThreeDots } from 'react-loader-spinner';
import { updateDoc } from "firebase/firestore";

export default function FileDetails({ selectedRef, setOpenEditTab, callbackRefNo }) {
    const [insuranceName, setAllInsuranceName] = useState([]);
    const [loading, setLoading] = useState(false);
    const [insCompanyState, setInsCompanyState] = useState(selectedRef.insurance);
    const [claimTypeState, setClaimTypeState] = useState(selectedRef.claimType);

    const [form, setform] = useState({
        // referenceNo: selectedRef.referenceNo && selectedRef.referenceNo !== "" ? selectedRef.referenceNo : "",
        // claimOn: selectedRef.claimOn && selectedRef.inusrance !== "" ? selectedRef.claimOn : "",
        // inusrance: selectedRef.inusrance && selectedRef.inusrance !== "" ? selectedRef.insurance : "",
        // claimType: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // insured: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // insuredCustName: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // lossTo: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // policyNo: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // claimNo: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // representativeName: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // representativeContact: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // vehicleNo: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",
        // fileReceiptDate: selectedRef.claimOn && selectedRef.claimOn !== "" ? selectedRef.claimOn : "",

        referenceNo: selectedRef.referenceNo,
        // claimOn: "",
        insurance: selectedRef.insurance && selectedRef.insurance !== "" ? selectedRef.insurance : "",
        claimType: selectedRef.claimType && selectedRef.claimType !== "" ? selectedRef.claimType : "",
        insured: selectedRef.insured && selectedRef.insured !== "" ? selectedRef.insured : "",
        insuredCustName: selectedRef.insuredCustName && selectedRef.insuredCustName !== "" ? selectedRef.insuredCustName : "",
        policyNo: selectedRef.policyNo && selectedRef.policyNo !== "" ? selectedRef.policyNo : "",
        claimNo: selectedRef.claimNo && selectedRef.claimNo !== "" ? selectedRef.claimNo : "",
        incidentDate: selectedRef.incidentDate && selectedRef.incidentDate !== "" ? selectedRef.incidentDate : "",
        representativeName: selectedRef.representativeName && selectedRef.representativeName !== "" ? selectedRef.representativeName : "",
        representativeContact: selectedRef.representativeContact && selectedRef.representativeContact !== "" ? selectedRef.representativeContact : "",
        vehicleNo: selectedRef.vehicleNo && selectedRef.vehicleNo !== "" ? selectedRef.vehicleNo : "",
        fileIntroDate: selectedRef.fileIntroDate && selectedRef.fileIntroDate !== "" ? selectedRef.fileIntroDate : "",
    });

    const claimTypes = ['Motor', 'Fire', 'Marine', "Agriculture", "Dynamic","CAR", "CPM","Property","Others"]

    useEffect(() => {
        if (insuranceName.length < 1) {
            // swal({ text: "Loading", timer: 3000 })
            getALlInsuranceName();
        } else {

        }

    }, []);

    async function editAndSave() {
        try {
            //   setLoading(true);

            // const alreadyPresent = insuranceName.some(ref => ref.name === form.insurance);
            // if (!alreadyPresent) {
            //     swal("Null", "Please select insurance company")
            //     return;
            // }
            // alert("Insurance" + form.inusrance);
            // alert("claim Type" + form.claimType);
            // const alreadyPresentclaimType = claimTypes.includes(form.claimType);
            // if (!alreadyPresentclaimType) {
            //     swal("Null", "Please select claim type")
            //     return;
            // }

            // if (form.insured === "") {
            //     swal("Null", "Select insured type")
            //     return;
            // }



            //************************FORM */
         
            if (form.insurance === "Choose One") {
                swal("Error", "Please select the correct insurance name")
                return;
            }

            if (form.claimType === "Choose One") {
                swal("Error", "Please select the correct  claimType")
                return;
            }

            if (!form.insured) {
                swal("Error", "Please select insured")
                return;
            }


            setLoading(true);
            const userDocRef = doc(db, "reference", selectedRef.referenceNo);
            await updateDoc(userDocRef, form, { merge: true });
            //   await setDoc(userDocRef, form, { merge: true })
            swal("Success !!!", "User information updated... Please refresh", "success");

            if(selectedRef.insurance===form.insurance){
              
            
            }else{
                await setDoc(doc(db, "referenceSuggestion", form.referenceNo), {            
                    insurance: form.insurance,
                    referenceNo:form.referenceNo
                }, { merge: true });
                 
            }
 

            // const newState = allReferenceNos.map((refObj) => {
            //     if (refObj.referenceNo === form.referenceNo) {
            //         return { ...refObj, form };
            //     }
            //     return refObj
            // })

            // setAllReferenceNos(newState);
            // alert(allReferenceNos.length);
             //check the old insurance company name and new insurance company name

            setLoading(false);
            selectedRef.insuredCustName=form.insuredCustName;
            selectedRef.insurance=form.insurance;
            selectedRef.claimType=form.claimType;
            selectedRef.representativeName=form.representativeName;
            selectedRef.incidentDate=form.incidentDate;
            selectedRef.representativeContact=form.representativeContact;
            selectedRef.vehicleNo=form.vehicleNo;
            selectedRef.policyNo=form.policyNo;
            selectedRef.insured=form.insured;
            selectedRef.claimNo=form.claimNo;
            selectedRef.fileIntroDate=form.fileIntroDate;
            callbackRefNo(selectedRef.referenceNo);

        }
        catch (e) {
            swal(e)
        }
    }

    async function getALlInsuranceName() {
        setLoading(true);
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
            setLoading(false);

        } catch (e) {
            swal({
                title: "Unable to fecth users from database" + e,
                timer: 3000
            })
            setLoading(false)
        }
    }
    const defaultSelectValue = "Select a fruit";
    const [selected, setSelected] = useState("Orange")

    return (
         
        <div className='bg-white p-6 w-2/3 shadow-lg shadow-gray-300   border-2 text-sm border-gray-400 '>
            <h1 className='text-sm  text-black font-semibold'>Manage File No <span className='underline ml-0'> {selectedRef.referenceNo}</span>
                <span onClick={() => { setOpenEditTab(false) }} className='text-xs ml-3 border  shadow-md shadow-gray-400 rounded-lg p-2 hover:bg-slate-100 text-green-600 cursor-pointer'>Go Back</span>
            </h1>
            <div class="grid grid-cols-2  gap-5">
                <div className='flex flex-col pt-4'>
                    <label for="first_name" className=" mb-2  text-xs font-bold text-gray-500">Insurance Company</label>
                    <select value={insCompanyState} onChange={
                        (e) => {
                            setInsCompanyState(e.target.value)
                            setform({ ...form, insurance: e.target.value })
                        }
                    } className='text-xs p-2  bg-gray-200 rounded text-black focus:rounded' >
                        <option key={"Choose One"} value={"Choose One"}>Choose One</option>
                        {
                            insuranceName && insuranceName.map((e, index) => {
                                if (e.name.trim() === "Abc Enterprises")
                                    return <option key={index} value={e.name}>{e.name}</option>
                                return <option key={index} value={e.name}>{e.name}</option>
                            })
                        }
                    </select>
                </div>

                <div className='flex flex-col pt-4 pb-4'>
                    <label for="first_name" class=" mb-2 text-xs font-bold text-gray-500 ">Type of claim</label>
                    <select value={claimTypeState} defaultValue={'Select One'} onChange={
                        (e) => {
                            setClaimTypeState(e.target.value)
                            setform({ ...form, claimType: e.target.value })
                        }
                    } className='text-xs p-2 rounded  bg-gray-200  text-black focus:rounded' name="cars" id="cars">
                        <option value="Choose One" selected>Choose One</option>
                        {
                            claimTypes.map((e, index) => {
                                if (e === "Marinecd")
                                    return <option key={index} selected value={e}>{e}</option>
                                return <option key={index} value={e}>{e}</option>
                            })
                        }
                    </select>
                </div>

                <div >
                    <label for="first_name" class="mt-4  mb-4 text-xs font-bold text-gray-500" >Insured (विमित ) </label>
                    <ul class="items-center w-full mt-2 mb-15 rounded-lg font-medium text-gray-900 bg-gray-200  border border-gray-200 sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <li class="w-full border-b rounded-lg  border-gray-200 sm:border-b-0 sm:border-r dark:  bg-gray-200">
                            <div class="flex items-center pl-3">
                                <input value="bank" type="radio" onChange={(e) => setform({ ...form, insured: e.target.value })} checked={form.insured === "bank"} name="list-radio" class="w-6 h-6 text-black text-xs  border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-700  " />
                                <label for="horizontal-list-radio-license" class="w-full py-2 ml-5 text-xs font-medium text-black dark:text-black">Bank</label>
                            </div>
                        </li>

                        <li class="w-full  rounded-lg   border-b border-gray-200 sm:border-b-0 sm:border-r dark:  bg-gray-200">
                            <div class="flex items-center pl-3">
                                <input value="customer" type="radio" onChange={(e) => setform({ ...form, insured: e.target.value })} checked={form.insured === "customer"} name="list-radio" class="w-6 h-6 text-black   border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-700  " />
                                <label for="horizontal-list-radio-license" class="w-full py-2 ml-2 text-xs font-medium text-black dark:text-black">Customer</label>
                            </div>
                        </li>

                        <li class="w-full border-b rounded-lg  border-gray-200 sm:border-b-0 sm:border-r dark:  bg-gray-200">
                            <div class="flex items-center pl-3">
                                <input value="company" type="radio" onChange={(e) => setform({ ...form, insured: e.target.value })} checked={form.insured === "company"} name="list-radio" class="w-6 h-6 text-black  text-xs border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-700  " />
                                <label for="horizontal-list-radio-license" class="w-full py-2 ml-2 text-xs font-medium text-black dark:text-black">Company</label>
                            </div>
                        </li>




                    </ul>
                </div>
                {/* lets insured owner name */}

                <div className='flex flex-col pt-4'>
                    <label for="first_name" class=" mb-2  text-xs font-bold text-gray-500 ">Insured Cust Name</label>
                    <input type='text' value={form.insuredCustName} onChange={(e) => setform({ ...form, insuredCustName: e.target.value })} placeholder='Eg. Insured Person or Bank' className="rounded-lg p-2 placeholder:text-gray-500 bg-gray-200   text-xs text-black" />
                </div>



                <div className='flex flex-col pt-4'>
                    <label for="first_name" placeholder='Policy No' class=" mb-2  text-xs font-bold text-gray-500">Policy No</label>
                    <input type='text' value={form.policyNo} placeholder='Pol-23' onChange={(e) => setform({ ...form, policyNo: e.target.value })} className="rounded-lg p-2 text-xs text-black placeholder:text-gray-500 bg-gray-200 " />
                </div>

                <div className='flex flex-col pt-4'>
                    <label for="first_name" placeholder='Policy No' class=" mb-2  text-xs font-bold text-gray-500">Claim No (opt)</label>
                    <input type='text' value={form.claimNo} placeholder='12/23/12' onChange={(e) => setform({ ...form, claimNo: e.target.value })} className="rounded-lg p-2 text-xs text-black placeholder:text-gray-500 bg-gray-200 " />
                </div>



                <div className='flex flex-col pt-4'>
                    <label for="first_name" placeholder='Policy No' class=" mb-2 text-xs font-bold text-gray-500">Representative Name</label>
                    <input type='text' value={form.representativeName} placeholder='Ex. Mamata Yadav' onChange={(e) => setform({ ...form, representativeName: e.target.value })} className="rounded-lg p-2 text-xs text-black placeholder:text-gray-500 bg-gray-200 " />
                </div>

                <div className='flex flex-col pt-4'>
                    <label for="first_name" placeholder='Policy No' class=" mb-2  text-xs font-bold text-gray-500">Contact of Representative</label>
                    <input type='text' value={form.representativeContact} placeholder='9844734458' onChange={(e) => setform({ ...form, representativeContact: e.target.value })} className="rounded-lg p-2 text-xs text-black  placeholder:text-gray-500 bg-gray-200 " />
                </div>

                <div className='flex flex-col pt-4'>
                    <label for="first_name" placeholder='Policy No' class=" mb-2  text-xs font-bold text-gray-500">Vehicle No</label>
                    <input type='text' value={form.vehicleNo} placeholder='Ba/1/jha/2015' onChange={(e) => setform({ ...form, vehicleNo: e.target.value })} className="rounded-lg p-2 text-xs text-black placeholder:text-gray-500 bg-gray-200 " />
                </div>


                <div className='flex flex-col pt-4'>
                    <label for="first_name" placeholder='Policy No' class=" mb-2  text-xs font-bold text-gray-500">Date of Loss</label>
                    <input type='date' value={form.incidentDate} placeholder='2072-12-15' onChange={(e) => setform({ ...form, incidentDate: e.target.value })} className='p-2 text-xs w-full rounded  placeholder:text-gray-500 text-black bg-gray-200 ' />
                </div>

                <div className='flex flex-col pt-4'>
                    <label for="first_name" placeholder='Policy No' class=" mb-2  text-xs font-bold text-gray-500">File Introduction Date</label>
                    <input type='date' value={form.fileIntroDate} placeholder='2072-12-15' onChange={(e) => setform({ ...form, fileIntroDate: e.target.value })} className='p-2 text-xs w-full rounded  placeholder:text-gray-500 text-black bg-gray-200 ' />
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
                        <button className='bg-green-700 w-52 shadow-md shadow-gray-400 text-xs p-3 mt-5 hover:bg-purple-500 border rounded-lg  ' onClick={() => {
                            { editAndSave(); }
                        }}> Save</button>
                    }
                </div>
        

            </div>
            {/* ######################################### */}


         <div className='h-7'>

         </div>
        <div className=' max-w-screen-2xl overflow-x-scroll text-black '>
            <table   className=' border-collapse w-full  border-spacing-1 min-w-max  text-xs '>
                    <thead >
                  <tr className='bg-slate-300'>
                    <th className="border px-3 py-2 w-20  ">SN</th>
                    <th className="border px-3 py-2  ">Insurance Company</th>
                    <th className="border px-3 py-2  ">Insured</th>
                    <th className="border px-3 py-2" >Insured Cust Name</th>
                    <th className="border px-3 py-2  ">Polciy No</th>
                    <th className="border px-3 py-2  ">Claim No</th>
                    <th className="border px-3 py-2  ">Claim Type</th>
                    <th className="border px-3 py-2  ">Rep Name</th>
                    <th className="border px-3 py-2  ">Contact Represent</th>
                    <th className="border px-3 py-2  ">Vehicle No</th>
                    <th className="border px-3 py-2  ">Date of Loss</th>
                    <th className="border px-3 py-2  ">File Introduction Date</th>
              
                   
                  </tr>
                </thead>
                     {
                      false ?
                      <tr className='   w-2/3 h-10'>
                       <td></td>
                       <td></td>
                      <td className='text-center'>Loading....</td>
                      <td></td>
                      <td></td>
                      </tr>
                        :
           
                      <tbody>
                      {
                    <tr className='border '>  
                     
                     <td className='pt-4 pb-4 w-28 text-center'>1.</td>
                     <td className=' px-3 py-2 border'>{selectedRef.insurance}</td>
                     <td className=' px-3 py-2 border'>{selectedRef.insured}</td>
                     <td className=' px-3 py-2 border   '><div className='max-w-lg overflow-x-auto'> <p>{selectedRef.insuredCustName}</p></div></td>
                     <td className=' px-3 py-2 border'>{selectedRef.policyNo}</td>
                     <td className=' px-3 py-2 border'>{selectedRef.claimNo}</td>
                     <td className=' px-3 py-2 border'>{selectedRef.claimType}</td>
                     <td className=' px-3 py-2 border'>{selectedRef.representativeName}</td>
                     <td className=' px-3 py-2 border'>{selectedRef.representativeContact}</td>
                     <td className=' px-3 py-2 border'>{selectedRef.vehicleNo}</td>
                     <td className=' px-3 py-2 border'>{selectedRef.incidentDate}</td>
                     <td className=' px-3 py-2 border'>{selectedRef.fileIntroDate}</td>
                     
                    </tr>

                      }
                     
                      </tbody>
                }
                    </table>
                </div>
    </div>
           
    )
}
