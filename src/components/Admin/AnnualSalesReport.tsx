import Chart from "react-apexcharts";
import { bar1, linechart, linechartBorder, white } from "../Common/ColorConstants";
import { Spin } from "antd";
import { amountFormatWithoutCurrency} from "../Common/Constants";
// import { LoadingOutlined } from "@ant-design/icons";
const AnnualSalesReport = (props: any) => {
  const { xaxis, yaxis, loader} = props;
  // const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  // const selectedCurrency = VALID_CURRENCY.includes(currency) ? currency : "AED";

  const series = [
  { name: "AED", data: yaxis.AED },
  { name: "USD", data: yaxis.USD },
];
  const options: object = {
    chart: {
      type: "area",
      height: 350,
      id: "ReportChart",
    },
    yaxis:{
      labels: {
        formatter: (val:number) => `${amountFormatWithoutCurrency(val)}`, // Add your currency here
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100, 100],
      },
    },
    dataLabels: {
      enabled: false,     
    },
    colors: [linechartBorder,bar1],
    stroke: {
       colors: [linechartBorder,bar1],
      width: 3,
    },
    grid: {
      borderColor: linechart,
      clipMarkers: false,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 5,
      colors: [white],
      strokeColor: linechartBorder,
      strokeWidth: 3,
    },
    xaxis: {
      categories: xaxis,
    },
    legend: {
      position: "bottom",
      itemMargin: {
        vertical: 25,
        horizontal: 30,
      },
    },
  };
  return (
    <div id="chart">
      {!loader ? <Chart options={options} series={series} type="area" height={350} /> : <div className="spinner"><Spin className="mainloader pdf" /></div>}
    </div>
  );
};

export default AnnualSalesReport;
