import React, { useState } from 'react';
import { Button, createMuiTheme, CssBaseline, makeStyles } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Header from './components/header/header';
import ContextApiProvider from './provider/blockchain.provider.';
import Home from './views/home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import metaMaskIcon from './assets/meta-mask.jpg';
import ModalAlert from './components/modal-alert/modal-alert';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#009688',
    },
    secondary: {
      main: '#ff9100',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: ['Source Sans Pro', 'sans-serif'].join(',')
  }
});

type ErrorType = 'error' | 'ethereum';

const useStyles = makeStyles(() => ({
  root: {
    padding: '0.4rem',
    margin: '0 1rem',
  },
  textContent: {
    display: 'block',
    textAlign: 'center',
    margin: '0.6rem 0.3rem',
  }
}));

const metaMasksLink = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en';

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({
    type: '',
    message: '',
    isError: false,
    title: '',
  })

  const validateBlockchain = (type: ErrorType) => {
    if (type === 'error') {
      setError({
        message: 'This contract is not currently deployed on the selected blockchain network please select the Ropsten Test Net',
        type: 'error',
        title: 'Error in  Blockchain Network',
        isError: true
      })
    } else {
      setError({
        message: 'You need to install a browser wallet consider installing meta mask!',
        type: 'ethereum',
        title: 'Not Supported Ethereum Browser',
        isError: true
      })
    }
    setOpen(!open)
  }
  return (
    <ContextApiProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ModalAlert open={open} setOpen={setOpen} title={error.title}>
          {error.type === 'ethereum' ?
            <>
              <img src={metaMaskIcon} alt="Meta Mask" />
              <span className={classes.textContent}>{error.message}</span>
              <Button href={metaMasksLink} variant="contained" color="primary">Install Meta Mask</Button>
            </>
            : error.message}
        </ModalAlert>
        <Header validateBlockchain={validateBlockchain} />
        <Home error={error} validateBlockchain={validateBlockchain} />
        
        <ToastContainer />
      </ThemeProvider>
    </ContextApiProvider>
  );
}

export default App;
