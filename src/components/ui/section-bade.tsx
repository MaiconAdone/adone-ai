import React from 'react'

interface Props {
    title: string;
}

// Rótulo de seção: traço verde-água como o da logo + texto em caixa alta
export const SectionBadge = ({ title }: Props) => {
    return (
        <div className="inline-flex items-center gap-2.5 select-none">
            <span className="h-[3px] w-6 rounded-full bg-brand-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                {title}
            </span>
        </div>
    )
};
