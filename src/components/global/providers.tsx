"use client";

import React from "react"

interface Props {
    children: React.ReactNode;
}

// O site tem um tema só (claro); não há mais alternância de tema
const Providers = ({ children }: Props) => {
    return <>{children}</>;
};

export default Providers
