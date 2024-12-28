import User from "@/app/model/User";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { NextRequest,NextResponse} from "next/server";

export async function POST(
  req: NextRequest
){
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  try{
    await mongoose.connect(mongodbUri);
    console.log('Connected to database');
    const {username,email,password} = await req.json();
    if(!username || !email || !password){
      return NextResponse.json(
        {error:'Please fill in all fields'},{status:400}
      );
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return NextResponse.json(
        {message:'User already exists'},
        {status:400}
      );
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.username,
      }},
      {status:201}
    );
  }
  catch(error){
    console.error('Signup error:', error);
    return NextResponse.json(
      {message:'Error creating user'},
      {status:500}
    );
  }
}