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
import { ToastContainer } from 'react-toastify'; // Import ToastContainer here
import { ActivityProvider } from './ActivityContext.jsx'; // Import ActivityProvider
import 'react-toastify/dist/ReactToastify.css'; // Make sure this is imported

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
            const response = await axios.get('http://localhost:3000/activities.json');
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
        loader: ({ params }) =>
          axios.get(`http://localhost:3000/photos/${params.id}.json`).then((response) => {
            console.log(response.data);
            return response.data;
          })
      }, 
      { 
        path: '/MyActivities/', 
        element: <MyActivites />, 
        loader: async () => {
          try { 
             const response = await axios.get(`http://localhost:3000/activities.json`);
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
    <ActivityProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer /> {/* Place ToastContainer here to render globally */}
      </AuthProvider>
    </ActivityProvider>
  );
}

export default App;
