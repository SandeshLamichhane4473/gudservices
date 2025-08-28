import React, { useEffect, useState } from 'react'
import { HiRefresh, HiSearch } from 'react-icons/hi';
import { HiStatusOnline } from 'react-icons/hi';
import { HiChevronDown } from 'react-icons/hi';
import { HiOutlineRefresh } from 'react-icons/hi';
import { collection, getDocs, doc, getDoc,orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/Firebase';
import swal from 'sweetalert';
import EditFiles from './EditFiles';
import { UserAuth } from '../../../context/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ThreeCircles } from 'react-loader-spinner';
import Select from 'react-select';
import { HiBan } from 'react-icons/hi';
import { HiCheck } from 'react-icons/hi';
import { HiBadgeCheck } from 'react-icons/hi';
import { useReactToPrint } from 'react-to-print';
import ReactToPrint from "react-to-print";
import { useRef } from 'react';
  import { HiEye } from 'react-icons/hi';
  import {AiOutlineForm}  from 'react-icons/ai';

  import { query } from 'firebase/firestore';
import { where } from 'firebase/firestore';
export default function ViewFiles() {

    const [allReferenceNos, setAllReferenceNos] = useState([]);
    const [allsearchedReferenceNos, setAllSearchedRefNos] = useState([]);
    const [showModal, setShowModal] = useState(false);



    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selected, setSelected] = useState("");
    const [open, setOpen] = useState(false);
    const [openEditTab, setOpenEditTab] = useState(false);
    const [selectedRederence, setSelectedReference] = useState(false);
    const [selectedLoading, setSelectedLoading] = useState("")
    const { user, userRole } = UserAuth();
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setMyoption] = useState([]);
    const [optionInsurances, setOptionInsruances] = useState([]);
    const [optionvehicle, setoptionVehicles] = useState([]);
    const [checkedReferences, setCheckedReferences] = useState([]);
    const [currentInsuranceSelected, setCurrentInsuranceSelected] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const recordsPerPage = 15;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = allReferenceNos.slice(firstIndex, lastIndex);
    const npage = Math.ceil(allReferenceNos.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);


    const componentRef = useRef();

    const myOption = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    const myNavigate = useNavigate();

    useEffect(() => {
       
  
        if(user.role==="user" || user.role===undefined){
             myNavigate("/")
        }
        if (allReferenceNos.length === 0)
            getALlReferenceNo();
            setCheckedReferences([]);
    }, []);
 
    function isAUthorized() {
        if (!user || user.role === "user") {
            //   swal("Warning !!!", "Unauthorize access", "error");
            return false;
        }
        return true;
    }

    const geneRatePDF = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User Data",
        onAfterPrint: () => setCheckedReferences(prev => [])

    })


    if (!isAUthorized()) {
    
            swal("Warning !!!", "Unauthorize access", "error");
      
   
        return;
    }


    async function getSelectedReferenceNo(_referenceNo) {
        try {
            if (!_referenceNo) {
                alert("Reference is null")
                return;
            }
            const docRef = doc(db, "reference", _referenceNo);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const docData = docSnap.data();
                const newState = allReferenceNos.map((refObj) => {
                    if (refObj.referenceNo === docData.referenceNo) {
                        return docData;
                    }
                    return refObj
                })
                setAllReferenceNos(newState);
                setSelectedLoading("")
            } else {
                console.log("No such document!");
            }
        }
        catch (e) {
            swal(e);
        }
    }

    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    async function handlFeeChecked(event) {
        if (event.target.checked) {

            try {
                const filterList = allsearchedReferenceNos.filter((item) => {
                    return item.insurance === currentInsuranceSelected && item.actualFeePaid > 0
                })
                setAllReferenceNos(filterList)
            }
            catch (e) {
                swal(e);
            }
        } else {
            try {
                const filterList = allsearchedReferenceNos.filter((item) => {
                    return item.insurance === currentInsuranceSelected && !item.actualFeePaid || item.actualFeePaid < 100
                })
                setAllReferenceNos(filterList)
            }
            catch (e) {
                swal(e);
            }

        }
    }

    function isReferenceonCheckedList(refNo) {
        const filteredReference = checkedReferences.filter((e) => e.referenceNo === refNo);
        if (filteredReference[0]) {
            return true;
        }
        else {
            return false
        }
    }

    function handleCheckedBox(event) {
        //   alert(event.target.value);
        if (event.target.checked) {
            //  setoptionVehicles(prev => [...prev, { value: parseDta.vehicleNo, label: parseDta.vehicleNo }]);
            const filterList = allsearchedReferenceNos && allsearchedReferenceNos.filter((item) => {
                return item.referenceNo === event.target.value
            })
            setCheckedReferences(prev => [...prev, filterList[0]]);
            //  setCheckedReferenceNos(docData)
        }
        else {
            setCheckedReferences(
                //checkedReferenceNos.filter((e) => e !== event.target.value)
                checkedReferences.filter((e) => e.referenceNo !== event.target.value)
            )
        }

    }


    async function getALlReferenceNo() {
        //try catch
        setLoading(true);
        let temp = [];
        let tempInsurance = [];
        try {
            let i = 0;
            
        //add ascensing order
            const refNo = collection(db, "reference")
            const q = query(refNo, orderBy("timestamp", "desc"));
            

            const querySnapshot = await getDocs(q);
            let docsLength = querySnapshot.docs.length;
            setMyoption([]);
            setOptionInsruances([])
            setAllReferenceNos([])
            setAllSearchedRefNos([])
            setoptionVehicles([])
            setCheckedReferences([])
            if (docsLength < 1) {

            } else {
                querySnapshot.forEach((doc) => {
                    let docData = doc.data();
                    let parseDta = (docData);
                    parseDta.index = docsLength--;
                    temp.push(parseDta)
                    tempInsurance.push({ value: parseDta.insurance, label: parseDta.insurance })
                    setMyoption(prev => [...prev, { value: parseDta.referenceNo, label: parseDta.referenceNo }])
                    setoptionVehicles(prev => [...prev, { value: parseDta.vehicleNo, label: parseDta.vehicleNo }])
                    // const x = optionsInsurance.some(obj => obj.value === parseDta.insurance)
                    // if (!x) {
                    //     setmyOptionInsurance(prev => [...prev, { value: parseDta.insurance, label: parseDta.insurance }])
                    // }
                    //ifsa (alreadyExists.length < 1)
                    // setAllReferenceNos(prev => [...prev, docData])
                });
                //ihere its a new user
             
                setAllReferenceNos(temp);
                setAllSearchedRefNos(temp);
                let x = getUnique(tempInsurance, 'value')
                setOptionInsruances(x);
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

    function getUnique(arr, index) {

        const unique = arr
            .map(e => e[index])
            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)
            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }





    async function showSearchResult(e) {
        try {

            // const referenceRef = collection(db, "reference");
            // const q = query(referenceRef, where("referenceNo", "==", e));
            // const querySnapshot = await getDocs(q);
            // querySnapshot.forEach((doc) => {
            //     setAllReferenceNos(prev => [...prev, doc.data()])
            // }); 
            const filterList = allsearchedReferenceNos.filter((item) => {
                return item.referenceNo === e
            })
            setAllReferenceNos(filterList)
        }
        catch (e) {
            swal(e)

        }
    }

    async function showSearchResultOnInsurance(_value) {
        setCurrentInsuranceSelected(_value)
        try {
            const filterList = allsearchedReferenceNos.filter((item) => {
                return item.insurance === _value
            })
            setAllReferenceNos(filterList)
        }
        catch (e) {
            swal(e);
        }
    }
    async function handlePrintofReference() {
        setShowModal(true)

        if (checkedReferences.length < 1) {

        } else {

        }
    }


    async function showSearchResultonVehicle(_value) {

        try {
            const filterList = allsearchedReferenceNos.filter((item) => {
                return item.vehicleNo === _value
            })
            setAllReferenceNos(filterList)
        }
        catch (e) {
            swal(e);
        }
    }

    const handleChange = (selectedOption) => {
        this.setState({ selectedOption }, () =>
            console.log(`Option selected:`, this.state.selectedOption)
        );
    };




    const callbackRefNo = (e) => {
        if (e === selectedRederence.referenceNo) {
          
            getSelectedReferenceNo(e);
        }
    }
    return (
       
        <div className='w-full   bg-gray-300 p-2 '>

            {openEditTab ?
                <div>
                  <EditFiles callbackRefNo={callbackRefNo} allReferenceNos={allReferenceNos} setAllReferenceNos={setAllReferenceNos} selectedRef={selectedRederence} setOpenEditTab={setOpenEditTab} className="" />
                   </div> :
                <>
                    <div className=" flex mt-2 mb-2 p-2 rounded shadow-gray-400 shadow-lg bg-white max-w-4xl">
                        <div className='flex   '>
                            <Select className='  w-64 ml-6 text-xs text-black '
                                options={options}
                              
                               
                                placeholder="Select Reference No"
                                defaultSelectValue="Select Reference"
                                isSearchable
                                onChange={(e) =>
                                    showSearchResult(e.value)
                                }
                            />

                            <Select className='w-64 ml-6 text-xs text-black font-normal'

                                options={optionInsurances}

                                placeholder="Inusrance Company"
                                isSearchable
                                onChange={(e) =>

                                    showSearchResultOnInsurance(e.value)
                                }
                            />

                            <Select className='w-64 ml-6 text-xs text-black font-normal'

                                options={optionvehicle}
                                placeholder="Select Vehicle No"
                                isSearchable
                                onChange={(e) =>
                                    showSearchResultonVehicle(e.value)
                                }
                            />
                            {/* <input placeholder='Search Ref No' type="search" className='ml-1 p-3 text-black bg-white border-yellow-950 rounded-lg focus:text-black  text-2xl w-3/4' id="site-search" name="q" /> */}

                        </div>
                    </div >

          <div className='h-6'>

          </div>
                    <div className=" shadow-lg shadow-slate-400 ">

                        <table className=" text-lg text-left text-white dark:text-white border-separate   shadow-lg shadow-gray-400 ">

                            <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-inherit  ">
                                <tr className='bg-blue-100' >
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <HiRefresh onClick={() => getALlReferenceNo()} className='text-xs cursor-pointer rounded hover:bg-orange-700' />
                                            <label for="checkbox-all-search" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-2 py-2   whitespace-nowrap">
                                        REF NO
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        INS
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        VEHI NO
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        ALLOWED
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        REP NAME
                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                        PHONE
                                    </th>
                                    <th scope="col block" className="px-2 py-2 whitespace-nowrap">

                                        <p className='block'> FEE

                                            {/* <input className="  ml-5  " type='checkbox'
                                                value="paid"
                                                // checked={isChecked}
                                                onChange={handlFeeChecked}
                                            /> */}
                                        </p>

                                    </th>
                                    <th scope="col" className="px-2 py-2 whitespace-nowrap">
                                         Status
                                    </th>
                                    <th scope="col" className="px-2 py-2">
                                        View
                                    </th>
                                    <th scope="col" className="px-2 py-2">
                                        Edit
                                    </th>
                                    {/* <th scope="col" className="px-2 py-2">
                                        <button onClick={() => {
                                            handlePrintofReference()
                                        }
                                        } className='p-2 bg-green-950 rounded shadow-lg cursor-pointer hover:bg-gray-800'> Print</button>
                                    </th> */}
                                </tr>
                            </thead>
                            {loading ?
                                <div className=' flex justify-center  text-center '>
                                    < ThreeCircles
                                        className=" "
                                        height="50"
                                        width="50"
                                        radius="9"
                                        color="#4fa94d"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClassName="">

                                    </ThreeCircles> </div> :

                                <tbody className='bg-white text-xs font-normal text-black cursor-pointer'>

                                    {                                        records.map((e, index) => {
                                            return (
                                                <tr key={index} className="bg-white   hover:bg-gray-200">
                                                    <td className="w-4 p-4">

                                                        {e.referenceNo === selectedLoading ?
                                                            < ThreeCircles
                                                                className="ml-3"
                                                                height="15"
                                                                width="15"
                                                                radius="9"
                                                                color="#4fa94d"
                                                                ariaLabel="three-dots-loading"
                                                                wrapperStyle={{}}
                                                                wrapperClassName="">

                                                            </ThreeCircles> :
                                                            <HiOutlineRefresh onClick={() => {
                                                                setSelectedLoading(e.referenceNo)
                                                                getSelectedReferenceNo(e.referenceNo)
                                                            }
                                                            } className=' hover:text-orange-500 hover:text-2xl ' />
                                                        }
                                                    </td>
                                                    <th scope="row" className="px-2 py-2px  font-semibold text-gray-900 whitespace-nowrap ">
                                                        {e.referenceNo}
                                                    </th>
                                                    <td scope="row" className="px-2 py-2  whitespace-nowrap ">
                                                        <p className=''>{e.insurance?.substring(0, 25)} </p>
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        {e.vehicleNo}
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        {e.fileIntroDate}
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        {e.representativeName && e.representativeName.length > 11 ?
                                                            e.representativeName.slice(0, 12) : e.representativeName
                                                        }
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        {e.representativeContact && e.representativeContact.length > 11 ?
                                                            e.representativeContact.slice(0, 12) + '...' : e.representativeContact
                                                        }
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        {e.expectedFee}
                                                    </td>

                                                    <td className="px-2 py-2 ">

                                                        {

                                                            !e.expectedFee || !e.actualFeePaid || e.actualFeePaid === "" || e.actualFeePaid === 0
                                                                ?
                                                                <HiBan className='text-3xl text-purple-800' /> :
                                                                <HiBadgeCheck className='text-3xl text-green-950' />


                                                        }
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                        onClick={()=>{
                                                          
                                                        }}
                                                        className="font-bold text-blue-600 dark:text-blue-500 hover:underline" >
                                                          
                                                          <Link to={"/newins/view/"+ e.referenceNo  } state={"hellow"}  ><HiEye /></Link>
                                                        </button>
                                                    </td>
                                                    <td className=" items-center px-2 py-2space-x-3">
                                                        <button onClick={() => {
                                                            setSelectedReference(e);
                                                            setOpenEditTab(true)
                                                            setCheckedReferences([]);
                                                        }}> <a href="#" className="font-bold text-blue-600 dark:text-blue-500 hover:underline">  <AiOutlineForm />
                                                        </a></button>

                                                    </td>
{/* 
                                                    <td className="px-2 py-2 ">
                                                        <p><input type='checkbox'
                                                            value={e.referenceNo}
                                                            checked={isReferenceonCheckedList(e.referenceNo)}
                                                            onChange={handleCheckedBox}
                                                        /></p>
                                                    </td> */}
                                                </tr>

                                            );

                                        })
                                    }

                                </tbody>
                            }
                        </table>
  <div className='h-4'>

  </div>
                        <nav className='bg-white shadow-sm rounded-lg shadow-gray-300 text-black'>
                            <ul className=' flex justify-center items-center p-2 mt-2  bg-transparent border-2 border-dotted'>
                                <li className='p-2 text-1xl'><a href="#" className='PageLink' onClick={prePage}>Prev</a> </li>
                                {numbers.map((n, i) => (<li key={i} className={currentPage === n ? "bg-green-500" : "bg-transparent"}>
                                    <a className='p-2 text-1xl' href='#' onClick={() => changePage(n)}>{n}</a>
                                </li>))}
                                <li className='p-2 text-1xl'><a href="#" className='PageLink' onClick={nextPage}>Next</a> </li>
                            </ul>
                        </nav>
                    </div>
                </>
            }

            <>
                <div className={`${checkedReferences.length < 1 ? 'hidden' : ''}`}>
                    <button className=' p-5 mt-5 bg-orange-700 text-white rounded-xl shadow-black  hover:bg-green-600 hover:text-red-100' onClick={geneRatePDF}>
                        Print Paper
                    </button>
                </div>


                <div ref={componentRef} className={`${checkedReferences.length < 1 ? 'hidden' : ''}`}>

                    <div className='text-gray-950 bg-white text-1xl p-11 font-serif '>

                        {
                            checkedReferences.length > 0 && checkedReferences.map((e) => {
                                return (
                                    <>
                                        <div className='font-bold mt-5 p-5 text-1xl mb-5'>
                                            {
                                                e.insurance && e.insurance
                                            }


                                            <div class="grid grid-cols-2 border  p-5">
                                                <div className=''>
                                                    <p className='text-1xl font-bold underline'>File Detail</p>
                                                    <div className=' text-1xl space-x-2'>
                                                        <p className='ml-2'> <span className='font-semibold mr-2'> Reference No : </span> <span className='font-normal'>   {e.referenceNo} </span></p>
                                                        <p className=''> <span className='font-semibold mr-2'> Insured Name : </span> <span className='font-normal'>  {e.insuredCustName}</span>   </p>
                                                        <p className=''> <span className='font-semibold mr-2'> Insured :</span> <span className='font-normal'>  {e.insured} </span>  </p>
                                                        <p className=''> <span className='font-semibold mr-2'>Claim Type :</span>  <span className='font-normal'>  {e.claimType} </span>  </p>
                                                        <p className=''> <span className='font-semibold mr-2'>Policy No :</span> <span className='font-normal'>   {e.policyNo}</span>   </p>
                                                        <p className=''> <span className='font-semibold mr-2'> Claim No :</span>  <span className='font-normal'>   {e.claimNo} </span>  </p>
                                                        <p className=''> <span className='font-semibold mr-2'> Vehicle No : </span> <span className='font-normal'>   {e.vehicleNo} </span>  </p>
                                                        <p className=''> <span className='font-semibold mr-2'> Insured Representative :</span> <span className='font-normal'>    {e.representativeName} </span>  </p>
                                                        <p className=''> <span className='font-semibold mr-2'> Rep. Contact :</span>  <span className='font-normal'>  {e.representativeContact}</span>   </p>
                                                    </div>
                                                </div>
                                                <div className='text-1xl font-normal'>
                                                    <p className='text-1xl font-bold underline'>Survey Details</p>
                                                    <p><span className='font-semibold mr-2'> First Survey Date :</span> <span className='font-normal'>  {e.firstSurveyDate && e.firstSurveyDate}</span> </p>
                                                    <p><span className='font-semibold mr-2'> Second Survey Date  :</span> <span className='font-normal'> {e.secondSurveyDate && e.secondSurveyDate}</span> </p>
                                                    <p><span className='font-semibold mr-2'> Third Survey Date : </span> <span className='font-normal'>  {e.thirdSurveyDate && e.thirdSurveyDate}</span> </p>
                                                    <p><span className='font-semibold mr-2'> After Survey Date:</span> <span className='font-normal'>  {e.fterCompleteSUrvey && e.fterCompleteSUrvey}</span> </p>
                                                    <p><span className='font-semibold mr-2'> Place of Survey :</span> <span className='font-normal'>  {e.placeofSurvey && e.placeofSurvey}</span> </p>
                                                    <p><span className='font-semibold mr-2'> Estimation : </span> <span className='font-normal'> {e.estimation && e.estimation}</span> </p>
                                                    <p><span className='font-semibold mr-2'> Surveyor : </span> <span className='font-normal'> {e.surveyor && e.surveyor}</span> </p>
                                                    <p><span className='font-semibold mr-2'> Loss to : </span> <span className='font-normal'> {e.lossTo && e.lossTo}</span> </p>
                                                    <p><span className='font-semibold mr-2'> Remarks :</span>  <span className='font-normal'> {e.dateRemarks && e.dateRemarks}</span> </p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div class="grid grid-cols-2 border  p-5">
                                                <div className=''>
                                                    <p className='text-1xl font-bold underline'>Fee Details</p>
                                                    <div className=' text-1xl space-x-2'>
                                                        <p className='ml-2'> <span className='font-semibold mr-2'> Expected Fee : </span> <span className='font-normal'>    {e.expectedFee && e.expectedFee}</span> </p>
                                                        <p className=''> <span className='font-semibold mr-2'> Actual Fee  : </span> <span className='font-normal'>   {e.actualFeePaid && e.actualFeePaid} </span></p>
                                                        <p className=''> <span className='font-semibold mr-2'> Fee Payement Date   :</span>  <span className='font-normal'>  {e.feeReceiptDate && e.feeReceiptDate} </span></p>
                                                    </div>
                                                </div>
                                                <div className='text-1xl font-normal'>
                                                    <p className='text-1xl font-bold underline'>Date</p>
                                                    <p><span className='font-semibold mr-2'> Doc Receipt Date :</span> <span className='font-normal'> {e.fileReceiptDate && e.fileReceiptDate}</span></p>
                                                    <p><span className='font-semibold mr-2'> Date of Loss :</span> <span className='font-normal'> {e.incidentDate && e.incidentDate}</span></p>
                                                    <p><span className='font-semibold mr-2'> File Submit Date  :</span> <span className='font-normal'> {e.fileSubmitDate && e.fileSubmitDate}</span></p>
                                                    <p><span className='font-semibold mr-2'> Photo url  : </span>
                                                        <ul>
                                                            {/* {
                                                                e.pdfUrl && e.pdfUrl.map((ex, index) => {
                                                                    return <li key={index}><a href={ex} className='text-sky' target='_blank' alt="ds">{index + 1}</a></li>
                                                                })
                                                            } */}
                                                        </ul>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>

                                )
                            })
                        }
                    </div>

                </div>

            </>


        </div >
    );






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

const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <div ref={ref}>My cool content here!</div>
    );
});