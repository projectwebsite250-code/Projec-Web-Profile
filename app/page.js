import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { nav as allNav } from "@/lib/content";
import { getContent } from "@/lib/cms";

// Cadangan jika webhook revalidasi gagal; perubahan normal langsung tampil lewat /api/revalidate.
export const revalidate = 300;

export default async function Home() {
  const { services, projects } = await getContent();
  const nav = projects.length ? allNav : allNav.filter((n) => n.id !== "portofolio");

  return (
    <>
      <Navbar nav={nav} />
      <main id="konten">
        <Hero services={services} />
        <About />
        <Services services={services} />
        <Projects projects={projects} />
        <Process />
        <WhyUs />
        <Contact services={services} />
      </main>
      <Footer nav={nav} services={services} />
      {/* ChatBot disembunyikan sementara: butuh ANTHROPIC_API_KEY (API berbayar). Aktifkan lagi dengan import + <ChatBot />. */}
    </>
  );
}
