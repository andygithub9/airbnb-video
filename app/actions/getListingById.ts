import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    // 這段 TypeScript 代碼使用 Prisma 庫從資料庫中檢索一個 "listing"（列表），並同時檢索相關聯的 "user"（使用者）。
    // 首先，代碼使用 prisma.listing.findUnique() 語法調用 Prisma 的 findUnique 方法來查詢 "listing"。這將返回符合指定條件的單個 "listing"。
    // 在這個例子中，findUnique 方法帶有一個物件作為參數，其中包含 where 和 include 屬性。where 屬性指定了查詢的條件，這裡是根據 id 欄位來查詢，listingId 是要查詢的 "listing" 的唯一標識符。
    // 接著，include 屬性指定了要一起檢索的相關聯資料。在這裡，我們通過將 user 設置為 true，指示 Prisma 同時檢索與 "listing" 相關聯的 "user" 資料。
    // 最後，使用 await 關鍵字將查詢結果賦值給 listing 變數。await 用於等待 findUnique 方法的執行完成，確保在進一步處理 listing 之前，查詢結果已經返回。
    // 總結來說，這段代碼使用 Prisma 的 findUnique 方法從資料庫中檢索一個指定的 "listing"，同時還檢索了與之相關聯的 "user" 資料。該查詢結果存儲在 listing 變數中，可供後續處理和使用。
    // 雖然 include 在某種程度上實現了類似於 JOIN 的功能，但實際上 Prisma 使用的是兩個單獨的查詢和資料組合策略，並不直接對應到 SQL 中的 JOIN 操作。
    // 當你在 Prisma 中使用 include 時，Prisma 實際上會在數據庫中執行兩個單獨的查詢。第一個查詢用於檢索主要的資料（在這種情況下是 "listing"），第二個查詢用於檢索相關聯的資料（在這種情況下是 "user"）。
    // Prisma 將這兩個查詢的結果分開返回給應用程式層面。然後，你的程式可以將這兩個查詢的結果根據相關聯資料進行組合，並將相關資料添加到 listing 物件中。這樣，你可以獲得一個包含主要資料和相關資料的完整 listing 物件。
    // 這種兩個單獨的查詢和資料組合策略是 Prisma 在 include 中使用的一種載入策略，旨在提高效能和彈性。載入策略可以根據你的需求進行配置，例如使用批量載入策略（selectRelated）或提前定義相關性（preloading）等方式。
    // 總結來說，Prisma 的 include 可以觸發多個單獨的查詢，然後你的程式可以通過組合這些查詢的結果，將相關資料與主要資料關聯起來。這樣你就可以方便地獲取完整的資料，並進一步處理它們。
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      },
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null,
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
