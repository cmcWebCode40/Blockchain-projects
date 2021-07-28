import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core';
import { BlockChainContext } from '../../provider/blockchain.provider.';
import ModalAlert from '../modal-alert/modal-alert';
import { toast } from 'react-toastify';
import ChangeAccess from './change-access';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: '100%',
    margin: '1rem 0',
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    // backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 40,
    width: 40,
    display: 'block',
    // margin:'1rem 0'

  },
  difference: {
    marginTop: '2rem',
    display: 'flex',
    alignItems: 'center'
  },
  box: {
    '& > *': {
      margin: theme.spacing(0.4, 0.5)
    }
  },
  iconDiv: {
    display: 'flex',
    justifyContent: 'center', alignItems: 'center', flexFlow: 'column nowrap', margin: '1rem 0'
  }
}));


type CardType = 'crypto-balance' | 'total-players' | 'owner' | 'admin-permission'

interface DisplayCardProps {
  title: string;
  value?: string | string[] | number;
  icon: any,
  type: CardType
}
interface IMessage {
  status: 'success' | 'error';
  message?: string,
  isOpen: boolean
}


const DisplayCard = ({ icon: AvatarIcon, title, value, type }: DisplayCardProps): JSX.Element => {
  const classes = useStyles();
  const { state } = useContext(BlockChainContext);
  const [isAwaiting, setIsAwaiting] = useState(false)
  const [isChange, setIsChange] = useState(false)
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<IMessage>({ status: 'error', message: '', isOpen: false })
  const [admin, setAdmin] = useState<boolean>(false)
  const totalPlayers: number = state.players.length



  const onPickWinner = async () => {
    if (totalPlayers >= 3) {
          setIsAwaiting(true)
      try {
        const connectedAddress = await state.contract.methods.pickWinner().call();
        const contractBalance = await state.contract.methods.getContractBalance().call();
        setMessage({
          status: 'success', isOpen: true, message: `Hurray the Winner is 
      ${connectedAddress} and the total of 
      ${window?.web3?.utils?.fromWei(contractBalance)} 
      ETH has been sent to address` });
        setOpen(!open)
      } catch (error) {
        toast.error(error.message)
        
      } finally {
        setIsAwaiting(false)
      }

    } else {
      return toast.error('There must be at least 3 players before picking a winner');
    }

  }

  const pickWinner = (
    <Button
      variant="contained"
      color="primary"
      disabled={!!isAwaiting}
      onClick={onPickWinner}>
      Pick Winner
    </Button>
  )
  const ChangeOwner = () => {
    return (
      <>
        {isChange ? <ChangeAccess setIsChange={setIsChange}/> : <Button onClick={() => {
          setIsChange(true);
        }} variant="contained" color="secondary">Change Ownership</Button>}
      </>
    )
  }

  const onClose = () => {
    setMessage({
      status: 'success', isOpen: false, message: ``
    })
  }

  const CustomAlert = () => {
    return (
      <ModalAlert open={open} setOpen={setOpen}>
        <Typography align="center" className={classes.iconDiv}>{message.status === 'success' ?
          <CheckCircleOutlineIcon className={classes.icon} color="primary" fontSize="large" />
          : <ErrorOutlineIcon className={classes.icon} fontSize="large" color="error" />
        }</Typography>
        <Typography variant="body1">
          {message.message}
        </Typography>
      </ModalAlert>
    )
  }

  useEffect(() => {
    if (state.contractOwnerAddress && state.userAddress) {
      if (state.contractOwnerAddress.toLowerCase() === state.userAddress.toLowerCase()) {
        setAdmin(true)
      }
    }

  }, [state])

  return (
    <Card className={(classes.root)}>
      <CustomAlert />
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="h5"
            >
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AvatarIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Typography variant="body1">
            {type === 'crypto-balance' ? `${window?.web3?.utils?.fromWei(value) || 0} ETH` : value}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        {type === 'owner' && admin && <ChangeOwner />}
        {type === 'admin-permission' && admin && pickWinner}
      </CardActions>
    </Card>
  );
};

export default DisplayCard;