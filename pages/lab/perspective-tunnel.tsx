// Preview of components/ui/perspective-tunnel-hero (its demo, shown
// full-bleed the way a hero is used). Not linked from the site, kept out of
// search results and out of the sitemap.

import Head from "next/head";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";

export default function PerspectiveTunnelPreview() {
    return (
        <>
            <Head>
                <title>Perspective tunnel preview | Imagicity</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <main className="min-h-screen w-full bg-stone-100 dark:bg-stone-950">
                <PerspectiveTunnelHero />
            </main>
        </>
    );
}
