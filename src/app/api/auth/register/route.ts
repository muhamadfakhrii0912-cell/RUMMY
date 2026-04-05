import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Semua isian harus diisi terlebih dahulu." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Pengguna dengan email ini sudah terdaftar." },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Optional default role as specified in Prisma: 'CITIZEN'
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kesalahan saat registrasi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server saat registrasi." },
      { status: 500 }
    );
  }
}
