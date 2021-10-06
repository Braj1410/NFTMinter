import { useState } from "react";
import { create } from 'ipfs-http-client'

const ipfs_base_url="https://ipfs.io/ipfs/"

function App() {

  const [traits, setTraits] = useState({
    acceleration: 0,
    engine: 0,
    range: 0,
    nitro:0
  })
  const [imageHash, setImageHash] = useState("")
  const [loading,setLoading]=useState(false)
  
  const ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
  });

  const handleChange = (e) => {
    setTraits({...traits,[e.target.name]:e.target.value})
  }

  const handleImage = (e) => {
    let file = e.target.files
    
    if (file[0]) {
      let reader = new FileReader()
      reader.readAsArrayBuffer(file[0])

      reader.onloadend = (res) => {
        res=Buffer(reader.result)
        setImageHash(res)
      }
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
    const img_hash = await ipfs.add(imageHash)
      const args = {
        image:`${ipfs_base_url}${img_hash.path}`,
      attributes: [
        {
          trait_type: 'Acceleration',
          value: traits.acceleration,
        },
        {
          trait_type: 'Engine',
          value: traits.engine,
        },
        {
          trait_type: 'Range',
          value: traits.range,
        },
        {
          trait_type: 'Nitro',
          value: traits.nitro,
        },
      ],
      }
      const result = await ipfs.add(Buffer.from(JSON.stringify(args)))
      
      console.log(`${ipfs_base_url}${result.path}`)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
alert("error occured")
    }
    
  }
  
  return (
    <div className="App">
      <div className="form-input">
        <p>Acceleration</p>
        <input type="number" name="acceleration" value={traits.acceleration} onChange={handleChange} />
      </div>
      <div className="form-input">
        <p>Engine</p>
        <input type="number" name="engine" value={traits.engine} onChange={handleChange} />
      </div>
      <div className="form-input">
        <p>Range</p>
        <input type="number" name="range" value={traits.range} onChange={handleChange} />
      </div>
      <div className="form-input">
        <p>Nitro</p>
        <input type="number" name="nitro" value={traits.nitro} onChange={handleChange} />
      </div>
      <div className="form-input">
        <p>Image</p>
        <input type="file" onChange={handleImage} />
      </div>
      <button onClick={()=>handleSubmit()} disabled={loading}>{loading?"Loading":"Submit"}</button>
    </div>
  );
}

export default App;
