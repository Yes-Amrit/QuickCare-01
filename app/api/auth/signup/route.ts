import { NextResponse } from "next/server";
import clientPromise from "../../../lib/db"; // ✅ Using direct MongoDB connection
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test"); // Ensure the database is correct

    const { username, password, role, ...details } = await req.json();

    // Validate fields
    if (!username || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    console.log("🔎 Checking if user exists...");
    const collection = db.collection("User"); // Using "User" collection

    // Check if user already exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      console.error("⚠️ Username already taken:", username);
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    console.log("📝 Creating new account...");
    await collection.insertOne({
      username,
      password: hashedPassword, 
      role, 
      ...details, 
    });

    console.log("✅ Account created successfully!");
    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
