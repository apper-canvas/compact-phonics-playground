import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routeArray } from './config/routes';
import NotFound from '@/components/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        className="z-[9999]"
        toastClassName="bg-white border-2 border-primary/20 shadow-lg rounded-2xl"
        bodyClassName="text-gray-800 font-medium"
      />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          {routeArray.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;