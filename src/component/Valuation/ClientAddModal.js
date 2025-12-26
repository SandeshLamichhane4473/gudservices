// ClientAddModal.js
import React from "react";
import { limit } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { collection } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { query } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { useRef,useState,useEffect } from "react";
import swal from "sweetalert";
const ClientAddModal = ({ isOpen, onClose, formclient, setformclient, onSubmit }) => {
 // don't render if modal is closed
   const propertyTypes = ['Land', 'Building', 'Others', 'Vehicle'];
const bankRef = useRef(null);
  const [currentPropertyType, setCurrentPropertyType] = useState();
const [currentBank, setCurrentBank] = useState();
const branchRef = useRef(null);
const [bankList, setBanklist] = useState(['Select One']);
  const [branchList, setBranchList] = useState(['Select One']);
    const [allBankListLongTerm, setAllBankListLongTerm] = useState([]);
    const [currentBranch, setCurrentBranch] = useState();
 useEffect(() => {
      getAllBankInformation();
      
    }, []);


     if (!isOpen) return null; 

 /////////////////////////////  GET  ALL THE BANKING INFORMATION ///////////////////////
  async function getAllBankInformation() {
    try {
      const bankref = collection(db, "bankdetail");
      const querySnapshot = await getDocs(bankref);

      setAllBankListLongTerm([]);


      let tempdata = [];
      let _bankList = [];
      console.log(querySnapshot.docs.length);
      if (querySnapshot.docs.length >= 1) {
        querySnapshot.forEach((doc) => {
          tempdata.push(doc.data())
          let bankId = doc.data()['bankId'];
          let bankName = doc.data()['bankName'];
          _bankList.push(bankName);

          // const docData=    { value: bankId,  label: bankName };
          // tempCollDocData.push(docData);       
        }
        );
        //setListFIleNoSuggestion(tempCollDocData);
        let newTempData = tempdata.reverse();

        setBanklist(_bankList);
        setAllBankListLongTerm(newTempData);


      }

    }
    catch (e) {
      swal(e);
    }
  }


  
async function generateValuationFileNo() {
  try {
     const valuationRef = collection(db, "valuation");; 
     const q = query(valuationRef, orderBy("created_date","desc"), limit(1));
   
     let tempdata=[];
     const querySnapshot= await getDocs(q);
     if (querySnapshot.docs.length >= 1) {      
       querySnapshot.forEach(async (doc) => {  
       let tempValFileNo=doc.data()['valuationFileNo'];
       let lastno= tempValFileNo.split('-')[2];
       let middle= tempValFileNo.split('-')[1];
       let first= tempValFileNo.split('-')[0];
        
       const num = parseInt(lastno, 10)
       let newAuto=first+"-"+middle+"-"+(num+1).toString();
       const timestamp = Math.floor(Date.now());
       setformclient({ ...formclient, valuationFileNo: newAuto, created_date:timestamp})
        
       });
      
     
     
    } else {
      // if no document exists, return a default first file no
        setformclient({ ...formclient, valuationFileNo: "***"})
    }
  } catch (e) {
    alert(e);
    return null;
  }
}




  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white rounded-2xl p-4 w-full max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]">
    
    <h2 className="text-xl font-semibold mb-6">Add New Client</h2>

    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Valuation File No (Full width) */}
      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Valuation File No</label>
        <div className="flex">
          <input
            required
            disabled
            type="text"
            value={formclient.valuationFileNo}
            onChange={(e) =>
              setformclient({ ...formclient, valuationFileNo: e.target.value })
            }
            className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={generateValuationFileNo}
            className="px-4 py-2 bg-green-800 text-white rounded-r-lg hover:bg-green-900"
          >
            Auto
          </button>
        </div>
      </div>

      {/* Client Name */}
      <div>
        <label className="block mb-1 font-medium">Client Name</label>
        <input
          required
          type="text"
          value={formclient.clientOrcompanyName}
          onChange={(e) =>
            setformclient({ ...formclient, clientOrcompanyName: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Client Phone */}
      <div>
        <label className="block mb-1 font-medium">Client Phone</label>
        <input
          type="text"
          value={formclient.clientPhone}
          onChange={(e) =>
            setformclient({ ...formclient, clientPhone: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Client Address (Full width) */}
      <div className="">
        <label className="block mb-1 font-medium">Client Address</label>
        <input
          required
          type="text"
          value={formclient.clientAddress}
          onChange={(e) =>
            setformclient({ ...formclient, clientAddress: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Owner Name */}
      <div>
        <label className="block mb-1 font-medium">Owner Name</label>
        <input
          required
          type="text"
          value={formclient.ownerName}
          onChange={(e) =>
            setformclient({ ...formclient, ownerName: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Owner Phone */}
      <div>
        <label className="block mb-1 font-medium">Owner Phone</label>
        <input
          type="text"
          value={formclient.ownerPhone}
          onChange={(e) =>
            setformclient({ ...formclient, ownerPhone: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Owner Address (Full width) */}
      <div className="">
        <label className="block mb-1 font-medium">Owner Address</label>
        <input
          required
          type="text"
          value={formclient.ownerAddress}
          onChange={(e) =>
            setformclient({ ...formclient, ownerAddress: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
     {/* latlong addres */}
        <div className="">
        <label className="block mb-1 font-medium">LatLong Address</label>
        <input
         required
          type="text"
          value={formclient.latlong}
          onChange={(e) =>
            setformclient({ ...formclient, latlong: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      

      {/* Here is for the  Field charge cost */}
       <div className="">
        <label className="block mb-1 font-medium">Field Charge Cost</label>
        <input
          type="text"
          value={formclient.fieldchargeCost}
          onChange={(e) =>
            setformclient({ ...formclient, fieldchargeCost: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
     
      {/* end of field charge cost */}
     {/* FMV value */}
      <div className="">
        <label className="block mb-1 font-medium"> FMV value </label>
        <input
          type="text"
          value={formclient.fmvValue}
          onChange={(e) =>
            setformclient({ ...formclient, fmvValue: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
        {/* Amount of Bill */}
      <div className="">
        <label className="block mb-1 font-medium">Amount of Bill</label>
        <input
          type="text"
          value={formclient.amountofBill}
          onChange={(e) =>
            setformclient({ ...formclient, amountofBill: e.target.value })
          }
          className="text-black w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

{/* Here is the field for the bank and bank list */}
<div>
                  <label className="mt-20 ">Bank Name  </label>
                  <select ref={bankRef} value={currentBank} defaultValue={'Choose One'} onChange={
                    (e) => {
                      setCurrentBank(e.target.value);
                      // setClaimTypeState(e.target.value)
                      setformclient({ ...formclient, bankName: e.target.value });
                      if (e.target.value === "Select One") return;

                      const filterData = allBankListLongTerm.filter((object) => {
                        return object.bankName === e.target.value;
                      }
                      );
                      if (filterData.length > 0)
                        setBranchList(filterData[0].branchList)
                      else
                        setBranchList([])

                    }} className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Choose One" selected>Choose One</option>
                    {
                      bankList.map((e, index) => {
                        return <option key={index} value={e}>{e}</option>
                      })
                    }
                  </select>
                </div>

                <div>
                  <label className="mt-20 ">Branch Name </label>
                  <select ref={branchRef} value={currentBranch} defaultValue={'Select One'} onChange={
                    (e) => {
                      setCurrentBranch(e.target.value);

                      // setClaimTypeState(e.target.value)
                      setformclient({ ...formclient, bankBranch: e.target.value });

                      console.log(branchRef.current.value);

                    }
                  } className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Choose One" selected>Choose One</option>
                    {
                      branchList.map((e, index) => {
                        return <option key={index} value={e}>{e}</option>
                      })
                    }
                  </select>
                </div>
     {/* here is for the  */}
     {/* also for the property types  */}

 <div>
                  <label className="mt-20 ">Property Type</label>
                  <select  value={currentPropertyType} defaultValue={'Select One'} onChange={
                    (e) => {
                      setCurrentPropertyType(e.target.value);
                      // setClaimTypeState(e.target.value)
                      setformclient({ ...formclient, propertyType: e.target.value });

                    }
                  } className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Choose One" selected>Choose One</option>
                    {
                      propertyTypes.map((e, index) => {
                        return <option key={index} value={e}>{e}</option>
                      })
                    }
                  </select>
                </div>

      {/* Buttons */}
      <div className="md:col-span-2 flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-800"
        >
          Save
        </button>
      </div>

    </form>
  </div>
</div>
  )
};

export default ClientAddModal;
