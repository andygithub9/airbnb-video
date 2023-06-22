'use client'

import { IconType } from "react-icons";

interface ButtonProps {
  label: string;

  // React.MouseEvent<> 這個泛型型別的角色就是用來描述這些事件物件的型別。你可以將 <> 中的參數視為填入具體類型的地方，它可以是任何有效的 HTML 元素類型，例如 <HTMLButtonElement>、<HTMLDivElement>、<HTMLInputElement> 等等。
  // 使用 React.MouseEvent<> 可以確保在事件處理函數中正確地接收到對應 HTML 元素的滑鼠事件物件，並且在編譯階段進行類型檢查，以提高程式碼的正確性和可讀性。例如，當你使用 React.MouseEvent<HTMLButtonElement> 時，它就描述了與 <button> 元素相關的滑鼠事件的型別，並且只有與該元素相關的事件才能被正確地傳遞到該事件處理函數中。
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full 
      ${outline ? "bg-white" : "bg-rose-500"} 
      ${outline ? "border-black" : "border-rose-500"} 
      ${outline ? "text-black" : "text-white"}
      ${small ? "py-1" : "py-3"}
      ${small ? "text-sm" : "text-base"}
      ${small ? "font-light" : "font-semibold"}
      ${small ? "border-[1px]" : "border-2"}
  `}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
    </button>
  );
};

export default Button;
