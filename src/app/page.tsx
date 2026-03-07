import Spotlight from "@/components/Spotlight";
import LeftSidebar from "@/components/LeftSidebar";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Spotlight />
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:flex lg:gap-12 lg:px-24 lg:py-0">
        {/* Left sidebar */}
        <LeftSidebar />

        {/* Right content */}
        <main className="flex flex-col gap-24 pt-6 lg:w-[52%] lg:py-24">
          <About />
          <Projects />
          <Contact />

          {/* Footer */}
          <footer className="pb-16 text-sm text-slate-500 lg:pb-24">
            <p>
              Built with{" "}
              <a
                href="https://nextjs.org"
                className="font-medium text-slate-400 hover:text-teal-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js
              </a>{" "}
              and{" "}
              <a
                href="https://tailwindcss.com"
                className="font-medium text-slate-400 hover:text-teal-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tailwind CSS
              </a>
              . Deployed on{" "}
              <a
                href="https://vercel.com"
                className="font-medium text-slate-400 hover:text-teal-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </a>
              .
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
