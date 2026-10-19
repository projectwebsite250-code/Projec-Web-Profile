import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="konten">
        <Hero />
        <About />
        <Services />
        <Process />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
