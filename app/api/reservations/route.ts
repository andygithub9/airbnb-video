import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  /*
    1. prisma.listing.update：這是使用 Prisma 提供的 update 方法來更新 listing 模型的資料。
    2. where：指定更新的條件。在這個例子中，條件是 id 等於 listingId。這表示只會更新符合該條件的 listing 資料。
    3. data：指定要更新的資料。在這個例子中，我們要更新的是 reservations 屬性。
    4. reservations.create：使用 Prisma 的 create 方法創建一個新的 reservations 資料。
    5. userId、startDate、endDate、totalPrice：指定新創建的 reservations 的屬性值。userId 是指當前使用者的 ID，startDate 是開始日期，endDate 是結束日期，totalPrice 是總價格。

    總結來說，這段程式碼的目的是在指定的 listingId 下創建一個新的 reservations 資料，並將相關的屬性填充為提供的值。這樣就可以更新 listing 模型中的 reservations 屬性，使其包含新的預訂資料。
   */
  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}
