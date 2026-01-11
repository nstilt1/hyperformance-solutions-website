import Link from "next/link";

export default function ImageCard({ imageSrc, buttonSide = "right", buttonText = "Click Me", href = "/" }) {
  const isLeft = buttonSide === "left";

  return (
    <div
      className={`z-0 relative w-[75vw] h-[25vh] rounded-lg shadow-lg overflow-hidden
        ${isLeft ? "ml-0 mr-auto" : "ml-auto mr-0"}`}
    >
      <img
        src={imageSrc}
        alt="Card background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className={`absolute top-0 bottom-0 flex items-center px-6 ${
          isLeft ? "left-0 justify-start" : "right-0 justify-end"
        }`}
      >
        <Link href={href}>
            <button className="bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-gray-100 z-10">
            {buttonText}
            </button>
        </Link>
      </div>
    </div>
  );
}
