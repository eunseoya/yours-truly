import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.resolve(process.cwd(), "data", "social-highlights.json");

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { posts: [] };
  }
}

async function writeData(data: any) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { highlights, user, caption } = body; // include caption

    if (!Array.isArray(highlights) || !user || typeof caption !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const data = await readData();
    data.posts.push({
      id: Date.now().toString(),
      user,
      caption, // persist the caption
      highlights,
      createdAt: new Date().toISOString(),
    });
    await writeData(data);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to save highlights" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data.posts || []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const data = await readData();
    data.posts = data.posts.filter((post: any) => post.id !== id);
    await writeData(data);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete highlights" },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true });
}
