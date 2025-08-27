// ClientAddModal.js
import React from "react";
import { limit } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { collection } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { query } from "firebase/firestore";
import { getDocs } from "firebase/firestore";

const ClientAddModal = ({ isOpen, onClose, formclient, setformclient, onSubmit }) => {
  if (!isOpen) return null; // don't render if modal is closed


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
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
        
        <h2 className="text-xl font-semibold mb-4">Add New Client</h2>

        <form onSubmit={onSubmit} className="space-y-4">
  {/* Valuation File No with Auto button */}
  <div>
    <label className="block mb-1 font-medium">Valuation File No</label>
    <div className="flex">
      <input
      required
      disabled
        type="text"
        placeholder=""
        value={formclient.valuationFileNo}
        onChange={(e) =>
          setformclient({ ...formclient, valuationFileNo: e.target.value })
        }
        className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={generateValuationFileNo}
        className="px-4 py-2 bg-green-800 text-white rounded-r-lg hover:bg-green-800"
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
      placeholder=" "
      value={formclient.clientOrcompanyName}
      onChange={(e) =>
        setformclient({ ...formclient, clientOrcompanyName: e.target.value })
      }
      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Client Address */}
  <div>
    <label className="block mb-1 font-medium">Client Address</label>
    <input
      required
      type="text"
      placeholder=" "
      value={formclient.clientAddress}
      onChange={(e) =>
        setformclient({ ...formclient, clientAddress: e.target.value })
      }
      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Client Phone */}
  <div>
    <label className="block mb-1 font-medium">Client Phone</label>
    <input
      
      type="text"
      placeholder=" "
      value={formclient.clientPhone}
      onChange={(e) =>
        setformclient({ ...formclient, clientPhone: e.target.value })
      }
      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Owner Name */}
  <div>
    <label className="block mb-1 font-medium">Owner Name</label>
    <input
      required
      type="text"
      placeholder=" "
      value={formclient.ownerName}
      onChange={(e) =>
        setformclient({ ...formclient, ownerName: e.target.value })
      }
      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Owner Address */}
  <div>
    <label className="block mb-1 font-medium">Owner Address</label>
    <input
      required
      type="text"
      placeholder=" "
      value={formclient.ownerAddress}
      onChange={(e) =>
        setformclient({ ...formclient, ownerAddress: e.target.value })
      }
      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Owner Phone */}
  <div>
    <label className="block mb-1 font-medium">Owner Phone</label>
    <input
      type="text"
      placeholder=" "
      value={formclient.ownerPhone}
      onChange={(e) =>
        setformclient({ ...formclient, ownerPhone: e.target.value })
      }
      className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-3 mt-4">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-900"
    >
      Save
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default ClientAddModal;
