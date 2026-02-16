import nextDynamic from 'next/dynamic';

// Force dynamic rendering to skip static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

// Dynamic import with SSR disabled
const ClientToolsWrapper = nextDynamic(
    () => import('./ClientToolsWrapper'),
    {
        ssr: false,
        loading: () => <div className="min-h-screen flex items-center justify-center">Loading Client Tools...</div>
    }
);

export default function ClientToolsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <ClientToolsWrapper />
            </div>
        </div>
    );
}
