import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Kinesis // Autonomous Multimodal Lifeform",
    description: "Gemini 3 Flash real-time multimodal agent with autonomous cloud agency",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-[#050505] text-slate-100 antialiased">{children}</body>
        </html>
    );
}
