import React from 'react'
import { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { getDocs, setDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';
import { doc, deleteDoc } from "firebase/firestore";
import { FidgetSpinner } from 'react-loader-spinner';
import { HiOutlineTrash } from 'react-icons/hi';

import { HiPencilAlt } from 'react-icons/hi';

import { HiPlus } from 'react-icons/hi'
import { addDoc } from 'firebase/firestore';
import { ThreeDots } from 'react-loader-spinner';
import { UserAuth } from '../../context/AuthContext';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';


export default function () {
    const [insuranceName, setAllInsuranceName] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [openAddNewTab, setAddNewTab] = useState(false);
    const [openEditewTab, setEditNewTab] = useState(false);
    const [insForm, setInsForm] = useState({ name: "", id: "" })
    const { user, userRole } = UserAuth();
    const [emails, setEmails] = React.useState([]);
    const [focused, setFocused] = React.useState(false);

    const [editInsuranceObject, setEditInsuranceObject] = React.useState({ name: "", id: "", emails: [] })
    useEffect(() => {

        getALlInsuranceName();

    }, []);


    function showAddInsTab() {
        setAddNewTab(!openAddNewTab)
    }
    async function getALlInsuranceName() {
        //try catch
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

    async function editInsuranceObjectAttribute(name, id, index, emails) {
        try {

            if (!user || user.role === "user") {
                swal("Warning !!!", "Unauthorize access", "error");
                return;
            }

            const _insObject = {
                name: name,
                id: id,
                emails: emails
            }
            setEditInsuranceObject(_insObject);

        }
        catch (e) {
            swal(e)
        }
    }


    async function handleDelete(name, id, index) {
        if (!user || user.role === "user" || user.role === "moderator") {
            swal("Warning !!!", "Unauthorize access", "error");
            return;
        }
        try {
            // alert(name + id);
            const x = await swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover " + id,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })

            if (x) {

                await deleteDoc(doc(db, "insurance", id));
                const temp = [...insuranceName];
                temp.splice(index, 1)
                setAllInsuranceName(temp);
                // setAllInsuranceName((prev) => [...prev, { name: insForm.name, id: insForm.id }])
                swal("Your file is Deleted...");
            } else {

            }
        }
        catch (e) {
            swal("Error", e)
        }
    }

    async function beditAndSaveInsComp() {

        try {
            if (!user || user.role === "user") {
                swal("Warning !!!", "Unauthorize access", "error");
                return;
            }

            if (editInsuranceObject.name.trim === null || editInsuranceObject.name.length < 10) {
                return;
            }
            if (editInsuranceObject.id.trim === null || editInsuranceObject.id < 3) {
                return;
            }
            setSaveLoading(true);

            //lest start updating
            await setDoc(doc(db, "testinsurance", editInsuranceObject.id), {
                name: editInsuranceObject.name,
                id: editInsuranceObject.id,
                emails: editInsuranceObject.emails
            });

            swal("Hurry", "Successfully Saved");
            setInsForm({ name: "", id: "", emails: "" })
            setSaveLoading(false);


        }
        catch (e) {
            swal(e)
        }

    }
    ///edit and update company
    async function editAndSaveInsComp() {
        try {
            if (!user || user.role === "user") {
                swal("Warning !!!", "Unauthorize access", "error");
                return;
            }
            setLoading(true);
            await setDoc(doc(db, "insurance", editInsuranceObject.id), {
                name: editInsuranceObject.name,
                id: editInsuranceObject.id,
                emails: editInsuranceObject.emails
            });

            swal("Successfully Saved")
            const temp = [...insuranceName];

            const insuranceIndex = temp.findIndex(insObj => insObj.id === editInsuranceObject.id);

            if (insuranceIndex !== -1) {
                const newInsuranceObject =
                {
                    name: editInsuranceObject.name,
                    id: editInsuranceObject.id,
                    emails: editInsuranceObject.emails
                };
                temp[insuranceIndex] = newInsuranceObject;
                setAllInsuranceName(temp);

            }
            setLoading(false);
        }
        catch (e) {
            swal(e)
        }
    }
    //////////////
    async function addNewInsCompName() {
        if (!user || user.role === "user") {
            swal("Warning !!!", "Unauthorize access", "error");
            return;
        }
        //check the name

        if (insForm.name.trim === null || insForm.name.length < 10) {
            swal("Invalid Insurance company name")
            return;
        }
        if (insForm.id.trim === null || insForm.id.length < 3) {
            return;
        }
        setSaveLoading(true);


        try {

            await setDoc(doc(db, "insurance", insForm.id), {
                name: insForm.name,
                id: insForm.id,
                emails: insForm.emails
            });

            swal("Hurry", "Successfully Saved!");
            setAllInsuranceName((prev) => [...prev, {
                name: insForm.name,
                id: insForm.id,
                emails: insForm.emails
            }])

            if (emails.length > 0) {
                emails.map((e, _index) => {
                    setEmails(emails.filter((_, i) => i !== _index));
                })
            }

            setInsForm({ name: "", id: "", emails: "" })
            setSaveLoading(false);


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
            <div className='text-yellow-500 text-xl p-4 font-bold   w-auto  bottom-2  border-2 '>
                <h1 className=' overflow-clip'> Insurance Company Name<span className='text-orange-700 font-semibold text-xs'>Gud Engineering Services</span> </h1>
            </div>
            {
                openEditewTab ?
                    <>
                        <div className='border'>
                            <>
                                <div className=' border-dashed border-2 p-2  mt-3'>
                                    <h1 className='p-5  font-mono font-bold text-sm text-amber-600'>Edit Insurance Company Detail</h1>

                                    <div className='p-6'>
                                        <div class="mb-4">
                                            <label for="email" className="block mb-2    text-xs text-orange-500 font-bold"> Insurance Company Name</label>
                                            <input type="text" value={editInsuranceObject.name} onChange={(e) => setEditInsuranceObject({ ...editInsuranceObject, name: e.target.value })} id="email" className="shadow-sm text-xs text-black  font-semibold  rounded-lg   block w-full p-2.5     " placeholder="xyz insurance" required />
                                        </div>

                                        <div class="mb-4">
                                            <label for="email" className="block mb-2    text-xs text-orange-500 font-bold"> Emails</label>
                                            <ReactMultiEmail
                                                className=" text-xs  shadow-sm  border border-gray-300 text-gray-900  rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600  "
                                                placeholder='Input your email'
                                                value=""
                                                emails={editInsuranceObject.emails}
                                                onChange={(_emails) => {

                                                    setEditInsuranceObject({ ...editInsuranceObject, emails: _emails })
                                                }}

                                                // autoFocus={true}
                                                onFocus={() => setFocused(true)}
                                                onBlur={() => setFocused(false)}

                                                getLabel={(email, index, removeEmail) => {
                                                    return (
                                                        <div data-tag key={index}>
                                                            <div className='text-xs' data-tag-item>{email}</div>
                                                            <span data-tag-handle onClick={() => removeEmail(index)}>

                                                            </span>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className='flex space-x-4'>
                                            {saveLoading ? <ThreeDots height="50" width="50" radius="9" color="#4fa94d" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true}
                                            /> : <button onClick={() => editAndSaveInsComp()} type="submit" class="text-white  bg-orange-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300   rounded-lg text-lg px-5 py-2.5 text-center dark:bg-orange-800 dark:hover:bg-green-700 dark:focus:ring-green-800 font-bold">Edit and Save</button>}
                                            <button onClick={() => setEditNewTab(false)} type="submit" class="text-white bg-red-950 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center    "><b> Cancel</b></button>
                                        </div>
                                    </div>
                                </div>
                            </>


                        </div>
                    </>

                    :

                    openAddNewTab ?
                        <>
                            <div className=' border-dashed border-2 p-2  mt-3'>
                                <h1 className='p-5  font-mono font-bold text-3xl text-amber-600'>Add New Insurance Company</h1>

                                <div className='p-6'>
                                    <div class="mb-4">
                                        <label for="email" className="block mb-2    text-xs text-orange-500 font-bold"> Insurance Company Name</label>
                                        <input type="text" value={insForm.name} onChange={(e) => setInsForm({ ...insForm, name: e.target.value })} id="email" className="shadow-sm text-xs text-black  font-normal  rounded-lg   block w-full p-2.5     " placeholder="xyz insurance" required />
                                    </div>
                                    <div class="mb-4">
                                        <label for="password" className="block mb-2 text-xs font-bold text-orange-500">Insurance Id(Unique*)</label>
                                        <input type="text" value={insForm.id} onChange={(e) => setInsForm({ ...insForm, id: e.target.value })} className="shadow-sm  font-normal   text-sm p-2 rounded-lg  block w-full text  placeholder:text-gray-900 text-black " required />
                                    </div>
                                    <div class="mb-4">
                                        <label for="email" className="block mb-2    text-xs text-orange-500 font-bold"> Emails</label>
                                        <ReactMultiEmail
                                            className=" text-xs  shadow-sm  border border-gray-300 text-gray-900  rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600  "
                                            placeholder='Input your email'
                                            value=""
                                            emails={emails}
                                            onChange={(_emails) => {
                                                setEmails(_emails);
                                                setInsForm({ ...insForm, emails: _emails })
                                            }}

                                            // autoFocus={true}
                                            onFocus={() => setFocused(true)}
                                            onBlur={() => setFocused(false)}

                                            getLabel={(email, index, removeEmail) => {
                                                return (
                                                    <div data-tag key={index}>
                                                        <div className='text-xs' data-tag-item>{email}</div>
                                                        <span data-tag-handle onClick={() => removeEmail(index)}>
                                                            ×
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className='flex space-x-4'>
                                        {saveLoading ? <ThreeDots height="50" width="50" radius="9" color="#4fa94d" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true}
                                        /> : <button onClick={() => addNewInsCompName()} type="submit" class="text-white  bg-yellow-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300   rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-green-700 dark:focus:ring-green-800 font-bold">Add and Save</button>}
                                        <button onClick={() => showAddInsTab()} type="submit" class="text-white bg-yellow-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-gray-700 "> Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </>



                        :


                        <div>
                            <div onClick={() => showAddInsTab()} className='bg-transparent mt-6 p-4 tex-4xl border-dashed border-2 font-bold  '>
                                <h1 className='w-72  p-3 cursor-pointer hover:bg-green-700 bg-blue-950 font-mono font-bold  rounded-md shadow-md text-xs flex'> <span className='mr-4'> Add New </span><HiPlus className='mt-1' /> </h1>
                            </div>
                        </div>
            }

          <div className=' bg-gray-300 max-w-full p-5 w-full h-60 overflow-y-scroll'>      
                   <table className="table-auto  bg-white  mt-7 border-separate   border border-slate-500 ">
                       <thead className='text-sm font-serif text-black font-bold p-4 m-5'>

                           <tr className='bg-[rgb(220,230,243)] cursor-pointer '>
                               <th className='px-2 py-3'>SN</th>
                               <th className='px-2 py-3 text-start'>Insurance Company Name</th>
                               <th className='px-2 py-3 text-start'>Insurance Id</th>
                               <th className='px-2 py-3 text-start'>Emails</th>
                               <th className='px-2 py-3 text-start'>Edit</th>
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
                            insuranceName && insuranceName.map((e, i) => {
                                return (
                                    <tr className='      cursor-pointer hover:bg-gray-300' key={i}>
                                        <td className='p-5  '>{i + 1}</td>
                                        <td className='p-5  font-semibold'>{e.name}</td>
                                        <td className='p-5  '> {e.id} </td>
                                        <td className='p-5   flex flex-col'> {e.emails && e.emails.map(ex => <span>{ex}</span>)} </td>
                                        <td className='p-5' > <button onClick={() => {
                                            setEditNewTab(true)
                                            editInsuranceObjectAttribute(e.name, e.id, i, e.emails)
                                        }
                                        } className="outline outline-1    p-2 rounded-1xl hover:bg-green-800   ">
                                            <HiPencilAlt className='text-black text-xs' /></button>
                                        </td>

                                        <td  className='p-5'> <button onClick={() => {
                                            handleDelete(e.name, e.id, i)
                                        }
                                        } className="outline outline-1  p-2 rounded-1xl hover:bg-yellow-950   ">
                                            <HiOutlineTrash className='text-black text-xs' /></button>

                                        </td>
                                    </tr>
                                );
                            })
                    }
                </tbody>
            </table>
            </div>
        </div>





    )
}

