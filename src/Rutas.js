import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import AdminLayout from 'layouts/Admin.js';
import DashboardPage from 'views/Dashboard/Dashboard.js';
import UserProfile from 'views/UserProfile/UserProfile.js';
import TableList from 'views/TableList/TableList.js';
import Typography from 'views/Typography/Typography.js';
import Icons from 'views/Icons/Icons.js';
import Notifications from "views/Notifications/Notifications.js";
import FileUpload from 'views/FileUpload/FileUpload';
import UpgradeToPro from 'views/UpgradeToPro/UpgradeToPro.js';
import AuthLayout from 'layouts/Auth.js';
import SignInSide from './views/Login/SingInSide';
import SignUp from './views/Login/SignUp';

const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>

        <AuthLayout>
          <Route path="login" element={<SignInSide />} />
        </AuthLayout>

        <AuthLayout>
          <Route path="sign-up" element={<SignUp />} />
        </AuthLayout>

        <AdminLayout>
          <Route path="admin/dashboard" element={<DashboardPage />} />
        </AdminLayout>

        <AdminLayout>
          <Route path="admin/user" element={<UserProfile />} />
        </AdminLayout>

        <AdminLayout>
          <Route path="admin/table" element={<TableList />} />
        </AdminLayout>

        <AdminLayout>
          <Route path="admin/typography" element={<Typography />} />
        </AdminLayout>

        <AdminLayout>
          <Route path="admin/icons" element={<Icons />} />
        </AdminLayout>

        <AdminLayout>
          <Route path="admin/notifications" element={<Notifications />} />
        </AdminLayout>

        <AdminLayout>
          <Route path="admin/fileupload" element={<FileUpload />} />
        </AdminLayout>

        <AdminLayout>
          <Route path="admin/upgrade-to-pro" element={<UpgradeToPro />} />
        </AdminLayout>

      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;
