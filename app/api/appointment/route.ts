import { NextResponse } from 'next/server';
import clientPromise from '../../lib/db';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    
    const appointments = await db.collection("Appointment")
      .aggregate([
        {
          $lookup: {
            from: "doctors",
            localField: "doctor",
            foreignField: "_id",
            as: "doctorInfo"
          }
        },
        {
          $unwind: "$doctorInfo"
        },
        {
          $project: {
            _id: 1,
            date: 1,
            time: 1,
            status: 1,
            userId: 1,
            doctor: {
              _id: "$doctorInfo._id",
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

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}