import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

type Appointment = {
  _id?: ObjectId;  
  doctorId: ObjectId;
  userId: ObjectId;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  doctor?: {
    _id: string;
    name: string;
    speciality: string;
  };
};


/**
 * GET /api/appointment
 * Fetch all appointments for the given user id.
 * @param {NextRequest} req
 * @returns {Promise<NextResponse>}
 */export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const appointmentsCollection = db.collection<Appointment>("Appointment");

    const { searchParams } = new URL(req.url);
    const userId = '67a8784463abd080a76198ca';

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { ObjectId } = require('mongodb');

const appointments = await appointmentsCollection.aggregate([
  {
    $match: { userId: '67a8784463abd080a76198ca' }
  },
  {
    $addFields: {
      doctorId: { $toObjectId: "$doctorId" } // Convert doctorId to ObjectId
    }
  },
  {
    $lookup: {
      from: "doctors",
      localField: "doctorId",
      foreignField: "_id",
      as: "doctorInfo"
    }
  },
  {
    $unwind: {
      path: "$doctorInfo",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $project: {
      _id: { $toString: "$_id" },
      doctorId: { $toString: "$doctorId" },
      userId: 1,
      date: 1,
      time: 1,
      status: 1,
      doctor: {
        _id: { $toString: "$doctorInfo._id" },
        name: "$doctorInfo.name",
        speciality: "$doctorInfo.speciality",
        fees: "$doctorInfo.fees",
        availability: "$doctorInfo.availability",
        rating: "$doctorInfo.rating",
        image: "$doctorInfo.image"
      }
    }
  }
]).toArray();



    console.log("API Processed Response:", JSON.stringify({ appointments }, null, 2));

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const appointmentsCollection = db.collection("Appointment");
    const doctorsCollection = db.collection("doctors");

    const { doctorUsername, date, time, status } = await req.json();

    if (!doctorUsername || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Retrieve userId from session (Assuming you store it in req.cookies or AuthContext)
    const userId = "67a8784463abd080a76198ca"; // Replace this with session logic

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: User not logged in" }, { status: 401 });
    }

    // Find doctor ID based on doctorUsername
    const doctor = await doctorsCollection.findOne({ username: doctorUsername });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const newAppointment = {
      doctorId: doctor._id, 
      userId: new ObjectId(userId), 
      date,
      time,
      status
    };

    const result = await appointmentsCollection.insertOne(newAppointment);

    return NextResponse.json({
      success: true,
      appointmentId: result.insertedId.toString()
    }, { status: 201 });

  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment", details: (error as Error).message },
      { status: 500 }
    );
  }
}

