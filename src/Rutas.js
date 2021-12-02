import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import AdminLayout from 'layouts/Admin.js';
import DashboardPage from 'views/Dashboard/Dashboard.js';
// import UserProfile from 'views/UserProfile/UserProfile.js';
import TableList from 'views/TableList/TableList.js';
import Typography from 'views/Typography/Typography.js';
import Icons from 'views/Icons/Icons.js';
import Notifications from "views/Notifications/Notifications.js";
import UpgradeToPro from 'views/UpgradeToPro/UpgradeToPro.js';
import AuthLayout from 'layouts/Auth.js';
import SignInSide from 'views/Login/SingInSide';
import SignUp from 'views/Login/SignUp';
import MyArtists from 'views/Artists/MyArtists';
import NewArtist from 'views/Artists/NewArtist';
import MyLabels from 'views/Labels/MyLabels';
import NewLabel from 'views/Labels/NewLabel';
import MyAlbums from 'views/Albums/MyAlbums';
import NewAlbum from 'views/Albums/NewAlbum';
import UserProfileTest from 'views/UserProfile/UserProfileTest';

const Rutas = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<AuthLayout />}>
          <Route path="" element={<SignInSide />} />
          <Route path="login" element={<SignInSide />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>

        <Route path="/admin/" element={<AdminLayout />}>

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="user" element={<UserProfileTest />} />
          <Route path="table" element={<TableList />} />
          <Route path="typography" element={<Typography />} />
          <Route path="icons" element={<Icons />} />
          <Route path="notifications" element={<Notifications />} />

          <Route path="artists" element={<MyArtists />} />
          <Route path="new-artist" element={<NewArtist />} />

          <Route path="labels" element={<MyLabels />} />
          <Route path="new-label" element={<NewLabel />} />

          <Route path="albums" element={<MyAlbums />} />
          <Route path="new-album" element={<NewAlbum />} />

          <Route path="upgrade-to-pro" element={<UpgradeToPro />} />
        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default Rutas;
