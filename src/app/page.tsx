import Sidebar from "@/components/Sidebar";
import Reveal from "@/components/Reveal";
import ClientResults from "@/components/sections/ClientResults";
import Products from "@/components/sections/Products";
import Lab from "@/components/sections/Lab";
import WhyIBuild from "@/components/sections/WhyIBuild";
import Experience from "@/components/sections/Experience";
import { getCases } from "@/lib/content";

export default function Home() {
  // Read at build time: the home page is statically generated
  const cases = getCases();

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:flex lg:gap-12 lg:px-12">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col gap-10 pt-12 pb-10 lg:py-20">
        <Reveal>
          <ClientResults cases={cases} />
        </Reveal>
        <Reveal>
          <Products />
        </Reveal>
        <Reveal>
          <Lab />
        </Reveal>
        <Reveal>
          <WhyIBuild />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <footer className="pt-6 text-[12.5px] text-muted">© Hao Li</footer>
      </main>
    </div>
  );
}
