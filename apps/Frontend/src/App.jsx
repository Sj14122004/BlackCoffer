import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"element={<MainLayout><Dashboard /></MainLayout>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;