import { pages } from "./UI"
import Page from "./Page"

const Book = ({...props}) => {
    return(
        <group {...props}>
            {
                [...pages].map((pageData, index) => (
                    index === 0 
                    ? (
                    <Page key={index} number={index} {...pageData} />
                    ) 
                    :  null
                ))
            }
        </group>
    )
}

export default Book