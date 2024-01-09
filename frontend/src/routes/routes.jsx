// Import the 'Route' component from the 'react-router-dom' library.
import { Route } from "react-router-dom";
// Import various page components used as route elements.
import { HomeCBC } from "../pages/HomeCBC";
import { Cocktails } from "../pages/Cocktails";
import { AboutUs } from "../pages/AboutUs";
import { ContactUs } from "../pages/ContactUs";

// Define the 'routes' variable as a JSX expression.
const routes = (
    <>
        <Route path="/" element={<HomeCBC />} />
        <Route path="/Cocktails" element={<Cocktails />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
    </>
);

// Export the 'routes' variable as the default export of this module.
export default routes;