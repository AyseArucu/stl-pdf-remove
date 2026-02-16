
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('file') || 'ornek-dosya.pdf';

    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return new NextResponse('Invalid filename', { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public/pdfler", filename);

    try {
        if (!fs.existsSync(filePath)) {
            return new NextResponse('Dosya bulunamadı. Lütfen "public/pdfler" klasörünü kontrol edin.', { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (e) {
        console.error('PDF Download Error:', e);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
