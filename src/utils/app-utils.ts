import Web3 from "web3";

const localRPCServer = "HTTP://127.0.0.1:7545";

declare global {
  interface Window {
    web3: any;
    ethereum: any;
    cleanEthereum: any;
  }
}

class AppUtils {
  public static initializeWeb3 = () => {
    let isEthereum;
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // window.ethereum.enabled()
      isEthereum = true;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      isEthereum = true;
      // window.ethereum.enabled()
    } else {
      // window.alert('Please install a browser wallet')
      isEthereum = false;
    }
    return isEthereum;
  };
  public static initContractAbi = () => {};

  public static saveLocalItems = <T>(name: string, data: T): void => {
    localStorage.setItem(name, JSON.stringify(data));
  };
  public static getLocalItems = (name: string) => {
    const items = localStorage.getItem(name);
    if (items) {
      try {
        return JSON.parse(items);
      } catch (error) {
        return "";
      }
    } else {
      return "";
    }
  };
}

export default AppUtils;
