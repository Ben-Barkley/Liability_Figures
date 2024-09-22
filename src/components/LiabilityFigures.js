  import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
// import axios from 'axios';
import jsonData from './dataCom';

const LiabilityFigures = () => {
  const [data, setData] = useState([]);
  const [summedData, setSummedData] = useState([]);

  useEffect(() => {
    // Fetch data from FinTrak API

    setData(jsonData)
    calculateSums(jsonData)

  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(jsonData); // API endpoint
  //       console.log(response, 'data sucessful')
  //       setData(response.data);
  //       calculateSums(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  }, []);

  const calculateSums = (data) => {
    const summedRows = [];
    const captions = ['DEMAND DEPOSIT', 'DOMICILIARY DEPOSIT', 'SAVINGS', 'TERM DEPOSIT'];

    let totalActual = 0;

    captions.forEach((caption) => {
      const filteredData = data.filter((row) => row.Caption === caption);
      const actualSum = filteredData.reduce((sum, row) => sum + row.ActualBalance, 0);
      const averageSum = filteredData.reduce((sum, row) => sum + row.AverageBalance, 0);

      totalActual += actualSum;

      summedRows.push({
        caption,
        mainCaption: `${caption} SUMMARY`,
        actual: actualSum,
        average: averageSum,
      });
    });

    // Add a total row
    summedRows.push({
      caption: 'TOTAL',
      mainCaption: 'TOTAL SUMMARY',
      actual: totalActual,
      average: summedRows.reduce((sum, row) => sum + row.average, 0),
    });

    setSummedData(summedRows);
  };

  const columns = [
    {
      title: 'Branch Code',
      dataIndex: 'Branch_Code',
      key: 'Branch_Code',
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
    },
    {
      title: 'Average Balance',
      dataIndex: 'AverageBalance',
      key: 'AverageBalance',
    },
    {
      title: 'No Of Accounts',
      dataIndex: 'NoOfAccounts',
      key: 'NoOfAccounts',
    },
  ];

  const summaryColumns = [
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
    },
    {
      title: 'Average',
      dataIndex: 'average',
      key: 'average',
    },
  ];
  const getCounter= () => {
    let count = 0;
    return () => ++count;
  }
  const counter1 = getCounter()
  const counter2 = getCounter()

  console.log(counter1())
  console.log(counter1())
  console.log(counter2())
  console.log(counter2())
  return (
    <div>
      <h2>Data Table</h2>
      <Table columns={columns} dataSource={data} rowKey={(record) => record.Branch_Code} />

      <h2>Summed Data Table</h2>
      <Table columns={summaryColumns} dataSource={summedData} rowKey={(record) => record.caption} />

  
    </div>
  );
};

export default LiabilityFigures;

  