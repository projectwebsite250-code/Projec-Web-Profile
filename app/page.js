import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PhotoStrip from "@/components/PhotoStrip";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { nav as allNav, services, projects, images } from "@/lib/content";

export default function Home() {
  const nav = projects.length ? allNav : allNav.filter((n) => n.id !== "portofolio");

  return (
    <>
      <Navbar nav={nav} />
      <main id="konten">
        <Hero services={services} />
        <About />
        <PhotoStrip photos={[images.about, ...services.filter((s) => s.image).map((s) => s.image), images.hero]} />
        <Services services={services} />
        <Projects projects={projects} />
        <Process />
        <WhyUs />
        <Contact services={services} />
      </main>
      <Footer nav={nav} services={services} />
      <ChatBot />
    </>
  );
}
