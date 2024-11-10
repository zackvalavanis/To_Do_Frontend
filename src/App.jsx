import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
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
      }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
