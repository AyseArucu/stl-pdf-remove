import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const PdfToolsWrapper = nextDynamic(
    () => import("./PdfToolsWrapper"),
    { ssr: false }
);

export default function Page() {
    return <PdfToolsWrapper />;
}
