import { createContext, useContext, useEffect, useState } from "react";
import { createPages } from "../utils/createPages";
import { croaziaAprile2026, provaCoazia } from "../data/croazia-aprile-2026";

const BookContext = createContext()

export const BookContextProvider = ({children}) => {

    const [pictures, setPictures] = useState(croaziaAprile2026)


    const pages = createPages(pictures)
    

    const ProvaCambio = () => {
        setPictures(provaCoazia)
    }


    return (
        <BookContext.Provider value={{
             pages,
             ProvaCambio
            }}>
            {children}
        </BookContext.Provider>
    )
}

export const useBook = () => useContext(BookContext)
