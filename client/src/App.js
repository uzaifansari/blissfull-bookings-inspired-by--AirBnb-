import { Route, Routes } from "react-router-dom";
import IndexPage from "./Pages/IndexPage";
import LoginPage from "./Pages/LoginPage.jsx";
import Layout from "./Components/Layout/Layout";
import RegisterPage from "./Pages/RegisterPage";
import axios from "axios";
import AccountPage from "./Pages/ProfilePage";
import PlacesPage from "./Pages/PlacesPage";
import PlacesFormPage from "./Pages/PlacesFormPage";
import PlacePage from "./Pages/PlacePage";
import BookingsPage from "./Pages/BookingsPage";
import BookingPage from "./Pages/BookingPage";
import { UserContextProvider } from "./Context/UserContext";
import "./App.css";
import BookingInfoPage from "./Pages/BookingInfoPage";
import AllUsers from "./Pages/AllUsers";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Footer from "./Components/Footer/Footer";

axios.defaults.baseURL = "http://localhost:4000/";
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<IndexPage></IndexPage>}></Route>
          <Route path="/login" element={<LoginPage></LoginPage>}>
            {" "}
          </Route>
          <Route
            path="/login/forgotPassword"
            element={<ForgotPassword></ForgotPassword>}
          ></Route>
          <Route
            path="/login/forgotPassword/resetPassword"
            element={<ResetPassword></ResetPassword>}
          ></Route>
          <Route
            path="/register"
            element={<RegisterPage></RegisterPage>}
          ></Route>
          <Route path="/account" element={<AccountPage></AccountPage>}></Route>
          <Route
            path="/account/places"
            element={<PlacesPage></PlacesPage>}
          ></Route>
          <Route path="/account/users" element={<AllUsers></AllUsers>}></Route>
          <Route
            path="/account/places/new"
            element={<PlacesFormPage />}
          ></Route>
          <Route
            path="/account/places/booking-info/:id"
            element={<BookingInfoPage></BookingInfoPage>}
          ></Route>
          <Route
            path="/account/places/:id"
            element={<PlacesFormPage />}
          ></Route>
          <Route path="/place/:id" element={<PlacePage></PlacePage>}></Route>
          <Route path="/account/bookings" element={<BookingsPage />}></Route>
          <Route path="/account/bookings/:id" element={<BookingPage />}></Route>
        </Route>
        
      </Routes>
      <Footer></Footer>
    </UserContextProvider>
  );
}

export default App;
