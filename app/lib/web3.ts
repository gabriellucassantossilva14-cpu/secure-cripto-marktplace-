import Web3 from 'web3';

const MARKETPLACE_ABI = [
  {
    "inputs": [{"internalType": "bytes32", "name": "anonymousHash", "type": "bytes32"}],
    "name": "registerSeller",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerBuyer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "uint256", "name": "price", "type": "uint256"}
    ],
    "name": "listProduct",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "productId", "type": "uint256"}],
    "name": "createOrder",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "orderId", "type": "uint256"}],
    "name": "confirmDelivery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "orderId", "type": "uint256"}],
    "name": "releaseFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let web3: Web3;
let marketplaceContract: any;
let userAccount: string;

export const initWeb3 = async () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    web3 = new Web3((window as any).ethereum);
    
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      userAccount = accounts[0];
      return true;
    } catch (error) {
      console.error('User rejected connection:', error);
      return false;
    }
  }
  return false;
};

export const getAccount = (): string => userAccount;

export const switchNetwork = async (chainId: number) => {
  try {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: web3.utils.toHex(chainId) }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      console.error('Network not found in wallet');
    }
  }
};

export const getMarketplaceContract = (contractAddress: string) => {
  if (!marketplaceContract) {
    marketplaceContract = new web3.eth.Contract(MARKETPLACE_ABI, contractAddress);
  }
  return marketplaceContract;
};

export const registerSeller = async (contractAddress: string, anonymousHash: string) => {
  const contract = getMarketplaceContract(contractAddress);
  const hash = web3.utils.keccak256(anonymousHash);
  
  return contract.methods.registerSeller(hash).send({
    from: userAccount,
  });
};

export const registerBuyer = async (contractAddress: string) => {
  const contract = getMarketplaceContract(contractAddress);
  return contract.methods.registerBuyer().send({ from: userAccount });
};

export const listProduct = async (
  contractAddress: string,
  ipfsHash: string,
  priceInEth: number
) => {
  const contract = getMarketplaceContract(contractAddress);
  const priceInWei = web3.utils.toWei(priceInEth.toString(), 'ether');
  
  return contract.methods.listProduct(ipfsHash, priceInWei).send({
    from: userAccount,
  });
};

export const createOrder = async (
  contractAddress: string,
  productId: number,
  priceInEth: number
) => {
  const contract = getMarketplaceContract(contractAddress);
  const priceInWei = web3.utils.toWei(priceInEth.toString(), 'ether');
  
  return contract.methods.createOrder(productId).send({
    from: userAccount,
    value: priceInWei,
  });
};

export const confirmDelivery = async (contractAddress: string, orderId: number) => {
  const contract = getMarketplaceContract(contractAddress);
  return contract.methods.confirmDelivery(orderId).send({ from: userAccount });
};

export const releaseFunds = async (contractAddress: string, orderId: number) => {
  const contract = getMarketplaceContract(contractAddress);
  return contract.methods.releaseFunds(orderId).send({ from: userAccount });
};

export const getUserStats = async (
  contractAddress: string,
  userAddress: string
) => {
  const contract = getMarketplaceContract(contractAddress);
  return contract.methods.getUserStats(userAddress).call();
};

export const getProductDetails = async (
  contractAddress: string,
  productId: number
) => {
  const contract = getMarketplaceContract(contractAddress);
  return contract.methods.getProductDetails(productId).call();
};

export const getOrderDetails = async (
  contractAddress: string,
  orderId: number
) => {
  const contract = getMarketplaceContract(contractAddress);
  return contract.methods.getOrderDetails(orderId).call();
};

export const listenToAccountChanges = (callback: (account: string) => void) => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
      userAccount = accounts[0];
      callback(userAccount);
    });
  }
};

export const listenToNetworkChanges = (callback: (chainId: number) => void) => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    (window as any).ethereum.on('chainChanged', (chainId: string) => {
      callback(parseInt(chainId, 16));
    });
  }
};
