// MarksTable.jsx
import React, { useState } from "react";
import axios from "axios";

const MarksTable = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [semester, setSemester] = useState("");
  const [markType, setMarkType] = useState("");

  const fetchMarks = async () => {
    if (!semester || !markType) {
      setError("Please select both Semester and Mark Type");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Match DB exactly but ignore case issues
      const semesterNum = parseInt(semester, 10);
      const markTypeStr =
        markType === "internal" ? "Internal" : "External"; // Capitalized to match DB

      const res = await axios.get("http://localhost:8000/api/marks", {
        params: {
          semester: semesterNum,
          marktype: markTypeStr, // lowercase "t"
        },
      });

      console.log("Fetched Marks:", res.data);
      setMarksData(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch marks data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Input Row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        {/* Semester Select */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            flex: "1",
          }}
        >
          <option value="">Select Semester</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>

        {/* Mark Type Select */}
        <select
          value={markType}
          onChange={(e) => setMarkType(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            flex: "1",
          }}
        >
          <option value="">Select Mark Type</option>
          <option value="internal">Internal</option>
          <option value="external">External</option>
        </select>

        {/* Submit Button */}
        <button
          onClick={fetchMarks}
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Submit
        </button>
      </div>

      {/* Messages */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table */}
      {!loading && marksData.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#007BFF", color: "white" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Subject</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Mark</th>
              <th style={{ padding: "12px", textAlign: "center" }}>
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {marksData.map((mark, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td style={{ padding: "12px" }}>{mark.subject || ""}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {mark.Mark ?? ""}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {mark.Percentage != null ? `${mark.Percentage}%` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No Data */}
      {!loading && marksData.length === 0 && !error && (
        <p>No data found for selected filters.</p>
      )}
    </div>
  );
};

export default MarksTable;
