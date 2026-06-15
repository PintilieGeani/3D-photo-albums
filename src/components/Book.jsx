import { pageAtom, pages } from "./UI"
import Page from "./Page"
import { useAtom } from "jotai"

const Book = ({ ...props }) => {

    const [page] = useAtom(pageAtom)

    return (
        <group {...props} rotation-y={-Math.PI / 2}>
            {
                [...pages].map((pageData, index) => (
                    <Page 
                    key={index} 
                    number={index} 
                    page = {page}
                    {...pageData} 
                    opened = {page > index}
                    bookClosed={page === 0 || page === pages.length}
                    />
                )
            )}
        </group>
    )
}

export default Book