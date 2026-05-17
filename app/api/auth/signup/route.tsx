import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"


export  async function POST(req: Request) {
    const {name , email , password} = await req.json()
    if(!name || !email || !password){
        return NextResponse.json(
            { error: 'enter all the fields'},
            {status: 400}
        )
    }
    const oldUser = await prisma.user.findUnique({
        where: {email}
    })
    if (oldUser) {
        return NextResponse.json(
            {error: "user already exists"},
            {status: 400}
        )
    }
    const hashPass = await bcrypt.hash(password , 10)
    const newUser = await prisma.user.create({
        data:{
            name: name,
            email: email,
            password: hashPass
        }
    })
    if (newUser) {
        return NextResponse.json(
            {message: "New user created"},
            {status: 201}
    )
    }
}