import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import UserRoutes from "./router";
import "./assets/scss/custom.scss";
import "./assets/scss/responsive.scss";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


import React from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

// ReactDOM.hydrateRoot(
//   document.getElementById("app") as HTMLElement,
//   <BrowserRouter>
//     <UserRoutes />
//   </BrowserRouter>
// );

const rootElement = document.getElementById("app") as HTMLElement;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <UserRoutes />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Element with ID "app" not found');
}