import { useEffect } from "react";
import { storage } from '../../../firebase/Firebase';
import { getDownloadURL } from "firebase/storage";
import swal from 'sweetalert';
 import { ref } from "firebase/storage";
import FileSaver from "file-saver";
import { useRef } from "react";


const Modal=({open, close,referenceNo ,imageUrl, imageName})=>{

 

  const canvasRef = useRef(null);
  

 useEffect(()=>{
    
    },[])
 



    if(!open) 
    {
        document.body.style.overflowY="scroll"
        return null;
    }else{
        document.body.style.overflowY="hidden"
    }


    async function toDataURL(url) {
        return fetch(url).then((response) => {
                return response.blob();
            }).then(blob => {
                return URL.createObjectURL(blob);
            });
    }
    //function to download photos




 async   function downLoadPhoto(){ 
 try{
  //create url
 
    var url= await getDownloadURL(ref(storage,`surveyPhotos/${referenceNo}/${imageName}`));

//     swal(url)

//   const response = await fetch(url);

//   const blobImage = await response.blob();

//   const href = URL.createObjectURL(blobImage);

//   const anchorElement = document.createElement('a');
//   anchorElement.href = href;
//   anchorElement.download = "nameOfDownload";

//   document.body.appendChild(anchorElement);
//   anchorElement.click();

//   document.body.removeChild(anchorElement);
//   window.URL.revokeObjectURL(href); 
// var link = document.createElement('a');
// link.download = 'filename.png';
// link.href = document.getElementById('canvas').toDataURL()
// link.click();
 
var canvas = document.getElementById('viewport'),
context = canvas.getContext('2d');

//const MYcanvas = document.createElement('canvas')
 var   base_image = new Image();
   base_image.src =  url;
   
   base_image.crossOrigin = "Anonymous";
   base_image.onload = function(){
    context.drawImage(base_image, 0, 0);
     
    canvas.toDataURL('image/jpeg');
    
    // var link = document.createElement('a');
    // link.download = 'filename.png';
    // link.href = document.getElementById('viewport').toDataURL()
    // link.click();
    
    
  }
return
//it work fine
fetch(url, {
    mode : 'no-cors',
  })
    .then(response => response.blob())
    .then(blob => {
    let blobUrl = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.download = url.replace(/^.*[\\\/]/, '');
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  })

        }
        catch(e){
            swal("Error on downloading photo"+e)
        }
    }
   
    return( <>   
    <div className="fixed  left-0 top-0 bottom-0 right-0 overflow-auto  bg-black opacity-75" onClick={close} ></div>
    

          <div className=" duration-200  w-2/5  h-5/6 object-cover m-auto  p-4 rounded-lg fixed  left-32  top-16  bg-white text-black">
      
         
 
              <img src={imageUrl} alt="image"  className="w-full h-5/6 object-contain   "/>
              <button className="bg-blue-800 hover:border-4  ml-16 float-right hover:border-solid hover:border-blue-800 rounded-lg p-5 text-2xl text-white hover:bg-white hover:text-blue-800" onClick={close}  >
              <span>Thanks</span>
            </button>

           

        </div>
   
       

        b
         </>)
     }

export default Modal;