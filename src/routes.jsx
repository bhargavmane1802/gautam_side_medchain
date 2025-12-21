// Guards
import Layout from './components/layouts/Layout';
import AlertPopup from './components/layouts/AlertPopup';

// Pages
import Home from './pages/Home';
import Patient from './pages/patient/Patient';
import Doctor from './pages/doctor/Doctor';
import HeaderAppBar from './components/layouts/Layout';

const routes = [
  {
    path: '/',
    element: <Layout />, // Optional wrapper layout
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
            <HeaderAppBar />
            <AlertPopup />
            <Patient />
          </>
        ),
      },
      {
        path: 'doctor',
        element: (
          <>
            <HeaderAppBar />
            <AlertPopup />
            <Doctor />
          </>
        ),
      },
    ],
  },
];

export default routes;
