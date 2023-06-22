import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }

  /*
    1. prisma.reservation.deleteMany：這是使用 Prisma 提供的 deleteMany 方法來刪除符合條件的 reservation 資料。

    2. where：指定刪除的條件。在這個例子中，條件是 id 等於 reservationId，並且要麼 userId 等於當前使用者的 ID，要麼 listing 的 userId 等於當前使用者的 ID。這意味著只有符合這兩個條件之一的 reservation 資料會被刪除。

    3. id：指定要刪除的 reservation 的 ID。

    4. userId: currentUser.id：表示當前使用者的 ID。

    5. listing.userId: currentUser.id：表示 reservation 所關聯的 listing 的 userId 等於當前使用者的 ID。

    總結來說，這段程式碼的目的是刪除符合條件的 reservation 資料。條件包括 id 等於 reservationId，並且要麼 userId 等於當前使用者的 ID，要麼 listing 的 userId 等於當前使用者的 ID。這樣就可以根據不同的情況刪除符合條件的預訂資料。
  */
  const rservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
    },
  });

  return NextResponse.json(rservation);
}
