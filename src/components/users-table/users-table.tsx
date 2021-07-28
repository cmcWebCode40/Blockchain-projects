import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { BlockChainContext, contractActions } from '../../provider/blockchain.provider.';
import { toast } from 'react-toastify';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root: {
    margin: '2rem 0 0 0'
  }
});


export default function UsersTable() {
  const classes = useStyles();
  const { state, dispatch } = useContext(BlockChainContext);

  const onSignTx = () => {
    if (!state.userAddress) {
      return toast.warning('Please connect your wallet to sign Transactions')
    }
    window.web3.eth.sendTransaction({
      from: state.userAddress,
      to: state.contractAddress,
      value: window.web3.utils.toWei('0.01', 'ether'),
    })
      .then(function (receipt: any) {
        toast.success('Successfully Deposited 0.01ETH');
        dispatch({ type: contractActions.loadContract, payload: { isBlockChainAlive: true } })
      }).catch((error: any) => {
        toast.error(error.message)
      });
  }

  return (
    <Card className={classes.root}>
      <CardHeader title={`All Player (${state.players.length})`}
        action={<Button variant="contained" onClick={onSignTx} color="primary">Play Now</Button>} />
      <CardContent>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Amount (ETH)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.players.map((row: string) => (
              <TableRow key={Math.random()}>
                <TableCell component="th" scope="row">
                  {row}
                </TableCell>
                <TableCell>{'0.1'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
