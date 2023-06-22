"use client";

// 執行 `npx prisma db push` 之後會根據你的 prisma/schema.prisma 生成 .d.ts 文件
// 在 app/actions/getCurrentUser.ts 我們會先用 next-auth/next 的 getServerSession 取得當前用戶的 email ，在用這個 email 去數據庫撈這個用戶的資料，因為資料從數據庫來，所以這個用戶的資料的類型就會是 prisma 生成 .d.ts 文件的 User 這個類型
import { User } from "@prisma/client";

// 因為 User 類型中有些屬性的類型為 Date 可能會有問題，所以我們在 app/actions/getCurrentUser.ts 把屬性為 Date 類型的屬性轉為 string 類型，然後我們在 @/app/types 定義了一個新的 SafeUser 類型， Omit 掉 User 類型中屬性是 Date 類型的屬性，再用 & 符號把原本類型為 Date 的屬性定義為 string 類型，再和 User 組合在一起
import { SafeUser } from "@/app/types";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Categories from "./Categories";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  console.log(currentUser);
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
