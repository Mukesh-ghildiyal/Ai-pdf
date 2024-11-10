import React from 'react'
import SideBar from './_components/SideBar'
import Header from './_components/Header'

const DashboardLayout = ({ children }) => {
    return (
        <div>
            <div className='md:w-72 h-screen fixed'>
                <SideBar />
            </div>
            <div className='md:ml-72'>
                <Header />
                <div className='p-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
