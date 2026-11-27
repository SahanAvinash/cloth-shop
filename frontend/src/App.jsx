import NavBar from "./components/NavBar";
import FashionHero from "./components/FashionHero";
import NewArrivals from "./components/NewArrivals";
import Footer from "./components/Footer";
import Categories from "./components/Categories";

function App() {
  return (
    <>
      <NavBar />
      <FashionHero />

      {/* SHOP NOW button එක scroll වෙන්නේ මේකට */}
      <div id="shop">
        <NewArrivals />
      </div>
      <Categories />
      <Footer />
    </>
  );
}

export default App;