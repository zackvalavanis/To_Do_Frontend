import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { Calendar } from './Calendar.jsx';
import { Signup } from './Signup.jsx';
import { Login } from './Login.jsx';
import axios from 'axios';
import { HomePage } from './HomePage.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { ActivityShow } from './ActivityShow.jsx';
import { MyActivites } from './MyActivities.jsx';
import 'react-toastify/dist/ReactToastify.css'; // Make sure this is imported
import { Stats } from './Stats'

// Set up the routes
const router = createBrowserRouter([
  {
    element: (
      <div className="app-container">
        <Header />
        <main className="content-area">
          <Outlet />
        </main>
        <Footer />
      </div>
    ),
    children: [
      {
        path: '/Calendar',
        element: <Calendar />,
        loader: async () => {
          try {
            const API_URL = import.meta.env.VITE_API_URL
            const response = await axios.get(`${API_URL}/activities.json`);
            console.log(response.data);
            return response.data;
          } catch (error) {
            console.error('Error fetching data', error);
            return { error: 'Failed to load data' };
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
      },
      {
        path: '/Activities/:id',
        element: <ActivityShow />,
        loader: async ({ params }) => { 
          try { 
            const API_URL = import.meta.env.VITE_API_URL
            const response = axios.get(`${API_URL}/photos/${params.id}.json`)
              console.log(response.data);
              return response.data;
          } catch(error) { 
            console.error('Error fetching data', error)
            return { error: 'Failed to load data'}
          }
        }
      }, 
      { 
        path: '/Stats', 
        element: <Stats />, 
        loader: async () => {
          try { 
            const API_URL = import.meta.env.VITE_API_URL
            const response = await axios.get(`${API_URL}/activities.json`);
            console.log(response.data);
            return response.data;
          } catch (error) { 
          console.log("error loading data", error);
          throw error;
          }
        }
      }
    ]
  }
]);

function App() {
  return (
    // Wrap the whole app with the ActivityProvider
      <AuthProvider>
        <RouterProvider router={router} />
        <MyActivites/> {/* Place ToastContainer here to render globally */}
      </AuthProvider>
  );
}

export default App;
