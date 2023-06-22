import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    /*
    1. prisma.listing.findMany：這是使用 Prisma 提供的 findMany 方法來查詢符合條件的多個 listing 資料。

    2. where：指定查詢的條件。在這個例子中，條件是 id 屬性在 currentUser.favoriteIds 中，其中 currentUser.favoriteIds 是一個陣列，表示當前使用者喜歡的 listing 的 ID。

    3. id: { in: [...(currentUser.favoriteIds || [])] }：這表示只有 id 屬性在 currentUser.favoriteIds 中的 listing 資料會被查詢到。[...(currentUser.favoriteIds || [])] 是一個展開陣列的操作，它將 currentUser.favoriteIds 的值展開為一個新的陣列。如果 currentUser.favoriteIds 為空或未定義，則使用空陣列 []。

    總結來說，這段程式碼的目的是根據 currentUser.favoriteIds 中的 ID 值，查詢並返回符合條件的多個 listing 資料。這樣就可以獲取當前使用者喜歡的 listing 資料。
    */
    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(),
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
