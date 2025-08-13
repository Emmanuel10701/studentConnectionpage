import Navbar from "./components/Navbar/page";
import Carousel from "./components/Carousel/page";
import Hero from "./components/Hero/page";
import Footer from "./components/Footer/page";
import Leadership from "./components/leadaership/page";

export default function HomePage() {
  return (
    // 'scroll-behavior: smooth' is added to the main container to enable
    // a smooth scrolling effect when navigating to anchor links.
    // 'pt-20' provides padding to prevent content from being hidden behind the fixed navbar.
    <div className="pt-20" style={{ scrollBehavior: 'smooth' }}> 
      <Navbar />
      <Carousel />
      
      {/* The 'id="about"' attribute is added here so the navbar link can scroll to this section. */}
      <div id="about">
        <Hero />
      </div>
      
      {/* The 'id="leadership"' attribute is added here for the navbar link. */}
      <div id="leadership">
        <Leadership />
      </div>
      
      {/* An 'id="contact"' is added as a best practice for the footer section. */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
