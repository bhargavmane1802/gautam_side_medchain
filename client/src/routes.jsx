import React from "react";
import Layout from './components/layouts/Layout';
import AlertPopup from './components/layouts/AlertPopup';
import Home from './pages/Home';
import Patient from './pages/patient/Patient';
import Doctor from './pages/doctor/Doctor';

const routes = [
  {
    path: '/',
    element: <Layout />, 
    children: [
      {
        index: true,
        element: (
          <>
            <AlertPopup />
            <Home />
          </>
        ),
      },
      {
        path: 'patient',
        element: (
          <>
            <AlertPopup />
            <Patient />
          </>
        ),
      },
      {
        path: 'doctor',
        element: (
          <>
            <AlertPopup />
            <Doctor />
          </>
        ),
      },
    ],
  },
];

export default routes;