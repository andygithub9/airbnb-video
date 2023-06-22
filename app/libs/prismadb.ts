import { PrismaClient } from "@prisma/client";

// declare global 關鍵字，將 prisma 声明為全域變數。這意味著在整個程式碼中，無需額外引入或定義，可以直接存取和使用 prisma 變數。
declare global {
  // 定義了一個名為 prisma 的全域變數，類型為 PrismaClient | undefined
  var prisma: PrismaClient | undefined;
}

/*
什麼是 globalThis ?

當我們在瀏覽器環境或Node.js環境中運行JavaScript代碼時，需要訪問全局範圍的變數和函數。然而，在不同的環境中，全局對象的名稱可能不同，例如在瀏覽器中是 window，在Node.js中是 global。

為了解決這個跨環境的問題，ECMAScript 2020 引入了 globalThis 這個特殊的全局物件。它提供了一種統一的方式來訪問全局範圍的變數和函數，不受環境的限制。

globalThis 可以被認為是一個頂層的物件，在任何地方都可以訪問它。它包含了當前執行上下文中的全局變數和函數。無論我們是在瀏覽器環境還是Node.js環境中運行，都可以使用 globalThis 來訪問全局範圍的對象。

使用 globalThis 可以提高代碼的可移植性，使它在不同的環境中具有相同的行為。例如，在跨平台的JavaScript庫或框架中，可以使用 globalThis 來確保代碼能夠在不同的環境中正確運行，而不需要關心具體的全局對象名稱。

總結來說，globalThis 是一個在瀏覽器環境和Node.js環境中都可用的全局物件，用於訪問全局範圍的變數和函數，提供了跨環境的一致性。它是一個統一的全局對象，使得代碼在不同環境中的可移植性更好。
*/

// globalThis 是在瀏覽器環境和Node.js環境下可以全局訪問的內置物件，它提供了全域作用域中的全局變數和函數。這裡使用 globalThis.prisma 來檢查是否已經存在一個名為 prisma 的全域變數。如果已經存在，則將 globalThis.prisma 的值賦給 client。如果不存在，則創建一個新的 PrismaClient 實例並賦值給 client。
// 這樣做的目的是為了確保只有一個 PrismaClient 實例被創建並在全域範圍內共享。如果已經存在一個全域的 prisma 變數，則使用該變數的值。否則，創建一個新的 PrismaClient 實例並將其賦給 client。這樣做可以避免在不同的模組中重複創建 PrismaClient 實例，並確保它們共享同一個資料庫連線。
const client = globalThis.prisma || new PrismaClient();

// 這行代碼是因為 next.js13 在 development 環境的 hot reloading 會造成創建一大堆的 new PrismaClient() 實例，會在終端機出現終端機出現警告，所以我們把 PrismaClient 實例指派給 globalThis 變數， globalThis 變數不會被 hot reload 影響
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client