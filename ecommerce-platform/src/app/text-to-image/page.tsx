
import dynamic from 'next/dynamic';

// Force dynamic rendering to avoid static build issues
export const dynamicParams = true;
export const revalidate = 0;

// Dynamic import of the client component with SSR disabled
const TextToImageWrapper = dynamic(
    () => import('@/components/TextToImageWrapper'),
    { ssr: false }
);

export default function TextToImagePage() {
    return <TextToImageWrapper />;
}
