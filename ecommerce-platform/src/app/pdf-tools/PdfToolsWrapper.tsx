"use client";

import { useState } from "react";

export default function PdfToolsWrapper() {
    const [text, setText] = useState("");

    const generatePDF = async () => {
        const { default: jsPDF } = await import("jspdf");
        const doc = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: "a4",
        });

        doc.setFontSize(14);
        doc.text(text || "PDF içeriği boş.", 20, 30);

        // PDF HER ZAMAN DOSYA OLARAK İNER
        doc.save("belge.pdf");
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>PDF Oluşturucu</h1>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="PDF içeriğini yaz..."
                rows={8}
                style={{ width: "100%", marginBottom: 12 }}
            />

            <button onClick={generatePDF}>
                PDF İndir
            </button>
        </div>
    );
}
