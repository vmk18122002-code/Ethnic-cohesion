import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import { SignIn, SignUp } from './pages/Auth.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import Overview from './pages/Overview.jsx';
import Assistant from './pages/Assistant.jsx';
import Cases from './pages/Cases.jsx';
import CaseDetail from './pages/CaseDetail.jsx';
import Journeys from './pages/Journeys.jsx';
import Fees from './pages/Fees.jsx';
import { Forms, Offices, Contacts } from './pages/Info.jsx';
import Profile from './pages/Profile.jsx';
import { ComingSoon, NotFound } from './pages/Misc.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="cases" element={<Cases />} />
        <Route path="cases/:id" element={<CaseDetail />} />
        <Route path="journeys" element={<Journeys />} />
        <Route path="fees" element={<Fees />} />
        <Route path="forms" element={<Forms />} />
        <Route path="offices" element={<Offices />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="services/:slug" element={<ComingSoon />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
