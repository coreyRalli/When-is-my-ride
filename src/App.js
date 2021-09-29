import { createTheme, ThemeProvider } from "@mui/material/styles";

import Paper from '@mui/material/Paper';
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CssBaseline from '@mui/material/CssBaseline';

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

import { NavLink, Route, Switch as RouterSwitch } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';

import Home from './Views/Home/Home';
import Search from './Views/Search/Search';
import Stop from './Views/Stop/Stop';
import Run from './Views/Run/Run';

import './App.css';
import { useMemo } from "react";

import AppContext from './AppContext';
import { useAsyncReducer } from "./utils/customHooks";

import * as AppReducer from './AppReducer';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () => createTheme({ palette: { mode: prefersDarkMode ? 'dark' : 'light' } }),
    [prefersDarkMode]
  );

  const [state, dispatch] = useAsyncReducer(AppReducer.appReducer, AppReducer.defaultState);

  return (
    <AppContext.Provider value={{ appState: state, appDispatcher: dispatch }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className="application" elevation={3}>
          <RouterSwitch>
            <Route path="/search" component={Search} />
            <Route path="/stop/:id" component={Stop} />
            <Route path="/run/:id" component={Run} />
            <Route path="/" component={Home} />
          </RouterSwitch>

          <Paper sx={{ gridArea: 'NavBar' }}>
            <BottomNavigation showLabels>
              <BottomNavigationAction to="/" component={NavLink} label="Home" icon={<HomeIcon />} />
              <BottomNavigationAction to="/search" component={NavLink} label="Search" icon={<SearchIcon />} />
            </BottomNavigation>
          </Paper>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
