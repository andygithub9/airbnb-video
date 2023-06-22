"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
}) => {
  // console.log(errors);
  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      <input
        id={id}
        disabled={disabled}
        // register 是 React Hook Form 提供的一個函式，用於將輸入元素與表單狀態關聯起來，以便後續處理表單驗證和收集數據。
        // 在這個例子中，我們將 register 函式應用於 <input> 元素上，並將 id 字串作為參數傳遞給它。
        // 將這個輸入欄位與表單中的 id 欄位關聯起來。當使用者在輸入框中輸入內容時，React Hook Form 將自動追蹤並更新 id 欄位的值。
        // 這樣做的效果等同於手動為該 <input> 元素添加註冊所需的屬性，例如 name、onChange、onBlur 等。通過展開運算符 ...，我們 可以將 register("example") 返回的物件中的屬性和設定擴展到 <input> 元素上，以實現自動註冊和表單狀態追蹤的功能。
        {...register(id, { required })}
        // placeholder 要有一個空白符，因為我們之後給他一個 floating animation
        placeholder=" "
        type={type}
        className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
        ${formatPrice ? "pl-9" : "pl-4"}
        ${errors[id] ? "border-rose-500" : "border-neutral-300"}
        ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />
      <label
        className={`absolute text-base duration-150 transform -translate-y-3 top-5 z-10 origin-[0] 
        ${formatPrice ? "left-9" : "left-4"} 
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
        ${errors[id] ? "text-rose-500" : "text-zinc-400"}
      `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
