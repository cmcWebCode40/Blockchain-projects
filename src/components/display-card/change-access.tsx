import React, { useContext, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { toast } from 'react-toastify';
import { BlockChainContext } from '../../provider/blockchain.provider.';

const ChangeAccess = ({setIsChange}:any) => {

  const { state } = useContext(BlockChainContext);
  const [address, setAddress] = useState('')
  const [isAwaiting, setIsAwaiting] = useState(false);

  const onSave = async (e:any) => {
    e.preventDefault();
    setIsAwaiting(true)
    try {
      await state.contract.methods.changeContractOwner(address).call();
      toast.success(`Ownership has been transferred to ${address}`)
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsAwaiting(false);
    }
    setIsChange(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }
  return (
    <form onSubmit={onSave}>
      <Box display="flex">  
      <TextField
        id="address"
        hiddenLabel
        size="small"
        required
        onChange={handleChange}
        variant="outlined"
      />
      <Button
      type="submit"
       size="small"
       disabled={!!isAwaiting}
       variant="contained"
        color="primary"
        >Save
        </Button>
        </Box>
    </form>
  )
}

export default ChangeAccess
