"use client";

import KinesisOrb from "./KinesisOrb";

export default function AgentComponent() {
    return <KinesisOrb state="idle" userLevel={0.1} aiLevel={0.1} />;
}
