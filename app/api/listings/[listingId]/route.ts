import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  /*
  1. prisma.listing.deleteMany：這是使用 Prisma 提供的 deleteMany 方法來刪除符合條件的多個 listing 資料。

  2. where：指定刪除的條件。在這個例子中，條件是 id 等於 listingId，並且 userId 等於當前使用者的 ID。這表示只有符合這兩個條件的 listing 資料會被刪除。

  3. id: listingId：指定要刪除的 listing 的 ID。

  4. userId: currentUser.id：表示當前使用者的 ID。

  總結來說，這段程式碼的目的是刪除符合條件的多個 listing 資料。條件包括 id 等於 listingId，並且 userId 等於當前使用者的 ID。這樣就可以根據不同的情況刪除符合條件的 listing 資料。
  */
  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
