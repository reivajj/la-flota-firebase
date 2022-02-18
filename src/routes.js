import { Dashboard, Person, Notifications } from "@mui/icons-material";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/DashboardBasicUser.js";
import MyAlbums from "views/Albums/MyAlbums";
import MyArtists from "views/Artists/MyArtists";
import MyLabels from 'views/Labels/MyLabels';
import UserProfile from "views/UserProfile/UserProfile";
import DashboardAdmin from './views/Dashboard/DashboardAdmin';

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/dashboard-admin",
    name: "Dashboard Admin",
    icon: Dashboard,
    component: DashboardAdmin,
    layout: "/admin"
  },
  {
    path: "/artists",
    name: "Artistas",
    icon: Person,
    component: MyArtists,
    layout: "/admin",
  },
  {
    path: "/labels",
    name: "Sellos",
    icon: Person,
    component: MyLabels,
    layout: "/admin"
  },
  {
    path: "/albums",
    name: "Lanzamientos",
    icon: Notifications,
    component: MyAlbums,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Perfil",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
];

export default dashboardRoutes;
