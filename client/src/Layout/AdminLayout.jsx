import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import { classGet } from '../services/Endpoint'

const AdminLayout = () => {
  const [classes, setClasses] = useState([]);
    const user =useSelector((state)=>state.auth.user)
    const navigate =useNavigate()

    const getClass = async () => {
      try {
        const response = await classGet("/class/getclass");
        const sortedClass = response.data.getclass.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setClasses(sortedClass);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
  
    const addNewClass = (newClass) => {
      setClasses(prev => [newClass, ...prev]);
    };
    useEffect(()=>{
        if (!user) {
          navigate('/')
        }
        else if(!['admin', 'super admin'].includes(user.role)){
            navigate('/')
        }
      })
  return (
    <div>
        <Navbar addNewClass={addNewClass} />
        <div className="flex">
            <Sidebar />
            <div className="flex-grow p-4">
                <Outlet context={{ classes, getClass }} />
            </div>
        </div>
      
    </div>
  )
}

export default AdminLayout
