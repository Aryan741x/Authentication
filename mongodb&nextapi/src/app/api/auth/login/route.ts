import { NextRequest,NextResponse } from "next/server";
import User from "@/app/model/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

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
    if(!email || !password){
      return NextResponse.json(
        {message:'Please fill in all fields'},
        {status:400}
      );
    }

    const user = await User.findOne({email});
    if(!user){
      return NextResponse.json(
        {message:'Invalid credentials'},
        {status:400}
      );
    }
    console.log('User:', user);
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return NextResponse.json(
        {message:'Invalid credentials'},
        {status:400}
      );
    }

    if(email !== user.email){
      return NextResponse.json(
        {message:'Invalid credentials'},
        {status:400}
      );
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      message: 'User logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.username,
      }},{status:200}
    );
  }
  catch(error){
    console.error('Login error:', error);
    return NextResponse.json(
      {message:'Error logging in user'},
      {status:500}
    );
  }
}