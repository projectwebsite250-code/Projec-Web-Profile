import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Ticker from "@/components/Ticker";
import PhotoStrip from "@/components/PhotoStrip";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { nav as allNav, projects, images } from "@/lib/content";
import { getContent } from "@/lib/cms";

// Isi dari database diperbarui paling lambat 5 menit setelah diubah di dashboard.
export const revalidate = 300;

export default async function Home() {
  const { services, contact, profile, whatsapp, contactHint } = await getContent();
  const nav = projects.length ? allNav : allNav.filter((n) => n.id !== "portofolio");

  return (
    <>
      <Navbar nav={nav} />
      <main id="konten">
        <Hero services={services} />
        <Ticker services={services} />
        <About profile={profile} />
        <Services services={services} />
        <PhotoStrip photos={[images.about, ...services.filter((s) => s.image).map((s) => s.image), images.hero]} />
        <Projects projects={projects} />
        <Process />
        <WhyUs />
        <Contact services={services} contact={contact} whatsapp={whatsapp} />
      </main>
      <Footer nav={nav} services={services} contact={contact} />
      <ChatBot contactHint={contactHint} />
    </>
  );
}
