import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Create } from "./pages/Create";
import { Join } from "./pages/Join";
import { Home } from "./pages/Home";
import { ThemeProvider } from "./components/ThemeProvider";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route>
            <Route index element={<Home />} />
            <Route path="create" element={<Create />} />
            <Route path="join" element={<Join />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App