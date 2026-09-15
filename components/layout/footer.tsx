import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full bg-vintage-dark text-[#9E9E9E] border-t border-[#222222] py-8 mt-auto">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col md:flex-row items-center justify-between gap-6 text-xs tracking-wider">
        {/* Left Copyright */}
        <div className="text-center md:text-left">
          <p className="uppercase font-medium text-[#D1D1D1]">
           © {new Date().getFullYear()} S7 LÉGENDES
          </p>
        </div>

        {/* Center Crest Emblem */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
          <Image
            src="/assets/logo-crest.png"
            alt="S7 Légendes"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Credits & Admin link */}
        <div className="flex items-center gap-4 text-center md:text-right">
          <div className="relative text-[12px] tracking-[0.8px] leading-6 text-[#71717A] text-left font-lato">
            <span className="capitalize leading-6">{`Crédit par : `}</span>
            <b className="uppercase leading-6">Citadel</b>
            <span className="capitalize leading-6"> pour solutions intelligentes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
