import Container from "../global/container";
import Marquee from "../ui/marquee";

const COMPANIES = [
    "SAT Company", "Casas Bahia", "Extra", "Vipe Financeira",
    "Santillana", "Editora Moderna", "CIEE", "Atacadão"
];

const Companies = () => {
    return (
        <div className="flex w-full py-16">
            <div className="flex flex-col items-center justify-center text-center w-full py-2">
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mb-10">
                    Empresas que confiam na Adone AI
                </p>
                <div className="w-full relative overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:40s]">
                        <div className="flex gap-8">
                            {COMPANIES.map((company, i) => (
                                <div
                                    key={i}
                                    className="w-44 flex items-center justify-center px-4 py-2 rounded-lg border border-foreground/5 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all duration-300 cursor-default select-none"
                                >
                                    <span className="text-sm font-semibold text-muted-foreground hover:text-foreground/70 transition-colors text-center">
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
