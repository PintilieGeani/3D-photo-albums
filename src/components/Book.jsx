import { pageAtom } from "./UI"
import Page from "./Page"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { useBook } from "../context/BookContext"

const Book = ({ ...props }) => {

    const [page] = useAtom(pageAtom)
    const [delayedPage, setDelayedPage] = useState(page)

    const {pages} = useBook()

    

    // Animazione delle pagine che girano con delay
    useEffect(() => {
        let timeout;

        const goToPage = () => {
            setDelayedPage((delayedPage) => {
                if (page === delayedPage) {
                    return delayedPage;
                } else { 
                    timeout = setTimeout(() => {
                        goToPage()
                    }, Math.abs(page - delayedPage) > 2 ? 50 : 150)

                    if(page> delayedPage){
                        return delayedPage + 1
                    }
                    if(page < delayedPage){
                        return delayedPage -1
                    }
                }
            })
        }

        goToPage();

        return() => {
            clearTimeout(timeout)
        }
    }, [page])

    return (
        <group {...props} rotation-y={-Math.PI / 2}>
            {
                [...pages].map((pageData, index) => (
                    <Page
                        key={index}
                        number={index}
                        page={delayedPage}
                        {...pageData}
                        opened={delayedPage > index}
                        bookClosed={delayedPage === 0 || delayedPage === pages.length}
                    />
                )
                )}
        </group>
    )
}

export default Book