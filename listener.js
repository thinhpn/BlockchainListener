require('dotenv').config();
const Web3 =  require('web3');

const kyberProxyAbi = [
    {
      constant: true,
      inputs: [],
      name: 'enabled',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'src', type: 'address' },
        { name: 'srcAmount', type: 'uint256' },
        { name: 'dest', type: 'address' },
        { name: 'destAddress', type: 'address' },
        { name: 'maxDestAmount', type: 'uint256' },
        { name: 'minConversionRate', type: 'uint256' },
        { name: 'walletId', type: 'address' },
        { name: 'hint', type: 'bytes' },
      ],
      name: 'tradeWithHint',
      outputs: [{ name: '', type: 'uint256' }],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'maxGasPrice',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'user', type: 'address' }],
      name: 'getUserCapInWei',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: 'src', type: 'address' },
        { name: 'dest', type: 'address' },
        { name: 'srcQty', type: 'uint256' },
      ],
      name: 'getExpectedRate',
      outputs: [
        { name: 'expectedRate', type: 'uint256' },
        { name: 'slippageRate', type: 'uint256' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: 'user', type: 'address' },
        { name: 'token', type: 'address' },
      ],
      name: 'getUserCapInTokenWei',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'id', type: 'bytes32' }],
      name: 'info',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ];
const kyberProxyContract = '0x818E6FECD516Ecc3849DAf6845e3EC868087B755';
const ETHAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAIAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';


const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_URL));
const AMOUNT_DAI= web3.utils.toWei('100', 'ether');
const AMOUNT_ETH = web3.utils.toWei('100', 'ether');

const kyber = new web3.eth.Contract(kyberProxyAbi, kyberProxyContract);

web3.eth.subscribe('newBlockHeaders')
.on('data', async block => {
    console.log('new Block is # ',block.number);
    const kyberResult =  await Promise.all([
        kyber
            .methods
                .getExpectedRate(
                    DAIAddress, 
                    ETHAddress,
                    AMOUNT_DAI
                ).call(),
        kyber
            .methods
                .getExpectedRate(                    
                    ETHAddress,
                    DAIAddress, 
                    AMOUNT_ETH
                ).call()
    ])

    const kyberRates = {
        buy: parseFloat(1 / (kyberResult[0].expectedRate / (10 **18))),
        sell: parseFloat(kyberResult[1].expectedRate / (10 **18))
    };
    console.log('Ty gia ETH/DAI');
    console.log(kyberRates);
})
.on('error', error => {
    console.log(error);
});


