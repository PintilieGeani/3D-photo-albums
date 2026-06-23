import { useCursor, useHelper, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react"
import { BoxGeometry, Uint16BufferAttribute, Vector3, Float32BufferAttribute, Bone, Skeleton, SkinnedMesh, Color, MeshStandardMaterial, SkeletonHelper, SRGBColorSpace, MathUtils } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { pageAtom} from "./UI"
import { easing } from "maath";
import { useAtom } from "jotai";
import { useBook } from "../context/BookContext";




// Dimensioni della pagina
const PAGE_WIDTH = 1.28 //larghezza
const PAGE_HEIGHT = 1.71  //altezza //4:3 ASPECT RATIO
const PAGE_DEPTH = 0.003; // spessore
const PAGE_SEGMENTS = 30 // numero di segmenti
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS //larghezza del segmento

const easingFactor = 0.5 // Costante di easing che controlla la velocità
const easingFactorFold = 0.3
const insideCurveStrenth = 0.15 // Controlla la forza della curvatura
const outsideCurveStrenth = 0.05 // Controlla la forza della curvatura
const turningCurveStrenth = 0.09 // Controlla la forza della curvatura

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
const emisiveColor = new Color("orange")
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
// pages.forEach((page) => {
//     useTexture.preload(`/textures/${page.front}.jpg`)
//     useTexture.preload(`/textures/${page.back}.jpg`)
//     useTexture.preload(`/textures/book-cover-roughness.jpg`)
// })



















const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {

    const groupRef = useRef()
    const skinnedMeshRef = useRef()
    const {pages} = useBook()
    
    const [picture, picture2, pictureRoughness] = useTexture([
        `/textures/${front}.jpg`,
        `/textures/${back}.jpg`,
        ...(number === 0 || number === pages.length - 1
            ? [`/textures/book-cover-roughness.jpg`]
            : [])
    ])



    picture.colorSpace = picture2.colorSpace = SRGBColorSpace


    // Angolo alzato sull'animazione
    const turnedAt = useRef(0)
    const lastOpened = useRef(opened)

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
            ),
            emissive: emisiveColor,
            emissiveIntensity: 0
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
            ),
            emissive: emisiveColor,
            emissiveIntensity: 0
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

    useEffect(() => {
        if (!skinnedMeshRef.current) return
        skinnedMeshRef.current.material[4].map = picture
        skinnedMeshRef.current.material[4].needsUpdate = true
        skinnedMeshRef.current.material[5].map = picture2
        skinnedMeshRef.current.material[5].needsUpdate = true
    }, [picture, picture2])


    // ANIMAZIONI
    useFrame((_, delta) => {

        // Guardian
        if (!skinnedMeshRef.current) {
            return
        }

        const emissiveIntensity = highlighted ? 0.12 : 0
        skinnedMeshRef.current.material[4].emissiveIntensity = 
        skinnedMeshRef.current.material[5].emissiveIntensity = 
        MathUtils.lerp(skinnedMeshRef.current.material[4].emissiveIntensity, emissiveIntensity, 0.1)

        if (lastOpened.current !== opened) {
            turnedAt.current = +new Date();
            lastOpened.current = opened
        }

        let turningTime = Math.min(400, new Date() - turnedAt.current) / 400
        turningTime = Math.sin(turningTime * Math.PI);

        let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
        if (!bookClosed) {
            targetRotation += degToRad(number * 0.8)
        }

        const bones = skinnedMeshRef.current.skeleton.bones

        for (let i = 0; i < bones.length; i++) {

            const target = i === 0 ? groupRef.current : bones[i]

            const insideCurveIntesity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0
            const outsideCurveIntesity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0
            const turningIntesity = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime
            let rotationAngle = insideCurveStrenth * insideCurveIntesity * targetRotation - outsideCurveStrenth * outsideCurveIntesity * targetRotation + turningCurveStrenth * turningIntesity * targetRotation

            let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2)

            if (bookClosed) {
                if (i === 0) {
                    rotationAngle = targetRotation
                    foldRotationAngle = 0
                } else {
                    rotationAngle = 0
                }
            }

            easing.damp(
                target.rotation,
                "y",
                rotationAngle,
                easingFactor,
                delta
            )
            const foldIntesity = i > 8 ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime : 0 // formula per girare l'angolino della pagina sull'asse x

            easing.damp(
                target.rotation,
                "x",
                rotationAngle * foldIntesity,
                easingFactorFold,
                delta
            )
        }

    })

    const [_, setPage] = useAtom(pageAtom)
    const [highlighted, setHiglighted] = useState(false)
    useCursor(highlighted)
    return (
        <group {...props}
            ref={groupRef}
            onPointerEnter={(e) => {
                e.stopPropagation()
                setHiglighted(true)
            }}
            onPointerLeave={(e) => {
                e.stopPropagation()
                setHiglighted(false)
            }}
            onClick={(e) => {
                e.stopPropagation()
                setPage(opened ? number : number + 1)
                setHiglighted(false)
            }}
        >
            <primitive
                object={manualSkinnedMesh}
                ref={skinnedMeshRef}
                position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}

            />
        </group>
    )
}

export default Page