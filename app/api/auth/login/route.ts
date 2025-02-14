import { NextResponse } from "next/server";
import clientPromise from "../../../lib/db"; // ✅ Using direct MongoDB connection
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("test"); // Ensure the database is correct

    const { username, password } = await req.json();

    // Validate fields
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    console.log("🔎 Checking if user exists...");
    const collection = db.collection("User"); // Using "User" collection

    // Check if user exists
    const existingUser = await collection.findOne({ username });
    if (!existingUser) {
      console.error("⚠️ User not found:", username);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare hashed password with the entered password
    console.log("🔐 Verifying password...");
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      console.error("⚠️ Invalid password for user:", username);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Successful login
    console.log("✅ User authenticated successfully!");
    return NextResponse.json(
      { message: "Login successful", user: existingUser },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
