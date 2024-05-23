import React from "react";
import { Table, Card, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles.css";

interface JobTitleRow {
  key: string;
  jobTitle: string;
  jobCount: number;
}

// SecondTable component 
const SecondTable: React.FC = () => {
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const { year, jobTitleData } = location.state as {
    year: number;
    jobTitleData: JobTitleRow[];
  };

  // Columns configuration for job title table
  const jobTitleColumns = [
    { title: "Job Title", dataIndex: "jobTitle", key: "jobTitle" },
    { title: "Number of Jobs", dataIndex: "jobCount", key: "jobCount" },
  ];

  return (
    <div>
      {/* Button to navigate back to the main table */}
      <Button
        onClick={() => navigate("/")} 
        style={{ marginBottom: 20, marginLeft: "45%", marginTop: 30 }} 
      >
        Back to Main Table
      </Button>
      {/* Container for the job title table */}
      <div className="table-container">
        {/* Card component displaying the year and containing the job title table */}
        <Card title={`Jobs in ${year}`} bordered={true} className="custom-card">
          {/* Job title table */}
          <Table
            dataSource={jobTitleData} 
            columns={jobTitleColumns} 
            pagination={false} 
            className="custom-table" 
          />
        </Card>
      </div>
    </div>
  );
};

export default SecondTable; 
