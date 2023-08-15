import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Background from "./components/Background";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ForgetPass from "./pages/ForgetPass";
import EditPaa from "./pages/EditPaa";
import "./components/app.css";
import TicketsPage from "./pages/TicketsPage";
import SaleTicket from "./pages/SaleTicket";
import UserProvider from "./components/ContextUser";
import PageUser from "./pages/PageUser";
import PayPage from "./pages/PayPage";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export const App = () => {
  const initialOptions = {
    clientId: process.env.CLIENT_ID as string,
    currency: "USD",
    intent: "capture",
  };
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <PayPalScriptProvider options={initialOptions}>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route element={<Background />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgetpass" element={<ForgetPass />} />
                <Route path="/user/editpass/:id/:token" element={<EditPaa />} />
              </Route>
              <Route path="/" element={<Home />} />
              <Route path="/ticketspage/:_id" element={<TicketsPage />} />
              <Route path="/saleticket/:_id" element={<SaleTicket />} />
              <Route path="/pageuser/:id" element={<PageUser />} />
              <Route path="/paypage/:_id" element={<PayPage />} />
            </Routes>
          </BrowserRouter>
        </PayPalScriptProvider>
      </UserProvider>
    </ChakraProvider>
  );
};
