import { atom, useAtom } from "jotai";
import { useBook } from "../context/BookContext";



export const pageAtom = atom(0);


export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const { pages, ProvaCambio } = useBook()

  return (
    <>
      <main className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-end flex-col">
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${
                  index === page
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                }`}
                onClick={() => setPage(index)}
              >
                {index === 0 ? "Cover" : `Page ${index}`}
              </button>
            ))}
            <button
              className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              }`}
              onClick={() => setPage(pages.length)}
            >
              Back Cover
            </button>
            <button onClick={ProvaCambio}>Cambia</button>
          </div>
        </div>
      </main>
    </>
  );
};
