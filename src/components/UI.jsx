import { atom, useAtom } from "jotai";
import { useBook } from "../context/BookContext";



export const pageAtom = atom(0);


export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const { pages, ProvaCambio } = useBook()

  return (
    <>
      <div
        className="pointer-events-none select-none fixed z-0 overflow-hidden"
        style={{
          top: "40%",
          left: "-10%",
          width: "120%",
          transform: "rotate(-25deg)",
          transformOrigin: "center center",
        }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "scrollLeft 40s linear infinite", width: "max-content" }}
        >
          <h1 className="titolo-bold uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Ari & Ge</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-vuoto uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Memories of us</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-small uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Our Story</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-glow uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>To the moon and back</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-glass uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Our adventures</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-vuoto uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Timeless Moments</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-bold uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Every moment with you</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-glow uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Turn the Page</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-bold uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Ari & Ge</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-vuoto uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Memories of us</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-small uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Our Story</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-glow uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>To the moon and back</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-glass uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Our adventures</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-vuoto uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Timeless Moments</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-bold uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Every moment with you</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
          <h1 className="titolo-glow uppercase" style={{ marginRight: "4rem", lineHeight: 1 }}>Turn the Page</h1>
          <span style={{ color: "white", fontSize: "3rem", marginRight: "4rem", lineHeight: 1, alignSelf: "center" }}>•</span>
        </div>
        <style>{`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

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
          </div>
        </div>

        
      </main>
    </>
  );
};
