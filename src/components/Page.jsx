import { useHelper, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react"
import { BoxGeometry, Uint16BufferAttribute, Vector3, Float32BufferAttribute, Bone, Skeleton, SkinnedMesh, Color, MeshStandardMaterial, SkeletonHelper, SRGBColorSpace, MathUtils } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { pages } from "./UI"


// Dimensioni della pagina
const PAGE_WIDTH = 1.28 //larghezza
const PAGE_HEIGHT = 1.71  //altezza //4:3 ASPECT RATIO
const PAGE_DEPTH = 0.003; // spessore
const PAGE_SEGMENTS = 30 // numero di segmenti
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS //larghezza del segmento

    const lerpFactor = 0.05 // Costante di interpolazione lineare che controlla la velocità

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

for (let i = 0; i < position.count; i++) {
    // prendo tutti i vertici
    vertex.fromBufferAttribute(position, i)
    const x = vertex.x //prendo la posizione x di ogni vertice
    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)) // calcola la skin, in pratica influenza il bone più vicino
    const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH // calcola il peso di ogni skin quindi l'intensità con la quale ogni bone verrà impattato (valore tra 1 e 0)

    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
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
        color: "#111"
    }),

    new MeshStandardMaterial({
        color: whiteColor
    }),

    new MeshStandardMaterial({
        color: whiteColor
    }),



]
// Array per costruire i materiali


// Loader
pages.forEach((page) => {
    useTexture.preload(`/textures/${page.front}.jpg`)
    useTexture.preload(`/textures/${page.back}.jpg`)
    useTexture.preload(`/textures/book-cover-roughness.jpg`)
})



















const Page = ({ number, front, back, page, opened, bookClosed,   ...props }) => {

    const groupRef = useRef()
    const skinnedMeshRef = useRef()
    const[picture, picture2, pictureRoughness] = useTexture([
        `/textures/${front}.jpg`, 
        `/textures/${back}.jpg`,
        ...(number === 0 || number === pages.length - 1 
        ? [`/textures/book-cover-roughness.jpg`]
        : [])
    ])



    picture.colorSpace = picture2.colorSpace = SRGBColorSpace

    const manualSkinnedMesh = useMemo(() => {
        const bones = [];

        for (let i = 0; i <= PAGE_SEGMENTS; i++) {
            let bone = new Bone();
            bones.push(bone)

            if (i === 0) {
                bone.position.x = 0;
            } else {
                bone.position.x = SEGMENT_WIDTH
            }

            if (i > 0) {
                bones[i - 1].add(bone); //attacca la bone alla bone precedente
            }
        }

        const skeleton = new Skeleton(bones)


        // Materiali
        const materials = [...pageMaterials,
        new MeshStandardMaterial({
            color: whiteColor,
            map: picture,
            ...(number === 0
                ? {
                    roughnessMap: pictureRoughness,
                }
                : {
                    roughness: 0.1
                }
            )
        }),

        new MeshStandardMaterial({
            color: whiteColor,
            map: picture2,
            ...(number === pages.length - 1
                ? {
                    roughnessMap: pictureRoughness,
                }
                : {
                    roughness: 0.1
                }
            )
        })

        ];
        // Materiali

        const mesh = new SkinnedMesh(pageGeometry, materials);
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        mesh.add(skeleton.bones[0])
        mesh.bind(skeleton)

        return mesh
    }, [])



    // ANIMAZIONI
    useFrame(() => {

        // Guardian
        if(!skinnedMeshRef.current){
            return
        }

        let targetRotation = opened ? -Math.PI /2 : Math.PI /2
        if(!bookClosed){
            targetRotation += degToRad(number * 0.8)
        }

        const bones = skinnedMeshRef.current.skeleton.bones

        bones[0].rotation.y = MathUtils.lerp(bones[0].rotation.y, targetRotation, lerpFactor)
    })

    return (
        <group {...props} ref={groupRef}>
            <primitive 
            object={manualSkinnedMesh} 
            ref={skinnedMeshRef} 
            position-z = {-number * PAGE_DEPTH + page * PAGE_DEPTH}
            
            />
        </group>
    )
}

export default Page