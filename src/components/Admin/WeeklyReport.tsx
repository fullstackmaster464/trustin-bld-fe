import Chart from "react-apexcharts";
import { bar1, bar2, bar3, bar4 } from "../Common/ColorConstants";
import { useEffect, useState } from "react";
import { Spin } from "antd";

const WeeklyReport = (props:any) => {
  const {graphData,loader} = props
  const [completedStatusList, setCompletedStatusList] = useState([]);
  const [pendingStatusList, setPendingStatusList] = useState([]);
  const [rejectedStatusList, setRejectedStatusList] = useState([]);
  const [progressStatusList, setProgressStatusList] = useState([]);
  const series: any = [
    {
      name: "Pending",
      data: pendingStatusList,
    },
    {
      name: "In progress",
      data: progressStatusList,
    },
    {
      name: "Rejected",
      data: rejectedStatusList,
    },
    {
      name: "Completed",
      data: completedStatusList,
    },
  ];
  const options: any = {
    chart: {
      type: "bar",
      height: 350,
      id: "WeeklyReport",
    },
    colors: [bar1, bar2, bar3, bar4],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        endingShape: "rounded",
        borderRadiusApplication: "end",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    legend: {
      position: "bottom",
      itemMargin: {
        vertical: 25,
        horizontal: 30,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return val;
        },
      },
    },
  };
  useEffect(() => {    
      let weekDays:any = [];
      let completedStatus:any = [];
      let progressStatus:any = [];
      let pendingStatus:any = [];
      let rejectedStatus:any = [];
      graphData?.map((item:any) => {
        weekDays.push(item?.label);
        completedStatus.push(item?.completed);
        progressStatus.push(item?.progress);
        pendingStatus.push(item?.pending);
        rejectedStatus.push(item?.rejected);
      });
      // setWeekList(weekDays);
      setCompletedStatusList(completedStatus);
      setPendingStatusList(pendingStatus);
      setRejectedStatusList(rejectedStatus);
      setProgressStatusList(progressStatus);
  }, [graphData]);
  return (
    <div id="chart">
      {loader === false ? <Chart options={options} series={series} type="bar" height={350} /> : <div className="spinner"><Spin className="mainloader pdf" /></div>}
      
    </div>
  );
};

export default WeeklyReport;
