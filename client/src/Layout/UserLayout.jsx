import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Sidebar'

const UserLayout = () => {
  
  return (
    <div>
      <Navbar />
        <div className="flex">
            <Sidebar />
            <div className="flex-grow p-4">
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default UserLayout
