import React, { useEffect, useState } from 'react';
import { Table, Button, DatePicker } from 'antd';
import * as XLSX from 'xlsx';
import moment from 'moment';
import jsonData from './dataCom';

const LiabilityFigures = () => {
  const [data, setData] = useState([]);
  const [summedData, setSummedData] = useState([]);
  const [totalData, setTotalData] = useState({});
  const [branchData, setBranchData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      const filteredData = filterDataByDate(selectedDate);
      calculateSums(filteredData);
      generateBranchData(filteredData);
    }
  }, [selectedDate]);

  const filterDataByDate = (date) => {
    const formattedSelectedDate = date.format("DD/MM/YYYY");
    return jsonData.filter((row) => moment(row.Date, "DD/MM/YYYY").format("DD/MM/YYYY") === formattedSelectedDate);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const calculateSums = (data) => {
    const summedRows = [];
    const demandDeposit = [
      'STD DEMAND DEPOSIT IND',
      'SKYE SELECT ACCOUNTS',
      'SKYEXCEL ACCOUNTS',
      'SMALL BUSINESS ACCOUNTS',
      'SKYE GLOBAL ACCOUNTS',
      'SBG ACCOUNT',
      'SKYE ENTERPRISE SELECT',
    ];
    const domDeposit = [
      'DOMICILIARY ACCOUNTS SBG',
      'SKYE GLOBAL ACCOUNT FCY',
      'DOMICILIARY ACCOUNTS RETAIL',
    ];
    const savings = [
      'SKYE SAVE',
      'SKYE RAINBOW SAVINGS',
      'OTHER SAVINGS DEPOSIT',
      'STAFF PENSION SAVINGS',
      'SKYE MONEYWISE',
      'SKYEWISE CLASSIC ACCOUNT',
      'SALARY SAVINGS ACCOUNT',
    ];
    const termDeposit = ['PRIORITY FIXED DEPOSIT'];

    let totalDemand = 0;
    let totalDom = 0;
    let totalSavings = 0;
    let totalTerm = 0;

    const sumCategory = (category, mainCaption) => {
      category.forEach((caption) => {
        const filteredData = data.filter((row) => row.Caption === caption);
        const actualSum = filteredData.reduce((sum, row) => sum + row.ActualBalance, 0);
        summedRows.push({
          caption,
          mainCaption,
          actual: actualSum,
        });

        switch (mainCaption) {
          case 'DEMAND DEPOSIT':
            totalDemand += actualSum;
            break;
          case 'DOMICILIARY DEPOSIT':
            totalDom += actualSum;
            break;
          case 'SAVINGS':
            totalSavings += actualSum;
            break;
          case 'TERM DEPOSIT':
            totalTerm += actualSum;
            break;
          default:
            break;
        }
      });
    };

    sumCategory(demandDeposit, 'DEMAND DEPOSIT');
    sumCategory(domDeposit, 'DOMICILIARY DEPOSIT');
    sumCategory(savings, 'SAVINGS');
    sumCategory(termDeposit, 'TERM DEPOSIT');

    summedRows.push({
      caption: 'TOTAL DEPOSIT',
      mainCaption: 'TOTAL',
      actual: totalDemand + totalDom + totalSavings + totalTerm,
    });

    setSummedData(summedRows);
    setTotalData({
      demand: totalDemand,
      dom: totalDom,
      savings: totalSavings,
      term: totalTerm,
      total: totalDemand + totalDom + totalSavings + totalTerm,
    });
  };

  const generateBranchData = (data) => {
    const branchDataRows = [];

    const groupedData = data.reduce((acc, row) => {
      const key = `${row.BranchCode}-${row.Caption}`;
      if (!acc[key]) {
        acc[key] = {
          BranchCode: row.BranchCode,
          BranchName: row.BranchName,
          ProductCode: row.ProductCode,
          Caption: row.Caption,
          ActualBalance: 0,
          AverageBalance: 0,
          NumOfAccounts: 0,
        };
      }
      acc[key].ActualBalance += row.ActualBalance;
      acc[key].AverageBalance += row.AverageBalance;
      acc[key].NumOfAccounts += 1;
      return acc;
    }, {});

    for (const key in groupedData) {
      branchDataRows.push(groupedData[key]);
    }

    setBranchData(branchDataRows);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(branchData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BranchData');

    const sumInfo = XLSX.utils.json_to_sheet(summedData);
    XLSX.utils.book_append_sheet(wb, sumInfo, 'Summed Product');

    const totalDataSheet = XLSX.utils.json_to_sheet([
      { Category: 'DEMAND DEPOSIT', Total: totalData.demand },
      { Category: 'DOMICILIARY DEPOSIT', Total: totalData.dom },
      { Category: 'SAVINGS', Total: totalData.savings },
      { Category: 'TERM DEPOSIT', Total: totalData.term },
      { Category: 'TOTAL', Total: totalData.total },
    ]);
    XLSX.utils.book_append_sheet(wb, totalDataSheet, 'TotalData');

    XLSX.writeFile(wb, 'liability_data.xlsx');
  };

  const columns = [
    {
      title: 'Caption',
      dataIndex: 'caption',
      key: 'caption',
    },
    {
      title: 'Main Caption',
      dataIndex: 'mainCaption',
      key: 'mainCaption',
    },
    {
      title: 'Actual',
      dataIndex: 'actual',
      key: 'actual',
      render: (text) => new Intl.NumberFormat().format(text),
    },
  ];

  const totalColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => new Intl.NumberFormat().format(text),
    },
  ];

  const branchColumns = [
    {
      title: 'Branch Code',
      dataIndex: 'BranchCode',
      key: 'BranchCode',
    },
    {
      title: 'Branch Name',
      dataIndex: 'BranchName',
      key: 'BranchName',
    },
    {
      title: 'Product Code',
      dataIndex: 'ProductCode',
      key: 'ProductCode',
    },
    {
      title: 'Caption',
      dataIndex: 'Caption',
      key: 'Caption',
    },
    {
      title: 'Actual Balance',
      dataIndex: 'ActualBalance',
      key: 'ActualBalance',
      render: (text) => new Intl.NumberFormat().format(text),
    },
    {
      title: 'Average Balance',
      dataIndex: 'AverageBalance',
      key: 'AverageBalance',
      render: (text) => new Intl.NumberFormat().format(text),
    },
    {
      title: 'No of Accounts',
      dataIndex: 'NumOfAccounts',
      key: 'NumOfAccounts',
    },
  ];

  return (
    <div>
      <DatePicker onChange={onDateChange} style={{ marginBottom: '20px' }} />
      <Button type="primary" onClick={exportToExcel} style={{ marginTop: '20px' }}>
        Export to Excel
      </Button>

      {selectedDate && (
        <>
          <h2>Summed Data Table</h2>
          <Table
            columns={columns}
            dataSource={summedData}
            rowKey={(record) => record.caption}
          />

          <h2>Total Data Table</h2>
          <Table
            columns={totalColumns}
            dataSource={[
              { category: 'DEMAND DEPOSIT', total: totalData.demand },
              { category: 'DOMICILIARY DEPOSIT', total: totalData.dom },
              { category: 'SAVINGS', total: totalData.savings },
              { category: 'TERM DEPOSIT', total: totalData.term },
              { category: 'TOTAL', total: totalData.total },
            ]}
            rowKey={(record) => record.category}
          />

          <h2>Branch Data Table</h2>
          <Table
            columns={branchColumns}
            dataSource={branchData}
            rowKey={(record) => `${record.BranchCode}-${record.Caption}`}
          />
        </>
      )}
    </div>
  );
};

export default LiabilityFigures;
