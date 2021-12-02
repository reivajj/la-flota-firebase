import { Dashboard, Person, LibraryBooks, Notifications } from "@mui/icons-material";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
// import UserProfile from "views/UserProfile/UserProfile.js";
// import TableList from "views/TableList/TableList.js";
// import Typography from "views/Typography/Typography.js";
import MyAlbums from "views/Albums/MyAlbums";
import MyArtists from "views/Artists/MyArtists";
import MyLabels from 'views/Labels/MyLabels';
import UserProfileTest from "views/UserProfile/UserProfileTest";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  // {
  //   path: "/table",
  //   name: "Table List",
  //   icon: "content_paste",
  //   component: TableList,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: BubbleChart,
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/admin"
  // },
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
    component: UserProfileTest,
    layout: "/admin"
  },
  // {
  //   path: "/upgrade-to-pro",
  //   name: "Upgrade To PRO",
  //   icon: Unarchive,
  //   component: UpgradeToPro,
  //   layout: "/admin"
  // }
];

export default dashboardRoutes;
