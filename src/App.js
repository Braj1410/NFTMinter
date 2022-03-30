import { useState } from "react";
import { create } from "ipfs-http-client";
import Web3 from "web3";
//https://rinkeby.etherscan.io/address/0xA07721F8B2A95AaCa764d943d182e6Cb8042c62f#code

const ERC721Address = "0xA07721F8B2A95AaCa764d943d182e6Cb8042c62f";
const ERC721Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
      {
        internalType: "string",
        name: "_CarData",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "CarData",
    outputs: [
      {
        internalType: "string",
        name: "_CarData",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const ipfs_base_url = "https://ipfs.io/ipfs/";
const ipfs_tag = "ipfs://";

function App() {
  const [traits, setTraits] = useState({
    name: "",
    description: "",
    RegistrationNumber: 0,
    acceleration: 0,
    handling: 0,
    braking: 0,
    topspeed: 0,
  });
  const [imageHash, setImageHash] = useState("");
  const [loading, setLoading] = useState(false);

  const ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
  });

  const handleChange = (e) => {
    setTraits({ ...traits, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files;

    if (file[0]) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file[0]);

      reader.onloadend = (res) => {
        res = Buffer(reader.result);
        setImageHash(res);
      };
    }
  };
  const convert = (str) => {
    let val = 0;
    // Convert the String
    try {
      val = parseInt(str);
    } catch (e) {
      // This is thrown when the String
      // contains characters other than digits
      console.log("error when converting");
    }
    return val;
  };

  function getRegno(str, iteration) {
    let series = str.slice(1, 3);
    let slice = str.slice(4, 7);
    let number = parseInt(slice);
    let add = number + iteration;
    console.log(series, slice, number, add);
  }

  const handleMint10 = async () => {
    for (let i = 0; i < 10; i++) {
      let regno = getRegno(traits.RegistrationNumber, i);

      try {
        const img_hash = await ipfs.add(imageHash);
        const args = {
          image: `${ipfs_base_url}${img_hash.path}`,
          name: traits.name,
          description: traits.description,
          traits: [
            {
              trait_type: "Acceleration",
              value: traits.acceleration,
            },
            {
              trait_type: "Handling",
              value: traits.handling,
            },
            {
              trait_type: "Braking",
              value: traits.braking,
            },
            {
              trait_type: "TopSpeed",
              value: traits.topspeed,
            },
            {
              trait_type: "RegistrationNumber",
              value: regno,
            },
          ],
        };
        const result = await ipfs.add(Buffer.from(JSON.stringify(args)));

        console.log(`${ipfs_tag}${result.path}`);

        const web3 = new Web3(window.ethereum);

        const contract = new web3.eth.Contract(ERC721Abi, ERC721Address);

        console.log(contract);

        // contract.methods
        //   .mint(
        //     window.ethereum.selectedAddress,
        //     `${ipfs_tag}${result.path}`,
        //     regno
        //   )
        //   .send({ from: window.ethereum.selectedAddress });

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        alert("error occured");
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const img_hash = await ipfs.add(imageHash);
      const args = {
        image: `${ipfs_base_url}${img_hash.path}`,
        name: traits.name,
        description: traits.description,
        traits: [
          {
            trait_type: "Acceleration",
            value: traits.acceleration,
          },
          {
            trait_type: "Handling",
            value: traits.handling,
          },
          {
            trait_type: "Braking",
            value: traits.braking,
          },
          {
            trait_type: "TopSpeed",
            value: traits.topspeed,
          },
          {
            trait_type: "RegistrationNumber",
            value: traits.RegistrationNumber,
          },
        ],
      };
      const result = await ipfs.add(Buffer.from(JSON.stringify(args)));

      console.log(`${ipfs_tag}${result.path}`);

      const web3 = new Web3(window.ethereum);

      const contract = new web3.eth.Contract(ERC721Abi, ERC721Address);

      console.log(contract);

      contract.methods
        .mint(
          window.ethereum.selectedAddress,
          `${ipfs_tag}${result.path}`,
          traits.RegistrationNumber
        )
        .send({ from: window.ethereum.selectedAddress });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("error occured");
    }
  };

  return (
    <div className="App">
      <div className="form-input">
        <p>Name</p>
        <input
          type="text"
          name="name"
          value={traits.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-input">
        <p>Description</p>
        <textarea
          type="text"
          name="description"
          value={traits.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-input">
        <p>Acceleration</p>
        <input
          type="number"
          name="acceleration"
          value={traits.acceleration}
          onChange={handleChange}
        />
      </div>
      <div className="form-input">
        <p>Handling</p>
        <input
          type="number"
          name="handling"
          value={traits.handling}
          onChange={handleChange}
        />
      </div>
      <div className="form-input">
        <p>braking</p>
        <input
          type="number"
          name="braking"
          value={traits.braking}
          onChange={handleChange}
        />
      </div>
      <div className="form-input">
        <p>topspeed</p>
        <input
          type="number"
          name="topspeed"
          value={traits.topspeed}
          onChange={handleChange}
        />
      </div>
      <div className="form-input">
        <p>RegistrationNumber</p>
        <input
          type="text"
          name="RegistrationNumber"
          value={traits.RegistrationNumber}
          onChange={handleChange}
        />
      </div>
      <div className="form-input">
        <p>Image</p>
        <input type="file" onChange={handleImage} />
      </div>
      <button onClick={() => handleSubmit()} disabled={loading}>
        {loading ? "Loading" : "Submit"}
      </button>
      {/* <button onClick={() => handleMint10()} disabled={loading}>
        {loading ? "Loading" : "Mint10"}
      </button> */}
      {/* <button onClick={() => handleMint25()} disabled={loading}>
        {loading ? "Loading" : "Mint25"}
      </button> */}
      {/* <button onClick={() => handleMint50()} disabled={loading}>
        {loading ? "Loading" : "Mint50"}
      </button> */}
    </div>
  );
}

export default App;
