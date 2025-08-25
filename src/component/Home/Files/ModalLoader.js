
import { ThreeDots } from "react-loader-spinner";
export  default function  ModalLoader({showLoaderModal, setLoader}) {
  
  //lets see the true false
  if(!showLoaderModal){
    return null
  }
    return (<>
          <div className="w-full h-full   bg-black opacity-60 z-10 top-0 left-0 fixed" onClick={()=>{setLoader(false)}}>    </div>

            <div className="bg-white fixed z-20 rounded-lg p-4 top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2">
              <ThreeDots  />

        
            </div>
            <button onClick={()=>{
              setLoader(false)
            }}>Close</button>
       
    
    </>);
}