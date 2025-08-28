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

    requestAnimationFrame(() => {
  // use documentElement for widest compatibility
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  
});

    async function editInsuranceObjectAttribute(name, id, index, emails) {
        try {

            if (!user || user.role === "user") {
                swal("Warning !!!", "Unauthorize access", "error");
                return;
            }
      requestAnimationFrame(() => {
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    });

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
           
            {
                openEditewTab ?
                    <>
  <div className="border rounded-2xl shadow-lg bg-white mt-5">
    <div className="border-dashed border-2 p-4 rounded-xl ]">
      <h1 className="p-4 text-lg font-mono font-bold text-amber-700 border-b">
        ✏️ Edit Insurance Company Detail
      </h1>

      <div className="p-6 space-y-6">
        {/* Insurance Company Name */}
        <div className="mb-4">
          <label
            htmlFor="companyName"
            className="block mb-2 text-sm text-orange-600 font-semibold"
          >
            Insurance Company Name
          </label>
          <input
            type="text"
            value={editInsuranceObject.name}
            onChange={(e) =>
              setEditInsuranceObject({
                ...editInsuranceObject,
                name: e.target.value,
              })
            }
            id="companyName"
            placeholder="xyz insurance"
            required
            className="shadow-sm text-sm text-gray-800 font-medium rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none block w-full p-3"
          />
        </div>

        {/* Emails */}
        <div className="mb-4">
          <label
            htmlFor="emails"
            className="block mb-2 text-sm text-orange-600 font-semibold"
          >
            Emails
          </label>
          <ReactMultiEmail
            className="text-xs shadow-sm border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-orange-400"
            placeholder="Input your email"
            value=""
            emails={editInsuranceObject.emails}
            onChange={(_emails) => {
              setEditInsuranceObject({ ...editInsuranceObject, emails: _emails });
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            getLabel={(email, index, removeEmail) => {
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              );
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          {saveLoading ? (
            <ThreeDots
              height="40"
              width="40"
              radius="9"
              color="#f97316"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          ) : (
            <button
              onClick={() => editAndSaveInsComp()}
              type="submit"
              className="flex-1 bg-green-600 hover:bg-orange-600 text-white font-bold rounded-lg px-5 py-2.5 text-sm shadow-md transition"
            >
              💾 Edit and Save
            </button>
          )}
          <button
            onClick={() => setEditNewTab(false)}
            type="button"
            className="flex-1 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-lg px-5 py-2.5 text-sm shadow-md transition"
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</>


                    :

                    openAddNewTab ?
                    <>
  <div className="border-2 border-dashed border-yellow-400 rounded-xl p-6 mt-6 bg-gray-200 shadow-md">
    <h1 className="text-3xl font-mono font-bold text-amber-600 mb-6 text-center">
      Add New Insurance Company
    </h1>

    <div className="space-y-5">
      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block mb-2 text-sm font-bold text-orange-500">
          Insurance Company Name
        </label>
        <input
          type="text"
          id="companyName"
          placeholder="xyz insurance"
          value={insForm.name}
          onChange={(e) => setInsForm({ ...insForm, name: e.target.value })}
          className="w-full p-3 text-sm rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
          required
        />
      </div>

      {/* Insurance ID */}
      <div>
        <label htmlFor="insuranceId" className="block mb-2 text-sm font-bold text-orange-500">
          Insurance Id (Unique*)
        </label>
        <input
          type="text"
          id="insuranceId"
          placeholder="Unique ID"
          value={insForm.id}
          onChange={(e) => setInsForm({ ...insForm, id: e.target.value })}
          className="w-full p-3 text-sm rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
          required
        />
      </div>

      {/* Emails */}
      <div>
        <label className="block mb-2 text-sm font-bold text-orange-500">
          Emails
        </label>
        <ReactMultiEmail
          className="w-full p-3 text-sm rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
          placeholder="Input your email"
          emails={emails}
          onChange={(_emails) => {
            setEmails(_emails);
            setInsForm({ ...insForm, emails: _emails });
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          getLabel={(email, index, removeEmail) => (
            <div key={index} className="flex items-center bg-yellow-100 text-xs px-2 py-1 rounded mr-1 mb-1">
              <span>{email}</span>
              <button
                type="button"
                onClick={() => removeEmail(index)}
                className="ml-2 text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          )}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 justify-center mt-4">
        {saveLoading ? (
          <ThreeDots
            height="50"
            width="50"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        ) : (
          <>
            <button
              onClick={() => addNewInsCompName()}
              className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg px-6 py-2.5 focus:ring-2 focus:ring-green-400"
            >
              Add and Save
            </button>
            <button
              onClick={() => showAddInsTab()}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg px-6 py-2.5 focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</>



                        :


                        <div>
                            <div onClick={() => showAddInsTab()} className="mt-6">
                                    <button
                                        className="flex items-center px-5 py-1 w-72 
                                                bg-green-800 text-white font-mono font-bold text-sm 
                                                rounded-lg shadow-md transition-all duration-300
                                                hover:bg-green-700 active:scale-95 
                                                focus:outline-none focus:ring-2 focus:ring-green-400"
                                    >
                                        <span className="mr-3">Add New</span>
                                        <HiPlus className="text-lg" />
                                    </button>
                                    </div>

                        </div>
            }

          <div className='   max-w-full   w-full  overflow-y-scroll'>      
                  <table className="table-auto w-full bg-white mt-7 border border-slate-300 rounded-lg shadow-md overflow-hidden">
  <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white text-sm font-semibold">
    <tr>
      <th className="px-4 py-3 text-center">SN</th>
      <th className="px-4 py-3 text-left">Insurance Name</th>
      <th className="px-4 py-3 text-left">Insurance Id</th>
      <th className="px-4 py-3 text-left">Emails</th>
      <th className="px-4 py-3 text-center">Edit</th>
      <th className="px-4 py-3 text-center">Remove</th>
    </tr>
  </thead>

  <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
    {loading ? (
      <tr>
        <td colSpan={6} className="py-10 text-center">
          <FidgetSpinner
            visible={true}
            height="60"
            width="60"
            ariaLabel="dna-loading"
            wrapperClass="mx-auto"
            ballColors={['#ff0000', '#00ff00', '#0000ff']}
            backgroundColor="#F4442E"
          />
        </td>
      </tr>
    ) : (
      insuranceName &&
      insuranceName.map((e, i) => (
        <tr
          key={i}
          className="hover:bg-gray-100 transition-colors duration-200"
        >
          <td className="px-4 py-3 text-center">{i + 1}</td>
          <td className="px-4 py-3 font-semibold whitespace-nowrap">
            {e.name}
          </td>
          <td className="px-4 py-3">{e.id}</td>
          <td className="px-4 py-3">
            <div className="flex flex-col gap-1">
              {e.emails &&
                e.emails.map((ex, idx) => (
                  <span key={idx} className="text-gray-600">
                    {ex}
                  </span>
                ))}
            </div>
          </td>
          <td className="px-4 py-3 text-center">
            <button
              onClick={() => {
                setEditNewTab(true);
                editInsuranceObjectAttribute(e.name, e.id, i, e.emails);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md shadow-sm transition-all duration-200"
            >
              <HiPencilAlt className="text-lg" />
            </button>
          </td>
          <td className="px-4 py-3 text-center">
            <button
              onClick={() => {
                handleDelete(e.name, e.id, i);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md shadow-sm transition-all duration-200"
            >
              <HiOutlineTrash className="text-lg" />
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

            </div>
        </div>





    )
}

