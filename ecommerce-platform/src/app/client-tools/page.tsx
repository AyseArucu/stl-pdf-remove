import ClientToolsLoader from './ClientToolsLoader';

// Force dynamic rendering to skip static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default function ClientToolsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <ClientToolsLoader />
            </div>
        </div>
    );
}
