import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import AdminLayout from 'layouts/Admin.js';
import DashboardPage from 'views/Dashboard/DashboardBasicUser';
// import UserProfile from 'views/UserProfile/UserProfile.js';
import Typography from 'views/Typography/Typography.js';
import Icons from 'views/Icons/Icons.js';
import Notifications from "views/Notifications/Notifications.js";
// import UpgradeToPro from 'views/UpgradeToPro/UpgradeToPro.js';
import AuthLayout from 'layouts/Auth.js';
import SignInSide from 'views/Login/SingInSide';
// import SignUp from 'views/Login/SignUp';
import MyArtists from 'views/Artists/MyArtists';
import NewArtist from 'views/Artists/NewArtist';
import MyLabels from 'views/Labels/MyLabels';
import NewLabel from 'views/Labels/NewLabel';
import MyAlbums from 'views/Albums/MyAlbums';
import NewAlbum from 'views/Albums/NewAlbum';
import UserProfile from 'views/UserProfile/UserProfile';
import AlbumTotalInfo from './views/Albums/AlbumTotalInfo';
import DashboardAdmin from './views/Dashboard/DashboardAdmin';
import MyUsers from './views/Users/MyUsers';
import Test from './views/ViewTest/Test';
import Subscription from './views/Subscription/Subscription';
import Royalties from "views/Royalties/Royalties.js";
import Payouts from 'views/Royalties/Payouts';
import PayoutForm from "views/Royalties/PayoutForm";

const Rutas = () => {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<AuthLayout />}>
          <Route path="" element={<SignInSide />} />
          <Route path="login" element={<SignInSide />} />
          {/* <Route path="sign-up" element={<SignUp />} /> */}
        </Route>

        <Route path="/admin/" element={<AdminLayout />}>

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard-admin" element={<DashboardAdmin />} />
          <Route path="user" element={<UserProfile />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="regalias" element={<Royalties />} />

          <Route path="retiros/" >
            <Route path="" element={<Payouts />} />
            <Route path="solicitud" element={<PayoutForm />} />
          </Route>

          <Route path="typography" element={<Typography />} />
          <Route path="icons" element={<Icons />} />
          <Route path="notifications" element={<Notifications />} />

          <Route path="artists" element={<MyArtists />} />
          <Route path="new-artist" element={<NewArtist editing={false} />} />
          <Route path="edit-artist/:artistId" element={<NewArtist editing={true} />} />

          <Route path="labels" element={<MyLabels />} />
          <Route path="new-label" element={<NewLabel />} />

          <Route path="albums" element={<MyAlbums />} />
          <Route path="albums/:albumId" element={<AlbumTotalInfo />} />
          <Route path="new-album" element={<NewAlbum editing={false} />} />

          <Route path="users" element={<MyUsers />} />

          <Route path="test" element={<Test />} />

          {/* <Route path="upgrade-to-pro" element={<UpgradeToPro />} /> */}

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default Rutas;
