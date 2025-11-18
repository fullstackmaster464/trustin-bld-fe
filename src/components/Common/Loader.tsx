import { Spin } from "antd"

const Loader = ()=>{
    return(
    <div className="loader-bg-img">
         <div className="lds-dual-ring loader">
          <Spin />
         </div>
         </div>
 
    )
 }
 
 export default Loader