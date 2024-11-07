import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css';
import {Header} from './Header.jsx';
import {Footer} from './Footer.jsx';
import { HomePage } from './HomePage.jsx'
import { Signup } from './Signup.jsx'
import { Login } from './Login.jsx'
import axios from 'axios'


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
          element: <HomePage />, 
          loader: async () => { 
            try { 
              const response = await axios.get('http://localhost:3000/activities.json')
                console.log(response.data);
                return response.data
            } catch (error) { 
              console.error ('error fetching data', error);
              return { error: 'failed to load data'}
            }
          }
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
