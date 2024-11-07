import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css';
import {Header} from './Header.jsx';
import {Footer} from './Footer.jsx';
import { HomePage } from './HomePage.jsx'
import { Signup } from './Signup.jsx'
import { Login } from './Login.jsx'
import { Logout } from './Logout.jsx'


  const router = createBrowserRouter([
    {
      element: (
        <div>
          <Header />
          <Outlet />
          <Footer />
        </div>
      ), 
      children: [
        { 
          path: '/',
          element: <HomePage />
        }, 
        { 
          path: '/Signup', 
          element: <Signup />
        }, 
        { 
          path: '/Login', 
          element: <Login />
        }
      ]
    }
  ]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>

  )
}

export default App
