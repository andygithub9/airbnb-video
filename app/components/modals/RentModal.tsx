"use client";

import useRentModal from "@/app/hooks/useRentModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset, // https://react-hook-form.com/docs/useform/reset
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "", // 對應 prisma/schema.prisma 的 model Listing 的 imageSrc
      price: 1,
      title: "",
      description: "",
    },
  });

  const category = watch("category"); // watch useForm 裡的 defaultValues 的 category 屬性的值
  const location = watch("location");
  const guestCount = watch("guestCount");
  const bathroomCount = watch("bathroomCount");
  const roomCount = watch("roomCount");
  const imageSrc = watch("imageSrc");

  // 使用 import 關鍵字將 dynamic 函數從 next/dynamic 模組導入。next/dynamic 是 Next.js 提供的一個函數，用於實現動態加載組件的功能。
  // 使用 useMemo 鉤子函數來避免在每次重新渲染時都創建一個新的動態組件。useMemo 用於對一個值進行記憶化，只有當依賴項發生變化時才重新計算。
  // useMemo 的第一個參數是一個回調函數，用於計算動態組件。回調函數內部使用 dynamic 函數來創建動態組件。dynamic 函數接受兩個參數，第一個參數是一個回調函數，用於動態加載組件的路徑或模組。在這裡，'../Map' 是要動態加載的組件路徑。第二個參數是一個物件，用於設置動態加載的選項。這裡的 { ssr: false } 表示在伺服器端渲染（Server-Side Rendering）時不需要加載該組件。
  // useMemo 的第二個參數是一個依賴項數組，用於指定在依賴項發生變化時重新計算回調函數。
  // 最後，將 useMemo 的結果賦值給 Map 變數，這個變數將持有動態加載的組件。
  // 會這樣做是因為 leaflet 不完全支援 react 要動態加載 Map 組件並把 ssr 關掉，然後我們需要根據 location 的變化動態加載 Map 組件
  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const setCustomValue = (id: string, value: any) => {
    // https://www.youtube.com/watch?v=JNnmFysl9Ww
    // https://www.youtube.com/watch?v=yvzU12E82M0&list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s&index=6
    setValue(id, value, {
      // shouldValidate：當設為 true 時，設定值後會觸發相應的表單驗證。這意味著設定值後，React Hook Form 將檢查該欄位是否通過了它的驗證規則。如果欄位驗證失敗，它將在錯誤物件中記錄相關錯誤信息。
      shouldValidate: true,

      // shouldDirty：當設為 true 時，設定值後會將該欄位標記為已修改（dirty）。這對於後續的驗證和表單提交非常有用。當表單提交時，已修改（dirty）的欄位將被視為參與了表單的修改，並參與相關的處理邏輯。
      shouldDirty: true,

      // shouldTouch：當設為 true 時，設定值後會將該欄位標記為已觸碰（touched）。這對於顯示與觸碰相關的錯誤提示或視覺效果非常有用。通常，當使用者在欄位中輸入內容或觸發輸入事件時，React Hook Form 會自動將該欄位標記為已觸碰。然而，如果你希望在代碼中手動標記欄位為已觸碰，可以使用 shouldTouch 選項。
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing Created!");
        router.refresh();
        reset(); // reset react hook form
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best desctibes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your placelocated?"
          subtitle="Help guests find you!"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about tour place"
          subtitle="What amenities do your have?"
        />
        <Counter
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Guests"
          subtitle="How many bathrooms do you have?"
          value={bathroomCount}
          onChange={(value) => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests your place looks like!"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Airbnb your home!"
      body={bodyContent}
    />
  );
};

export default RentModal;
