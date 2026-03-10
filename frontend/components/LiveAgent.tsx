"use client";

import KinesisOrb from "./KinesisOrb";

export default function LiveAgent() {
    return <KinesisOrb state="idle" userLevel={0.1} aiLevel={0.1} />;
}
