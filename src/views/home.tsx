import React, {  useContext } from 'react'
import { makeStyles } from '@material-ui/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid'
import DisplayCard from '../components/display-card/display-card';
import MoneyIcon from '@material-ui/icons/Money';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import VerifiedOwnerIcon from '@material-ui/icons/VerifiedUserOutlined';
import ShuffleOutlinedIcon from '@material-ui/icons/ShuffleOutlined';
import UsersTable from '../components/users-table/users-table';
import AppUtils from '../utils/app-utils';
import CryptoPoolAbi from '../contracts/CryptoPool.json'
import { BlockChainContext, contractActions } from '../provider/blockchain.provider.'
import { toast } from 'react-toastify';


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


type TError = {
  message: string,
  type: string,
  title: string,
  isError: boolean
}

interface IHome {
  validateBlockchain: any;
  error: TError;
}

const Home = ({ validateBlockchain, error }:IHome) => {
  const classes = useStyles();
  const { initializeWeb3, saveLocalItems } = AppUtils;
  const { dispatch, state } = useContext(BlockChainContext);


  React.useEffect(() => {
    startUp()
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        const payload = {
          userAddress: accounts[0],
        }
        saveLocalItems('WALLET_ADDRESS', accounts[0]);
        dispatch({ type: contractActions.loadContract, payload })
      })

      window.ethereum.on('chainChanged', (chainId: number) => {
        window.location.reload()
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const initBlockChain = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId() as keyof typeof CryptoPoolAbi.networks;
    // const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const networkData = CryptoPoolAbi.networks[networkId];
    if (networkData) {
      try {
        const contract = new window.web3.eth.Contract(CryptoPoolAbi.abi, networkData.address);
        const contractBalance = await contract.methods.getContractBalance().call();
        const contractOwnerAddress = await contract.methods.contractOwner().call();
        const players = await contract.methods.getAllCurrentPlayer().call();
        const payload = {
          players,
          contract,
          contractBalance,
          isBlockChainAlive: true,
          contractAddress: networkData.address,
          contractOwnerAddress: contractOwnerAddress.toLowerCase(),
        }

        dispatch({ type: contractActions.loadContract, payload })
      } catch (error) {
        toast.error(error.message)

      }
    } else {
      validateBlockchain('error')
    }
  }

  const startUp = () => {
    const isEthereum = initializeWeb3();
    if (!isEthereum) {
      validateBlockchain('ethereum');
    } else {
      initBlockChain()
    }

  }

  return (
    <div className={classes.root}>
      <Alert severity="info">
        <AlertTitle>Blockchain Network Notice</AlertTitle>
          This Application currently hosted on the Rospten Test Mainnet
       </Alert>
      <Grid container spacing={4}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DisplayCard icon={MoneyIcon} title={'Total Crypto'} type="crypto-balance" value={state.contractBalance} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DisplayCard icon={PeopleIcon} title={'Total Players'} type="total-players" value={state.players.length} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DisplayCard icon={VerifiedOwnerIcon} title={'Lottery Owner'} type="owner" value={state.contractOwnerAddress} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DisplayCard icon={ShuffleOutlinedIcon} title={'Actions'} type="admin-permission" />
        </Grid>
      </Grid>
      <UsersTable />
    </div>
  )
}

export default Home

