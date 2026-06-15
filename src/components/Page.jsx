import { useMemo, useRef } from "react"
import { BoxGeometry, Uint16BufferAttribute, Vector3, Float32BufferAttribute, Bone, Skeleton, SkinnedMesh, Color, MeshStandardMaterial } from "three";


// Dimensioni della pagina
const PAGE_WIDTH = 1.28 //larghezza
const PAGE_HEIGHT = 1.71  //altezza //4:3 ASPECT RATIO
const PAGE_DEPTH = 0.003; // spessore
const PAGE_SEGMENTS = 30 // numero di segmenti
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS //larghezza del segmento

const pageGeometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    2
)
// Dimensioni della pagina



// In questo blocco vado ad definire le bones e a calcolare quanto ogni bone va ad impattare le bones vicine
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);
const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [] // bones
const skinWeights = []

for(let i = 0; i<position.count; i++){
    // prendo tutti i vertici
    vertex.fromBufferAttribute(position, i)
    const x  = vertex.x //prendo la posizione x di ogni vertice
    const skinIndex = Math.max(0, Math.floor(x/ SEGMENT_WIDTH)) // calcola la skin, in pratica influenza il bone più vicino
    const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH // calcola il peso di ogni skin quindi l'intensità con la quale ogni bone verrà impattato (valore tra 1 e 0)

    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
    skinWeights.push(skinWeight, skinWeight + 1, 0, 0)
}
// In questo blocco vado ad definire le bones e a calcolare quanto ogni bone va ad impattare le bones vicine


// Applico le bones alla geometria
pageGeometry.setAttribute(
    "skinIndex",
    new Uint16BufferAttribute(skinIndexes, 4)
)

pageGeometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeights, 4)
)
// Applico le bones alla geometria


// Array per costruire i materiali
const whiteColor = new Color("White")
const pageMaterials = [
    new MeshStandardMaterial({
        color: whiteColor
    }),

    new MeshStandardMaterial({
        color:"#111"
    }),

    new MeshStandardMaterial({
        color: whiteColor
    }),

    new MeshStandardMaterial({
        color: whiteColor
    }),

    new MeshStandardMaterial({
        color:"pink"
    }),

    new MeshStandardMaterial({
        color:"blue"
    }),

]
// Array per costruire i materiali



const Page = ({number, front, back, ...props}) => {

    const group = useRef()
    const skinnedMesh = useRef()

    const manualSkinnedMesh = useMemo(() => {
        const bones = [];
        for(let i = 0; i<= PAGE_SEGMENTS; i++){
            let bone = new Bone();
            bone.push(bone)

            if( i === 0) {
                bone.position.x = 0;
            }else {
                bone.position.x = SEGMENT_WIDTH
            }

            if(i > 0){
                bones [i - 1].add(bone); //attacca la bone alla bone precedente
            }
        }

        const skeleton = new Skeleton(bones)
        const materials = pageMaterials;
        const mesh = new SkinnedMesh(pageGeometry, materials);
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        mesh.add(skeleton.bones[0])
        mesh.bind(skeleton)

        return mesh
    }, [])


    return (
    <group {...props} ref={group}>
        <mesh scale={0.1}>
            <primitive object={pageGeometry} attach={"geometry"}/>
            <meshBasicMaterial color={"red"}/>
        </mesh>
    </group>
)
}

export default Page