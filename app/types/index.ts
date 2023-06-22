import { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};

// Omit 類型工具用於從一個類型中排除特定的屬性，並返回剩餘的屬性。
// Omit<User, "createdAt" | "updatedAt" | "emailVerified"> 表示從 User 類型中排除了 "createdAt"、"updatedAt" 和 "emailVerified" 這三個屬性。
// 使用 & 符號將剩餘的屬性與新的屬性類型組合在一起。新的屬性類型是一個物件類型，其中的 createdAt、updatedAt 和 emailVerified 屬性的類型被設置為 string 或 null。
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
