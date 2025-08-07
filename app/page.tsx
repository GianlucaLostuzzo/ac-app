import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/xpertmotive.svg"
          alt="XpertMotive logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            <span className="text-[#000000] dark:text-[#ffffff]">
              This is the development version of the XpertMotive app.
            </span>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <span className="text-[#000000] dark:text-[#ffffff]">
              I'll be using this app to test new features and improvements.
            </span>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <span className="text-[#000000] dark:text-[#ffffff]">
              Firstly I'll need to check what Stack use for the backend DB.
            </span>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://xpertmotive.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to DB
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
