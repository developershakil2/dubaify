import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from './pages/Home';
import Buy from './pages/Buy';
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'
const router = createBrowserRouter([
  {
    path:'/',
    element: <Home/>
  },
  {
    path:'/buy',
    element:<Buy/>
  },
  {
    path:'/page1',
    element:<Page1/>
  },
  {
    path:'/page2',
    element:<Page2/>
  },
  {
    path:'/page3',
    element:<Page3/>
  },
  {
    path:'/page4',
    element:<Page4/>
  }
])
function App() {

  return (
    <>
     <RouterProvider router={router} />
    </>
  );
}

export default App;
