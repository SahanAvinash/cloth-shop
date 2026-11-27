
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import FashionHero from "./components/FashionHero";
import NewArrivals from "./components/NewArrivals";
import Footer from "./components/Footer";
import Categories from "./components/Categories";
import Login from "./pages/auth/Login";

function HomePage() {
  return (
    <>
      <NavBar />
      <FashionHero />

      <div id="shop">
        <NewArrivals />
      </div>

      <Categories />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/login"
        element={<Login/>}
      />

      <Route
        path="/admin/dashboard"
        element={<div>Admin Dashboard</div>}
      />

      <Route
        path="/account"
        element={<div>Customer Account</div>}
      />
    </Routes>
  );
}

export default App;
