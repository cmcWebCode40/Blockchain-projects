


import React, { createContext, useReducer } from 'react';
import AppUtils from '../utils/app-utils';

const {getLocalItems} = AppUtils;


interface InitialContractState {
  contract: any,
  contractAddress: string,
  userAddress: string,
  contractBalance: string,
  contractOwnerAddress: string,
  players: string[],
  isBlockChainAlive:boolean
}

const initialContractState: InitialContractState = {
  contract: {},
  userAddress:getLocalItems('WALLET_ADDRESS')||'',
  contractAddress: '',
  contractBalance: '',
  contractOwnerAddress:'',
  players: [],
  isBlockChainAlive:false
}

export const contractActions = {
  loadContract: 'LOAD_CONTRACT',
  contractAddress: 'CONTRACT_ADDRESS',
  contractBalance: 'CONTRACT_BALANCE',
  players: 'PLAYERS',
}

type PayLoadAction = {
  type: string;
  payload: any
}

type IContext ={
  dispatch?:any;
  state:InitialContractState
}

const contractReducer = (state = initialContractState, { type, payload }: PayLoadAction) => {
  
  switch (type) {
    case contractActions.loadContract:
      return { ...state, ...payload }
    default:
      return state
  }
}
export const BlockChainContext = createContext<IContext>({
  state:initialContractState,
})

const ContextApiProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(contractReducer, initialContractState)

  return (
    <BlockChainContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </BlockChainContext.Provider>
  )
}

export default ContextApiProvider
