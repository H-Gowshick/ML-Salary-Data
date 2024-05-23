import React, { useState, useEffect } from "react";
import { Table, Card } from "antd";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import csvData from "../../assets/ML-Salary-Data/salaries.csv?raw";
import "./styles.css";

// Interface for each row of the main table
interface DataRow {
  key: string;
  year: number;
  totalJobs: number;
  averageSalary: number | null;
  jobTitles: Record<string, number>;
}

// Interface for each row of the CSV data
interface CSVRow {
  work_year: number;
  job_title: string;
  salary_in_usd: number;
}

// Main component for the main table
const MainTable: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]); // State for storing table data
  const navigate = useNavigate(); // React Router navigation function

  useEffect(() => {
    // Parsing CSV data using PapaParse
    const parsed = Papa.parse<CSVRow>(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value, header) => {
        if (header === "work_year" || header === "salary_in_usd") {
          return parseFloat(value);
        }
        return value;
      },
    });

    // Grouping parsed data by year and calculating total jobs, total salary, and job titles
    const groupedData = parsed.data.reduce(
      (
        acc: Record<
          number,
          {
            year: number;
            totalJobs: number;
            totalSalary: number;
            jobTitles: Record<string, number>;
          }
        >,
        row
      ) => {
        const year = row.work_year;
        const salary = row.salary_in_usd;
        const jobTitle = row.job_title;

        if (!year || isNaN(year) || !salary || isNaN(salary) || !jobTitle) {
          return acc;
        }

        if (!acc[year]) {
          acc[year] = { year, totalJobs: 0, totalSalary: 0, jobTitles: {} };
        }
        acc[year].totalJobs += 1;
        acc[year].totalSalary += salary;
        if (!acc[year].jobTitles[jobTitle]) {
          acc[year].jobTitles[jobTitle] = 0;
        }
        acc[year].jobTitles[jobTitle] += 1;
        return acc;
      },
      {}
    );

    // Formatting grouped data into DataRow format
    const formattedData: DataRow[] = Object.entries(groupedData).map(
      ([year, { totalJobs, totalSalary, jobTitles }]) => ({
        key: `${year}`,
        year: Number(year),
        totalJobs,
        averageSalary: totalJobs > 0 ? totalSalary / totalJobs : null,
        jobTitles,
      })
    );
    setData(formattedData); // Setting formatted data into state
  }, []);

  // Function to handle row click, navigates to another page with selected year's data
  const handleRowClick = (year: number) => {
    const selectedYearData = data.find((item) => item.year === year);
    if (!selectedYearData) return;
    const jobTitleData = Object.entries(selectedYearData.jobTitles).map(
      ([jobTitle, jobCount]) => ({
        key: jobTitle,
        jobTitle,
        jobCount,
      })
    );
    navigate("/second-table", { state: { year, jobTitleData } });
  };

  // Columns configuration for the table
  const columns = [
    { title: "Year", dataIndex: "year", key: "year", width: 460 },
    { title: "Number of Total Jobs", dataIndex: "totalJobs", key: "totalJobs" },
    {
      title: "Average Salary in USD",
      dataIndex: "averageSalary",
      key: "averageSalary",
      width: 180,
      render: (value: number | null) =>
        value === null ? "N/A" : `$${value.toFixed(2)}`,
    },
  ];

  return (
    <div className="table-container">
      <Card title="Main Table" bordered={true} className="custom-card">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          className="custom-table"
          onRow={(record: DataRow) => ({
            onClick: () => handleRowClick(record.year),
          })}
        />
      </Card>
    </div>
  );
};

export default MainTable;
