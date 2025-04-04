import Image from "next/image";

export const DailyImages = ({ image1, image2, image3 }) => {
  return (
    <div className="mx-auto max-w-sm sm:max-w-md">
      <div className="flex [&:hover>div]:w-8 [&>div:hover]:w-[300px] sm:[&>div:hover]:w-[400px]">
        <div className="group relative h-[300px] w-[200px] cursor-pointer overflow-hidden shadow-md shadow-black/30 transition-all duration-200 sm:h-[400px] sm:w-[400px]">
          <Image
            priority
            src={image1}
            alt="First daily image"
            className="h-full object-cover transition-all"
            fill
          />
        </div>
        <div className="group relative h-[300px] w-[200px] cursor-pointer overflow-hidden shadow-md shadow-black/30 transition-all duration-200 sm:h-[400px] sm:w-[400px]">
          <Image
            priority
            src={image2}
            alt="Second daily image"
            className="h-full object-cover transition-all"
            fill
          />
        </div>
        <div className="group relative h-[300px] w-[200px] cursor-pointer overflow-hidden shadow-md shadow-black/30 transition-all duration-200 sm:h-[400px] sm:w-[400px]">
          <Image
            priority
            src={image3}
            alt="Third daily image"
            className="h-full object-cover transition-all"
            fill
          />
        </div>
      </div>
    </div>
  );
};
