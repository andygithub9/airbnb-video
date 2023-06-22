# ReactNode vs ReactElement?

```tsx
 <p> // <- ReactElement = JSX.Element
  <Custom> // <- ReactElement = JSX.Element
    {true && "test"} // <- ReactNode
  </Custom>
 </p>
```

https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement

https://juejin.cn/post/6991488685787054116

我们发现 ReactNode 是一个联合类型，其中的类型包括 | ReactElement
| string
| number
| ReactFragment
| ReactPortal
| boolean
| null
| undefined。

在 ReactNode 的联合类型中，ReactChild 这个类型也是一个联合类型，该类型为 ReactElement 或者 ReactText。

此时我们就发现了一个实事，也就是 ReactElement 这个类型只不过是 ReactNode 这个类型的一个子类型

ReactElement 的接口其中有 type、props、key 这三个属性。

# Zustand

Zustand is a state management lib  
docs: https://docs.pmnd.rs/zustand/getting-started/introduction

# Data Fetching without fetch()

不用 fetch() 而是用 axios, prisma 或其他的第三方庫做 Data Fetching 可以在 page.tsx 用 `export const revalidate = 3600;` 來控制 caching or revalidating behavior

https://stackoverflow.com/questions/76264542/does-axios-can-be-used-in-new-next-js-13-instead-of-exteded-next-fetch-api-versi

https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#data-fetching-without-fetch

https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#background-revalidation

# tailwindcss 的 peer 的用法

https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state

https://ithelp.ithome.com.tw/articles/10266033

# tailwindcss 的 Transform Origin 的用法

https://tailwindcss.com/docs/transform-origin

# prisma

1. install `npm i -D prisma`
2. init `npx prisma init`
3. Start from scratch: MongoDB https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb-typescript-mongodb
4. prisma/schema.prisma 的 datasource db 的 provider 改成 "mongodb"
5. 到 [mongodb atlas](https://www.mongodb.com/atlas/database) 註冊或登入
6. 點擊左側 Database -> 點擊 Build a Database -> 點擊 free option -> Provider, Region, Name 這些沒差可以用預設的就好 -> 點擊 Create -> 設定 Username, Password ，這兩個欄位不要有特殊字元 -> 點擊 Create User -> 在 Add entries to your IP Access List 的 IP Address 欄位輸入 `0.0.0.0/0` 允許所有 IP 連接你的 clusters ，因為你很可能用的是浮動 IP ，每次你的 IP 變動一次就要再加入當時的 IP 到 IP Access List，所以允許所有 IP 會比較方便一點，只是要記得不要外流你連接 clusters 的 URL -> 點擊 Add Entry -> 點擊 Finish and Close -> 點擊 Go to Databases
7. 點擊 Cluster 名旁邊的 Connect -> 點擊 MongoDB for VS Code -> 會看到 connection string 和 connection string `mongodb+srv://<username>:<password>@cluster0.syhhz5s.mongodb.net/<Database name>` 的使用說明： Replace `<password>` with the password for the xxx user. When entering your password, make sure all special characters are URL encoded. -> 複製 connection string -> 到 .env 把 connection string 賦值給 DATABASE_URL 變數，然後記得把 `<password>` 字串換成你真正的密碼，把 `<Database name>` 字串換成你真正的數據庫名，`<Database name>` 為必填不填的話會報錯： The provided database string is invalid.
8. 創建 prisma/schema.prisma 目錄和檔案， 代碼請看 prisma/schema.prisma
9. 執行 `npx prisma db push`

# NextAuth integrate prisma using @next-auth/prisma-adapter

1. Installation  
    https://authjs.dev/reference/adapter/prisma#installation
   `npm install next-auth @prisma/client @next-auth/prisma-adapter`
2. 除了 prisma-adapter 的相關依賴，我們還需要一個 credential login 的庫 `npm i bcrypt` ，還有 bcrypt 這個庫的 types `npm i -D @types/bcrypt`
3. Setup https://authjs.dev/reference/adapter/prisma#setup  
   create pages/api/auth/\[...nextauth].ts file  
   代碼請見 pages/api/auth/\[...nextauth].ts file
4. 創建 app/api/register/route.ts ，在用戶註冊的時候打這隻 api 把用戶資料存進 db
5. 在 app/components/modals/LoginModal.tsx 引入 next-auth 的 signIn function ，傳入必要參數並調用此方法，並在 .then 的 callback 寫登入的邏輯判斷
6. 創建 app/action/getCurrentUser.ts 文件，在此文件從 "next-auth/next" 引入 getServerSession 拿到當前用戶的 session ，再拿這個 session 通過 prisma 去 db 撈資料，就可以取得當前用戶的資料了

## implement social login

### Github

1. 登入你的 Github
2. 點自己頭像 -> 點 setting
3. 到左側欄最下面 Developer settings
4. 點左側欄 OAuth Apps
5. 點右上角 New Oauth App
6. Homepage URL 和 Authorization callback URL 都填 http://localhost:3000/ 就可以了
7. 點擊下方 Register application
8. 就可以拿到 Client ID 和 Client secret ，把這些設定到 .env 文件
9. 在有用到 Github 登入的地方從 "next-auth/react" 引入 signIn function ，傳入參數並調用 signIn("github") ，就完成 Github 的 social login 了

### Google

1. 到 google cloud console https://console.cloud.google.com/
2. 點擊左上角 Select a project
3. 點擊右上方 NEW PROJECT
4. 填完名稱後點擊 CREATE
5. 點擊左上角 Select a project -> 選擇你剛剛創建的專案
6. 點擊左側爛 -> 點擊 APIs & Services -> 點擊 OAuth consent screen
7. 選擇 External -> 點擊 CREATE
8. 填寫 App name ， email 都填自己的信箱 -> 點擊 SAVE AND CONTINUE
9. 點擊左側欄 Credentials -> 點擊中間上方 Create credentials -> 點擊 OAuth client ID
10. Application type 選擇 Web application -> Authorized redirect URIs 填寫 http://localhost:3000/api/auth/callback/google
11. 點擊左下方 CREATE
12. 就可以拿到 Client ID 和 Client secret ，把這些設定到 .env 文件
13. 在有用到 Google 登入的地方從 "next-auth/react" 引入 signIn function ，傳入參數並調用 signIn("google") ，就完成 Google 的 social login 了

# 地圖套件

1. npm i leaflet
2. npm i -D @types/leaflet
3. npm i react-leaflet
4. 代碼請參考 app/components/MAP.tsx 和 app/components/modals/RentModal.tsx

# upload image using Cloudinary

1. 到 https://cloudinary.com/
2. 點擊 SIGN UP FOR FREE
3. 登入之後點擊左側欄 Dashboard
4. 安裝 Next Cloudinary https://next-cloudinary.spacejelly.dev/installation  
   `npm install next-cloudinary`
5. Add the following variable to your .env file.
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<Your Cloud Name>"` ，  
   Dashboard 上面有你的 Cloud Name ，不要忘記變數值前後要加雙引號
6. 代碼請見： app/components/inputs/ImageUpload.tsx
7. 在 Cloudinary 點擊左下角的齒輪進到 Settings -> 點擊左側欄 Upload -> 找到 Upload presets 這一項 -> 點擊 Add upload preset -> Signing Mode 選擇 Unsigned -> 點擊 Save -> 複製剛剛創建的 Upload preset 的 Name 貼到 CldUploadWidget 組件的 uploadPreset 屬性
8. 點擊 CldUploadWidget 選擇片後就會直接上傳到 Cloudinary ，點擊在 Cloudinary 左側的 Media Library 可以看到剛才上傳的圖片

# 錯誤紀錄

## 靜態頁面生成錯誤

```sh
Generating static pages (0/11)Error: Error: Dynamic server usage: searchParams.userId
at getListings (/Users/tvbs/Documents/GitHub/airbnb-video/.next/server/chunks/275.js:107:15)
```

解決方法：https://github.com/vercel/next.js/issues/49182#issuecomment-1535292150
可能原因：  
根據 https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic 文檔，可能是我們在靜態生成頁面（Generating static pages）的時候 searchParams.userId 並不存在，所以通過在 app/page.tsx 設置 `export const dynamic = 'force-dynamic'` 將所有的 fetch 改為動態的

## Vercel 部署錯誤

```sh
PrismaClientInitializationError: Prisma has detected that this project was built on Vercel, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the `prisma generate` command during the build process.
```

根據文檔：https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/vercel-caching-issue#a-custom-postinstall-script  
我們 package.json file 下新增一行指令

```json
{
  "scripts" {
    "postinstall": "prisma generate"
  }
}
```

## error=oauthaccountnotlinked
如果在部署到 vercel 上後，使用 github social login 發現 url 帶有 error=oauthaccountnotlinked 錯誤，可以試著先把你原本在 localhost 測試用的先刪掉再試一次看看  
參考：https://github.com/nextauthjs/next-auth/discussions/1601#discussioncomment-804606