import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Admin from 'layouts/Admin';
import DashboardPage from 'views/Dashboard/Dashboard.js';
import UserProfile from 'views/UserProfile/UserProfile.js';
import TableList from 'views/TableList/TableList.js';
import Typography from 'views/Typography/Typography.js';
import Icons from 'views/Icons/Icons.js';
import Notifications from "views/Notifications/Notifications.js";
import FileUpload from 'views/FileUpload/FileUpload';
import UpgradeToPro from 'views/UpgradeToPro/UpgradeToPro.js';

const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* <AuthLayout>
          <Route path="login" element={<Login />} />
        </AuthLayout> */}

        <Admin>
          <Route path="admin/dashboard" element={<DashboardPage />} />
        </Admin>

        <Admin>
          <Route path="admin/user" element={<UserProfile />} />
        </Admin>

        <Admin>
          <Route path="admin/table" element={<TableList />} />
        </Admin>

        <Admin>
          <Route path="admin/typography" element={<Typography />} />
        </Admin>

        <Admin>
          <Route path="admin/icons" element={<Icons />} />
        </Admin>

        <Admin>
          <Route path="admin/notifications" element={<Notifications />} />
        </Admin>

        <Admin>
          <Route path="admin/fileupload" element={<FileUpload />} />
        </Admin>

        <Admin>
          <Route path="admin/upgrade-to-pro" element={<UpgradeToPro />} />
        </Admin>

      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;
