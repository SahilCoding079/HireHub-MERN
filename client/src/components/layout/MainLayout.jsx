import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
      <Navbar/>
      <main className='min-h-screen bg-gray-100'>
        <Outlet/>
      </main>
      <Footer/>
    </>
  )
}

export default MainLayout;
