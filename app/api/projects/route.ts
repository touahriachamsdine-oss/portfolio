import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
    try {
        const projects = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `;
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, glyph, badge, badge_color, tech, link, image_url } = body;

        const [project] = await sql`
      INSERT INTO projects (
        title, description, glyph, badge, badge_color, tech, link, image_url
      ) VALUES (
        ${title}, ${description}, ${glyph}, ${badge}, ${badge_color}, ${tech}, ${link}, ${image_url}
      )
      RETURNING *
    `;

        return NextResponse.json(project);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        await sql`
      DELETE FROM projects WHERE id = ${id}
    `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
