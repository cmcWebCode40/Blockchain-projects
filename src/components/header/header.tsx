import React, { useContext, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import { BlockChainContext, contractActions } from '../../provider/blockchain.provider.';
import { toast } from 'react-toastify';
import AppUtils from '../../utils/app-utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);



interface IHeader {
  validateBlockchain: any;
}


export default function Header({ validateBlockchain }: IHeader) {
  const classes = useStyles();
  const [isAwaiting, setIsAwaiting] = useState(false)
  const { dispatch, state } = useContext(BlockChainContext);
  const { saveLocalItems } = AppUtils

  const connectWallet = async () => {

    if (!window.ethereum) {
      return validateBlockchain('ethereum');
    }
    setIsAwaiting(!isAwaiting)
    try {
      const connectedAddress = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const payload = {
        userAddress: connectedAddress[0],
      }
      saveLocalItems('WALLET_ADDRESS', connectedAddress[0]);
      dispatch({ type: contractActions.loadContract, payload })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAwaiting(false)
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Lottery Pool
          </Typography>
          <div>
            {state.userAddress ?
              <Typography
                variant="subtitle1" component="strong">
                Address: {state.userAddress.slice(0, 8)}....
               </Typography> : <Button
                variant="contained"
                color="secondary"
                disabled={!!isAwaiting}
                onClick={connectWallet}>Connect Wallet
              </Button>}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
