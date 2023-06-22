import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        // gte means greater than or equal 表示我們要 query roomCount 這個欄位 >= +roomCount 的資料
        gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      /*
      1. const { startDate, endDate } = params;：這是一個解構賦值操作，從 params 中獲取 startDate 和 endDate 的值。

      2. prisma.listing.findMany：這是使用 Prisma 提供的 findMany 方法來查詢符合條件的多個 listing 資料。

      3. where：指定查詢的條件。在這個例子中，條件是 reservations 中不存在符合以下條件的預訂資料。

      4. NOT：表示否定條件，即查詢不符合以下條件的 listing 資料。

      5. reservations：表示 listing 的 reservations 屬性，即預訂資料。

      6. some：表示至少存在一個滿足以下條件的預訂資料。

      7. OR：表示多個條件之間的或關係。

      8. startDate: { lte: startDate }, endDate: { gte: startDate }：表示預訂的結束日期大於等於 startDate，且預訂的開始日期小於等於 startDate。這個條件用於確保預訂的時間範圍與給定的 startDate 有交集。

      9. startDate: { lte: endDate }, endDate: { gte: endDate }：表示預訂的開始日期小於等於 endDate，且預訂的結束日期大於等於 endDate。這個條件用於確保預訂的時間範圍與給定的 endDate 有交集。

      總結來說，這段程式碼的目的是查詢在指定的時間範圍內沒有與預訂資料重疊的 listing 資料。這樣就可以獲取可用於預訂的 listing 資料。
      */
      query.NOT = {
        reservations: {
          some: {
            OR: [
              // 找出 startDate 在用戶過濾的開始日之前並且 endDate 在用戶過濾的開始日之後的預約
              {
                startDate: { lte: startDate },
                endDate: { gte: startDate },
              },
              // 找出 startDate 在用戶過濾的結束日之前並且 endDate 在用戶過濾的結束日之後的預約
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    // 使用 prisma.listing.findMany() 語法調用 Prisma 的 findMany 方法來查詢 "listing" 模型。這將返回符合指定條件的多個 "listing" 集合。
    // 這個例子中，findMany 方法不帶任何參數，因此它將返回資料表中的所有 "listing"。
    // 最後，使用 await 關鍵字將查詢結果賦值給 listings 變數。await 用於等待 findMany 方法的執行完成，確保在進一步處理 listings 之前，查詢結果已經返回。
    const listings = await prisma.listing.findMany({
      where: query,

      // 使用 orderBy 參數來指定結果的排序方式。在這裡，我們指定按照 createdAt 欄位的降序（desc）進行排序。這意味著結果將按照創建時間的最新項目（最新的 "listing"）排在前面。
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListing = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListing;
  } catch (error: any) {
    throw new Error(error);
  }
}
