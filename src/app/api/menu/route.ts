import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'menu-data.json');

// GET - Récupérer l'URL du menu
export async function GET() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            return NextResponse.json(data);
        }
        return NextResponse.json({ imageUrl: null });
    } catch (error) {
        return NextResponse.json({ imageUrl: null, error: 'Erreur lecture' }, { status: 500 });
    }
}

// POST - Sauvegarder l'URL du menu
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json({ success: false, error: 'URL manquante' }, { status: 400 });
        }

        const data = {
            imageUrl,
            updatedAt: new Date().toISOString()
        };

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
