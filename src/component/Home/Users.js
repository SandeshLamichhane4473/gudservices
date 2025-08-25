import React, { useEffect, useState } from 'react'
import { UserAuth } from '../../context/AuthContext';
import swal from 'sweetalert';
import { getDocs } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';
import { doc, updateDoc } from "firebase/firestore";
import { FidgetSpinner } from 'react-loader-spinner';
import {AiOutlineForm}  from 'react-icons/ai';
import Select from 'react-select';
 
import Switch from "react-switch";


export default function Users() {
    const [allusers, setAllUsers] = useState([]);
    const { user, logout, userRole, setUserData } = UserAuth()
    const [updateUser, setUpdateUser] = useState({});
    const [openUpdateTab, setUpdateTab] = useState(false);
    const [selectedUser, setSelectedUser] = useState({ email: "", role: "", name:"", currentRole:"" , curerntinsurance:"", nextinsurance:""});
    const [loading, setLoading] = useState(false);
    const [activeRowInTable, setActiveRowInTable]=useState("erorr.rb@gmail.com");
    const [insuranceLoading, setInsuranceLoading]=useState(false);
    const [insuranceNames, setInsuranceNames]=useState([{value:"", label: ""}]);
    const [switchChecked, setSwitchChecked]=useState("");
    useEffect(() => {
        console.log("")
        getALlUsers();

    }, []);

    async function getALlUsers() {

        //try catch
        try {
            const userRefs = collection(db, "users")
            const querySnapshot = await getDocs(userRefs);
            if (querySnapshot.docs.length < 1) {
                setAllUsers([])
            } else {
                setAllUsers([])
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    console.log("staus", doc.data()['status'])
                    setAllUsers(prev => [...prev, docData]);
                    if (docData.email === user.email) {

                        setUserData(docData)
                  
                    }
                });
                //ihere its a new user
            }


        } catch (e) {
            swal({
                title: "Unable to fecth users from database" + e,
                timer: 3000
            })
        }
    }

    function hadnleRadio(_role, _email, ) {
        
        setSelectedUser({...selectedUser, role:_role, nextinsurance:""});
        
    }

    async function saveToDb() {
        // alert(selectedUser.role + selectedUser.email)
        //check the role before up
        if (!user || user.role !== 'admin') {
            swal("Warning !!!", "Unauthorize access", "error");
            return;
        }

        if (user && user.email === selectedUser.email) {
            swal("Warning !!!", "You cannot change your own role", "error");
            return;
        }

        if(selectedUser.role=== selectedUser.currentRole && selectedUser.curerntinsurance=== selectedUser.nextinsurance){
            swal("Nothing changed...")
            return;
        }
        //check for the insurance
        if(selectedUser.nextinsurance==="" && selectedUser.role==="insurance"){
            swal("Please, you cannot set company with role as "+selectedUser.role)
            return;
        }
     
       

        try {
            setLoading(true);
            const userDocRef = doc(db, "users", selectedUser.email);
            await updateDoc(userDocRef, { role: selectedUser.role , insurance: selectedUser.nextinsurance}) 
            getALlUsers();
            swal( " role has been changed from "+selectedUser.currentRole +" to "+selectedUser.role);
            setSelectedUser({...selectedUser, currentRole:selectedUser.role , curerntinsurance:selectedUser.nextinsurance})
            setLoading(false);
        }
        catch (e) {
            swal({
                timer: 3000
                ,
                icon: "error",
                title: "Error on Saving try again..."
            })
            setLoading(false);
        }
    }


    function handleupdate(_email, _role, _name,  _insurance) {
    
        setSelectedUser({ email: _email,name:_name, currentRole:_role, role: _role, curerntinsurance:_insurance, nextinsurance:"" })
        setUpdateTab(true);

    }

    ///FUNCTION TO GET THE INSURANCE NAME
    
  async function getAllInsuranceName(){

     //try catch
     if(insuranceNames.length>1){
        swal("Not loading;")
        return;
     }
     try {setInsuranceLoading(true);
         const insRefs = collection(db, "insurance")
         const querySnapshot = await getDocs(insRefs);
         setInsuranceNames([{value:"", label:""}])
         if (querySnapshot.docs.length < 1) {
           
         } else {
            
             querySnapshot.forEach((doc) => {
                 const docData = doc.data();
                 const object={ value: docData['name'], label: docData['name'] };
              
                   
                 setInsuranceNames(prev => [...prev, object])
             });
         }
     } catch (e) {
         swal({
             title: "Unable to fecth users from database" + e,
             timer: 3000
         })
         
     }finally{
        setInsuranceLoading(false)
     }

  }
///  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& FUNCTION FOR IT &&&&&&&&&&&&&&&&&

async function updateStatusInFirebase(value, email){
    try{
     

        if (!user || user.role !== 'admin') {
            swal("Warning !!!", "Unauthorize access", "error");
            return;
        }


        const userDocRef = doc(db, "users", email);
       await updateDoc(userDocRef, {  status: value}) 
       swal( " State hase be changed from "+!value.toString()+" to "+value.toString());
       const filterEmail= allusers.filter((object=>object.email===email));
       let length=allusers.length;

       const arrayIndex= allusers.findIndex(object=>object.email===email);
       let tempArray= allusers.map(obj=>({...obj}));
       
       tempArray[arrayIndex].status=value;
       setAllUsers(tempArray)  
    }
    catch(e){
        swal("Errpr"+e.toString())
    }
}

function capitalizeFirstWord(word=""){
   
    return  word.charAt(0).toUpperCase() + word.slice(1);


}
    return (
        <div className='w-full'>
            <div className='text-yellow-500 text-1xl p-6 font-bold   w-auto  bottom-2  border-2 '>
                <h1 className=' overflow-clip'> Gud Engineering Services<span className='text-orange-700 font-semibold text-sm'>User Management</span> </h1>
         </div>

            {/* set the update tab */}
            {openUpdateTab ?
                <>
                    <div className=' border-dashed border-2   mt-5  p-5 rounded-lg bg-gray-300'>
                        <div className='bg-white mt-7 border-2 border-gray-500 text-black px-3 py-5'>
                        <div className=' bg-gray-200 rounded-lg pl-1'>
                          <div className=' flex '><div className='w-40 inline-block overflow-hidden text-sm'> User Name : </div>{selectedUser && selectedUser.name}</div>
                          <div className='flex'><div className='w-40 overflow-hidden text-sm'>User Email :</div> {selectedUser && selectedUser.email} </div>
                          <div className='flex'> <div className='w-40 overflow-hidden text-sm'>User Role : </div>{selectedUser && selectedUser.currentRole}</div>
                          <div className='flex'> <div className='w-40 overflow-hidden text-sm'>Insurance : </div>{selectedUser && selectedUser.curerntinsurance}</div>

                         </div>  
                         <div className='h-4'></div>
                        <div className='px-2 py-1 bg-gray-200  shadow-lg rounded-lg '>
                            <h3 className=' text-black text-sm'>  Change role of <span className='text-purple-950 font-semibold underline'>{selectedUser && selectedUser.email}</span> </h3>
                            <div >
                                <div class="flex items-center pl-4 mt-4 border  border-yellow-800 rounded ">
                                    <input id="bordered-radio-1" type="radio" onChange={(e) => { hadnleRadio("user", selectedUser.email) }} checked={selectedUser && selectedUser.role === 'user'} value="user" name="bordered-radio" class="w-7 h-7  text-2xl text-yellow-500  bg-pink-600 border-pink-600  focus:ring-pink-600  dark:focus:ring-yellow-600 dark:ring-offset-yellow-800 focus:ring-2 dark:bg-yellow-700 dark:border-yellow-600" />
                                    <label for="bordered-radio-1" class="w-full py-4 ml-2 text-base font-medium  text-pink-700 ">user</label>
                                </div>
                                <div class="flex items-center pl-4 border border-yellow-800 rounded  ">
                                    <input id="bordered-radio-2" onChange={(e) => { hadnleRadio("moderator", selectedUser.email,) }} type="radio" checked={selectedUser && selectedUser.role === 'moderator'} value="moderator" name="bordered-radio" class= "text-2xl w-7 h-7  text-pink-600  bg-pink-600 border-pink-600  focus:ring-pink-600    dark:ring-offset-yelllow-800 focus:ring-2 dark:bg-yellow-700 dark:border-yellow-600" />
                                    <label for="bordered-radio-2" class="w-full py-4 ml-2 text-base font-medium  text-pink-700  ">moderator</label>
                                </div>
                                <div class="flex items-center pl-4 border border-yellow-800 rounded  ">
                                    <input id="bordered-radio-2" type="radio" onChange={(e) => { hadnleRadio("admin", selectedUser.email) }} value="admin" checked={selectedUser && selectedUser.role === 'admin'} name="bordered-radio" class="w-7 h-7 text-2xl text-yellow-500  bg-pink-600 border-pink-600  focus:ring-pink-600   file:   focus:ring-2 dark:bg-yellow-700 dark:border-yellow-600" />
                                    <label for="bordered-radio-2" class="w-full py-4 ml-2 font-medium   text-pink-700   text-base">admin</label>
                                </div>

                                  <div class="flex items-center pl-4 border border-yellow-800 rounded  ">
                                    <input id="bordered-radio-2" type="radio" onChange={(e) => { hadnleRadio("insurance", selectedUser.email ); getAllInsuranceName(); }} value="insurance" checked={selectedUser && selectedUser.role === 'insurance'} name="bordered-radio" className="w-12 h-12 text-2xl text-yellow-500  bg-pink-600 border-pink-600 focus:ring-pink-600  dark:ring-offset-yellow-800 focus:ring-2 dark:bg-yellow-700 dark:border-yellow-600" />
                                    <label for="bordered-radio-2" class="w-full py-4 ml-2 font-medium  text-pink-700    text-base">insurance</label>                                  
                                 
                                     {insuranceLoading ?<div className='w-96 max-w-full font-semibold text-blue-950'>Loading...</div>
                                       :
                                     

                                     <Select  className='w-96  font-normal text-black mr-2'
                                            options={insuranceNames}
                                            value={insuranceNames.filter(({ value }) => value === selectedUser.nextinsurance)}
                                            placeholder="Select Company"
                                            defaultSelectValue="Select Reference"
                                            isSearchable
                                            onChange={async(e)=>{
                                            setSelectedUser({...selectedUser, role:"insurance", nextinsurance:e.value});
                                            
                                    }} />
                                }
                               
                                </div>
                            
                                </div>
                            </div>
                            <>
                                {loading ? <FidgetSpinner
                                    visible={true}
                                    height="80"
                                    width="80"
                                    user ariaLabel="dna-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="dna-wrapper"
                                    ballColors={['#ff0000', '#00ff00', '#0000ff']}
                                    backgroundColor="#F4442E"
                                /> : <>
                                    <div className='flex px-2 py-4'>
                                        <button onClick={() => saveToDb()} class="  mt-6 bg-pink-600 text-white hover:bg-gray-100 hover:text-pink-600   py-2 px-4 border border-gray-400 rounded shadow">
                                            Update
                                        </button>
                                        <button onClick={() => setUpdateTab(false)} class=" hover:text-white hover:bg-orange-700  text-pink-600  mt-6 ml-6 bg-red-700-700    py-2 px-4 border border-gray-400 rounded shadow">
                                            Cancel
                                        </button>

                                    </div>
                                </>}
                            </>
                        </div>
                    </div>
                </> :

                <div className=' bg-gray-300 max-w-full p-5 w-full'>
                   
                    <table className="table-auto  bg-white  mt-7 border-separate   border border-slate-500 ">
                        <thead className='text-sm font-serif text-black font-bold p-4 m-5'>

                            <tr className='bg-[rgb(220,230,243)] cursor-pointer '>
                                <th className='px-2 py-3'>SN</th>
                                <th className='px-2 py-3 text-start'>Name</th>
                                <th className='px-2 py-3 text-start'>Email</th>
                                <th className='px-2 py-3 text-start'>Role</th>
                                <th className='px-2 py-3 text-start'>Status</th>
                                <th className='px-2 py-3 text-start'>Update</th>
                             
                            </tr>
                        </thead>
                        <tbody className='text-sm font-normal text-black '>

                            {
                                allusers && allusers.map((e, i) => {
                                    return (
                                        <tr onClick={()=>{setActiveRowInTable(e.email)}}  className= { activeRowInTable===e.email?' bg-gray-200 cursor-pointer hover:bg-gray-300': 'cursor-pointer hover:bg-gray-300 '}key={i}>
                                            <td className='px-2 py-2 '>{i + 1}</td>
                                            <td className='px-2 py-2 font-semibold text-start'>{capitalizeFirstWord(e.name)}<div className='font-normal text-gray-700 text-[9px]'>{e.insurance!==null?e.insurance:""}</div></td>
                                            <td className='px-2 py-2  '> {e.email} </td>
                                          
                                            <td className='px-2 py-2 text-start '>
                                                 {e.role === "admin" ?
                                                 <div className="w-32 bg-gray-200  overflow-hidden px-2 py-2 text-sm  font-normal rounded-full   text-start">admin</div>
                                                :    <div className="w-32 bg-gray-200  overflow-hidden px-2 py-2 text-sm  font-normal rounded-full   text-start">{e.role} </div>}</td>
                                          
                                            <td className='px-2 py-2  '> 
                                            <Switch checked={!e.status || e.status==='false'?false:true} onChange={(val)=>{
                                                
                                                       updateStatusInFirebase(val.toString(), e.email);

                                            } } /> </td>
                                            <td  className='px-2 py-2'> <AiOutlineForm onClick={() => {
                                                setActiveRowInTable(e.email)
                                                let _insName= "";
                                                if(e.insurance!==null){
                                                    _insName=e.insurance;
                                                }
                                                handleupdate(e.email, e.role, e.name, _insName
                                                    )
                                            }

                                            } className="text-gray-800" /> 

                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    {/* <h1>Here it is{user.email} </h1>
                <h1>Here it is{userRole} </h1> */}
                </div>
            }
        </div>

    )
}



{/* <div class="md:px-32 py-8 w-full">
<div class="shadow overflow-hidden rounded border-b border-gray-200">
    <table class="min-w-full bg-white">
        <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Last name</th>
                <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Phone</th>
                <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
            </tr>
        </thead>
        <tbody class="text-gray-700">
            <tr>
                <td class="w-1/3 text-left py-3 px-4">Lian</td>
                <td class="w-1/3 text-left py-3 px-4">Smith</td>
                <td class="text-left py-3 px-4"><a class="hover:text-blue-500" href="tel:622322662">622322662</a></td>
                <td class="text-left py-3 px-4"><a class="hover:text-blue-500" href="mailto:jonsmith@mail.com">jonsmith@mail.com</a></td>
            </tr>
            <tr class="bg-gray-100">
                <td class="w-1/3 text-left py-3 px-4">Emma</td>
                <td class="w-1/3 text-left py-3 px-4">Johnson</td>
                <td class="text-left py-3 px-4"><a class="hover:text-blue-500" href="tel:622322662">622322662</a></td>
                <td class="text-left py-3 px-4"><a class="hover:text-blue-500" href="mailto:jonsmith@mail.com">jonsmith@mail.com</a></td>
            </tr>
            <tr>
                <td class="w-1/3 text-left py-3 px-4">Oliver</td>
                <td class="w-1/3 text-left py-3 px-4">Williams</td>
                <td class="text-left py-3 px-4"><a class="hover:text-blue-500" href="tel:622322662">622322662</a></td>
                <td class="text-left py-3 px-4"><a class="hover:text-blue-500" href="mailto:jonsmith@mail.com">jonsmith@mail.com</a></td>
            </tr>
            <tr class="bg-gray-100">
                <td class="w-1/3 text-left py-3 px-4">Isabella</td>
                <td class="w-1/3 text-left py-3 px-4">Brown</td>
                <td class="text-left py-3 px-4"><a class="hover:text-blue-500" href="tel:622322662">622322662</a></td>
                <td class="text-left py-3 px-4"><a class="hover:text-blue-500" href="mailto:jonsmith@mail.com">jonsmith@mail.com</a></td>
            </tr>
        </tbody>
    </table>
</div> */}