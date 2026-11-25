import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { nav } from "@/lib/content";
import { getContent } from "@/lib/cms";

// Isi dari database diperbarui paling lambat 5 menit setelah diubah di dashboard.
export const revalidate = 300;

export default async function Home() {
  const { services, projects, contact, profile, whatsapp, contactHint } = await getContent();

  return (
    <>
      <Navbar nav={nav} />
      <main id="konten">
        <Hero services={services} />
        <About profile={profile} />
        <Services services={services} />
        <Projects projects={projects} />
        <Process />
        <Contact services={services} contact={contact} whatsapp={whatsapp} />
      </main>
      <Footer nav={nav} services={services} contact={contact} />
      <ChatBot contactHint={contactHint} />
    </>
  );
}
