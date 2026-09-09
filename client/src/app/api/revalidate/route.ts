import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get('tag');
    const slug = searchParams.get('slug');

    if (tag) {
      revalidateTag(tag, "default");
    }

    // Always revalidate main blog listing and sitemap
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');
    revalidatePath('/feed.xml');

    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      tag,
      slug,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, message: err.message },
      { status: 500 }
    );
  }
}
