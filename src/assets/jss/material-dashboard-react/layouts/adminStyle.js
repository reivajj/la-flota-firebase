import {
  drawerWidth,
  transition,
  container
} from "assets/jss/material-dashboard-react.js";

import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const appStyle = {
  wrapper: {
    position: "relative",
    // top: "10",
    // height: "100vh",
    // marginTop: "80px",
    marginLeft: "0px",
    // marginRight: "30px"
  },
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    overflow: "hidden",
    position: "relative",
    float: "right",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch"
  },
  content: {
    marginTop: "10px",
    padding: "10px 15px",
    // minHeight: "calc(100vh - 123px)"
  },
  container,
};

export default appStyle;
