import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "This API route does not exist" },
    { status: 404 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "This API route does not exist" },
    { status: 404 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "This API route does not exist" },
    { status: 404 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "This API route does not exist" },
    { status: 404 }
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    { error: "This API route does not exist" },
    { status: 404 }
  );
}
