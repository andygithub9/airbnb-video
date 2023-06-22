import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  // 呼叫 bcrypt.hash() 方法，並使用 await 關鍵字等待這個方法的執行結果。bcrypt.hash() 方法用於將明文密碼進行雜湊，以生成一個安全的密碼雜湊值。
  // password 是明文密碼的變數，它是待雜湊的原始密碼值。12 是所使用的 salt 輪數，它指定了雜湊算法的複雜性。輪數越高，雜湊的計算成本越高，從而增加了破解雜湊值的難度。
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword
    }
  })

  return NextResponse.json(user)
}
