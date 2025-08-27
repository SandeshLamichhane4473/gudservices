import React, { useEffect, useState } from "react";
import ResponsiveTable from "./ResponsiveTable";
 
import { fetchCollectionData } from "../Utils/fetchCollectionData";

export default function Valuation() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchCollectionData("valuation"); // Firestore collection name
      setTableData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div  className="text-black" style={{ padding: "20px" }}>
      <ResponsiveTable data={tableData} />
    </div>
  );
}
