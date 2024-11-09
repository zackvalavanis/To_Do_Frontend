import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css';
import {Header} from './Header.jsx';  
import {Footer} from './Footer.jsx';
import { Calendar } from './Calendar.jsx'
import { Signup } from './Signup.jsx'
import { Login } from './Login.jsx'
import axios from 'axios'
import { HomePage } from './HomePage.jsx'
import { AuthProvider } from './AuthContext.jsx';


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
          path: '/Calendar',
          element: <Calendar />, 
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
        }, 
        { 
          path: '/', 
          element: <HomePage />
        }
      ]
    }
  ]);

function App() {
  return (
    <AuthProvider>
    <div>
      <RouterProvider router={router} />
    </div>
    </AuthProvider>
  );
}

export default App
