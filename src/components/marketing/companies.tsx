import Container from "../global/container";
import Marquee from "../ui/marquee";

const COMPANIES = [
    "SAT Company", "Casas Bahia", "Extra", "Vipe Financeira",
    "Santillana", "Editora Moderna", "CIEE", "Atacadão"
];

const Companies = () => {
    return (
        <div className="flex w-full pt-16 pb-6 md:pt-20">
            <div className="flex flex-col items-center justify-center text-center w-full py-2">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-8">
                    Empresas que confiam na Adone AI
                </p>
                <div className="w-full relative overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:40s]">
                        <div className="flex gap-8">
                            {COMPANIES.map((company, i) => (
                                <div
                                    key={i}
                                    className="w-48 flex items-center justify-center px-4 py-3 cursor-default select-none"
                                >
                                    <span className="font-heading text-lg font-semibold text-ink/40 hover:text-ink transition-colors text-center whitespace-nowrap">
                                        {company}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
                </div>
            </div>
        </div>
    );
};

export default Companies;
