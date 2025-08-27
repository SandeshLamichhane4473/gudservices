import React, { useState } from "react";
import { HiCheck, HiZoomIn,HiEye } from "react-icons/hi";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import ClientAddModal from "./ClientAddModal";
import { doc ,setDoc} from "firebase/firestore";
import { db } from "../../firebase/Firebase";

export default function ResponsiveTable({ data }) {
  const rowsPerPage = 17;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
 const [isModalOpenClientNew, setIsModalOpenClientNew] = useState(false);
  // modal for creating the new client id
const [formclient, setformclient] = useState({
    created_date:"",
     valuationFileNo:"",
    clientOrcompanyName: "",
   
    clientAddress: "",
    clientPhone: "",
    ownerName: "",
    ownerAddress: "",
    ownerPhone: "",
  });

  function clearFormClient(){
    setformclient({
      created_date:"",
      valuationFileNo:"",
      clientOrcompanyName: "",
    
      clientAddress: "",
      clientPhone: "",
      ownerName: "",
      ownerAddress: "",
      ownerPhone: "",
    });
  }

  async   function saveClientInfo() {
    try{
   const valuationDoc = doc(db, "valuation",  formclient.valuationFileNo);
   await setDoc(valuationDoc, formclient, {merge:true} );
   alert("Successfully created .Please refresh.")        
     clearFormClient()
    }
    catch(e){
        alert(e);
    }

    
}

   const handleSubmitNewClient =  async(e) =>{
    e.preventDefault();
    console.log("Form Data:", formclient);
  
    // 🚀 you can call API here
   await saveClientInfo();
    // await axios.post("/api/clients", formclient)
     
    setIsModalOpen(false); // close modal after saving
    
  };


// modal for creating new client id end
  /// here is the function for modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  }; 



  // Handle search
  const handleSearch = () => {
   const term = searchTerm.toLowerCase();
  const filtered = data.filter((row) =>
    row.valuationFileNo?.toLowerCase().includes(term) ||
    row.clientOrcompanyName?.toLowerCase().includes(term)
  );
  setFilteredData(filtered);
  setCurrentPage(1);
  
  };

  const handlenNew=()=>{
    alert("hellow")
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      {/* Search Box */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Search by Ref or Client Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded flex-1 text-black"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-1 bg-green-800 text-white rounded hover:bg-green-600"
        >
          Search
        </button>
          <button
          onClick={() => setIsModalOpenClientNew(true)}
          className="px-4 py-1 bg-green-800 text-white rounded hover:bg-green-600"
        >
          Add New
        </button>
        
          <button
          onClick={() => window.location.reload()}
          className="px-4 py-1 bg-green-800 text-white rounded hover:bg-green-600"
        >
           Refresh
        </button>
      </div>

      <div className="overflow-x-auto text-black">


        
       <table className="min-w-full border border-gray-200">
  <thead className="bg-gray-100">
    <tr>
      {/* 1st column */}
      <th className="sticky left-0 bg-gray-100 border px-4 py-2 whitespace-nowrap w-20 z-30">
        VIEW
      </th>
      {/* 2nd column */}
      <th className="sticky left-20 bg-gray-100 border px-4 py-2 whitespace-nowrap w-36 z-30">
        REF
      </th>
      {/* 3rd column */}
      <th className="sticky left-[11rem] bg-gray-100 border px-4 py-2 whitespace-nowrap w-48 z-30">
        CLIENT NAME
      </th>

      {/* Remaining */}
      <th className="border px-4 py-2 whitespace-nowrap">ADDRESS</th>
      <th className="border px-4 py-2 whitespace-nowrap">OWNER NAME</th>
      <th className="border px-4 py-2 whitespace-nowrap">OWNER ADDRESS</th>
      <th className="border px-4 py-2 whitespace-nowrap">OWNER PHONE</th>
      <th className="border px-4 py-2 whitespace-nowrap">PRO-TYPE</th>
      <th className="border px-4 py-2 whitespace-nowrap">FIELD COST</th>
      <th className="border px-4 py-2 whitespace-nowrap">FMV VALUE</th>
      <th className="border px-4 py-2 whitespace-nowrap">BOOK VALUE</th>
      <th className="border px-4 py-2 whitespace-nowrap">BILL AMT</th>
      <th className="border px-4 py-2 whitespace-nowrap">RECEIVED AMT</th>
      <th className="border px-4 py-2 whitespace-nowrap">FILES</th>
      <th className="border px-4 py-2 whitespace-nowrap">BANK NAME</th>
      <th className="border px-4 py-2 whitespace-nowrap">BANK BRANCH</th>
      <th className="border px-4 py-2 whitespace-nowrap">EDIT</th>
    </tr>
  </thead>

  <tbody>
    {currentData.map((row, index) => (
      <tr
        key={row.id}
        className={
          index % 2 === 0
            ? "bg-white hover:bg-green-200"
            : "bg-gray-50 hover:bg-gray-100"
        }
      >
        {/* 1st column */}
        <td
          onClick={() => handleOpenModal(row)}
          className="sticky left-0 bg-gray-100 border px-4 py-2 w-20 z-30 cursor-pointer text-green-800 hover:text-green-900"
        >
          <HiEye size={22} />
        </td>

        {/* 2nd column */}
        <td className="sticky left-20 bg-gray-100 border px-4 py-2 min-w-[150px] z-30">
          {row.valuationFileNo}
        </td>

        {/* 3rd column */}
        <td className="sticky left-[11rem] bg-gray-100 border px-4 py-2 w-48 z-30 whitespace-nowrap">
          {row.clientOrcompanyName}
        </td>

        {/* Remaining columns */}
        <td className="border px-4 py-2 whitespace-nowrap">{row.clientAddress}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.ownerName}</td>
        <td className="border px-4 py-2 whitespace-nowrap  ">{row.ownerAddress}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.ownerPhone}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.propertyType}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.fieldchargeCost}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.fmvValue}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.bookValue}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.amountofBill}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.totalIncome}</td>
        <td className="border px-4 py-2 whitespace-nowrap">
          {row.files?.map((val, i) => (
            <a
              key={i}
              href={val.fileUrl}
              className="text-blue-800 font-semibold hover:bg-slate-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {val.fileType}{" "}
            </a>
          ))}
        </td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.bankName}</td>
        <td className="border px-4 py-2 whitespace-nowrap">{row.bankBranch}</td>
        <td className="border px-4 py-2 text-blue-800 whitespace-nowrap">
          <Link to={`/new/valuation/${row.valuationFileNo}`}>Edit</Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>



    {/* modal for creating new client id  */}
     <ClientAddModal
        isOpen={isModalOpenClientNew}
        onClose={() => { setIsModalOpenClientNew(false) ; clearFormClient()}}
        formclient={formclient}
        setformclient={setformclient}
        onSubmit={handleSubmitNewClient}
      />
    
      {/* modal for the displaying */}
   {/* Modal for details */}
      <Modal
        isOpen={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        title="Reference Details"
      >
        {selectedRow && (
          <div className="space-y-2 text-sm sm:text-base">
            <p><b>Ref:</b> {selectedRow.valuationFileNo}</p>
            <p><b>Client:</b> {selectedRow.clientOrcompanyName}</p>
             <p><b>Client Add:</b> {selectedRow.clientAddress}</p>
            <p><b>Client Phn:</b> {selectedRow.clientPhone}</p>

            <p><b>Owner Name:</b> {selectedRow.ownerName}</p>
            <p><b>Owner Add:</b> {selectedRow.ownerAddress}</p>
            <p><b>Owner Phn:</b> {selectedRow.ownerPhone}</p>

            <p><b>Property Type:</b> {selectedRow.propertyType}</p>
            <p><b>Lat Long:</b> {selectedRow.latlong}</p>
            <p><b>Bank:</b> {selectedRow.bankName}</p>
            <p><b>Branch:</b> {selectedRow.bankBranch}</p>
            

            <p><b>Field Charge:</b> {selectedRow.fieldchargeCost}</p>
            <p><b>FMV Value:</b> {selectedRow.fmvValue}</p>
            <p><b>BILL AMT:</b> {selectedRow.amountofBill}</p>
            <p><b>Received AMT:</b> {selectedRow.totalIncome}</p>


             <p><b>Remarks:</b> {selectedRow.closeRemarks}</p>
              <p><b>Files:</b> {selectedRow.files &&
                    selectedRow.files.map((val, index) => (
                      <a
                        key={index}
                        href={val.fileUrl}
                        className="text-blue-800 font-semibold hover:bg-slate-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {val.fileType}{" "}
                      </a>
                    ))}</p>

            <p><b>File Maker:</b> {selectedRow.initmaker}</p>
            <p><b>File Checker:</b> {selectedRow.initchecker}</p>

            <p><b>2 Page Maker:</b> {selectedRow.twopageMaker}</p>
            <p><b>2 Page Checker:</b> {selectedRow.initchecker}</p>

            
        
            {/* You can add more fields here */}
          </div>
        )}
     
      </Modal>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2 flex-wrap text-black">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          Prev
        </button>
        {(() => {
          const maxButtons = 5;
          let start = Math.max(currentPage - 2, 1);
          let end = Math.min(start + maxButtons - 1, totalPages);

          if (end - start + 1 < maxButtons) {
            start = Math.max(end - maxButtons + 1, 1);
          }

          const pages = [];
          if (start > 1) pages.push("1");
          if (start > 2) pages.push("...");

          for (let i = start; i <= end; i++) {
            pages.push(i);
          }

          if (end < totalPages - 1) pages.push("...");
          if (end < totalPages) pages.push(totalPages);

          return pages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              className={`px-3 py-1 border rounded hover:bg-gray-200 ${
                currentPage === page ? "bg-green-800 text-white" : ""
              }`}
              disabled={page === "..."}
            >
              {page}
            </button>
          ));
        })()}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </>
  );
}
