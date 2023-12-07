'use client'

import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { Suspense,useRef,useState } from 'react'
import { Canvas, useThree, extend } from '@react-three/fiber';
import {
  Text3D,
  OrbitControls,
  MeshTransmissionMaterial,
  OrthographicCamera,
  Center,
  Float,
  Effects,
  useGLTF
} from '@react-three/drei';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { useControls } from 'leva';
extend({ GlitchPass, UnrealBloomPass,RGBShiftShader });


const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

// function Model({setLoaded}) {
//   const {camera, size:{width,height}} = useThree()
//   const gltf = useGLTF('/david_head/scene.gltf')
//   // const davidRef = useRef(gltf.scene)
//   // useFrame((_, delta) => {
//   //   //davidRef.current.rotation.x += 1 * delta
//   //   davidRef.current.rotation.y += 0.5 * delta
//   // })
//   //NOTE dynamic zoom which we wont currently support
//   // const box = new THREE.Box3().setFromObject(gltf.scene);
//   // const boxSize = box.getSize(new THREE.Vector3()).length();
//   // const boxCenter = box.getCenter(new THREE.Vector3());
//   // camera.zoom = 
//   //   width/ (1.5*(box.max.x - box.min.x));
//   camera.zoom = width/ (1.*(10));     
//   return <primitive object={gltf.scene} scale={.1} position={[5,-18,-8]} color={new THREE.Color("black")}>   
//   </primitive>
// }

function Cube(props) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  const config = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 2048, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.07, min: 0, max: 1, step: 0.01 },
    thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
    ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.16, min: 0, max: 1 },
    anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
    attenuationColor: '#fff5f5',
    color: '#c4c4c4',
    bg: '#72653e',
  });
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[20, 40, 4]} />
      <MeshTransmissionMaterial
        background={new THREE.Color(config.bg)}
        {...config}
      />
      {/* <meshStandardMaterial
        color="red"
        emissive="red"
        emissiveIntensity={1.2}
        toneMapped={false}
      /> */}
    </mesh>
  );
}

function TextData({
  animatedHitpoints = 100000,
  totalHitpoints = 100000,
  margin = 0.5,
}) {
  const { width, height } = useThree((state) => state.viewport);

  return (
    <Float floatIntensity={6} speed={0.9}>
      <group position-z={-6}>
        <Center
          bottom
          right
          position={[-width / 2 + margin, height / 2 - margin, 0]}
        >
          <Text3D
            lineHeight={0.75}
            font={'/fonts/Coinbase_Sans_Bold.json'}
            size={2}
          >
            {`5d 6h 4min 6sec`.split(' ').join('\n')}
            <meshStandardMaterial
              color={new THREE.Color('black')}
              // emissive={new THREE.Color('white')}
            />
          </Text3D>
        </Center>
        <Center bottom position={[-margin, -height / 2 + margin + 1, 0]}>
          <Text3D font={'/fonts/Coinbase_Sans_Bold.json'} size={0.9}>
            {animatedHitpoints}/{totalHitpoints}
            {/* <MeshTransmissionMaterial
            background={new THREE.Color(config.bg)}
            {...config}
          /> */}
            <meshStandardMaterial
              color={new THREE.Color('black')}
              // emissive={new THREE.Color('white')}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

function Light(){
  const { width, height } = useThree((state) => state.viewport);
  return (
    <>
    <ambientLight />
    <group>
    <pointLight position={[1,1,1]}  />
    </group>
    </>
  )
}
export default function Page() {
  return (
    <>
      <div style={{width:"100%",height:"100vh"}}>
        {/* jumbo */}
        <Canvas>
          <Effects>
            <glitchPass
              // @ts-ignore
              attachArray="passes"
            />
            <unrealBloomPass
              // @ts-ignore
              attachArray="passes"
              //args={[undefined, 1., .7, 0.12]}
            />
           
          </Effects>
        <Light />
          <Cube position={[0, 0, -4]} />
          if(data?.currentHitpoints != null && data.totalHitpoints != null)
          {
            <TextData
              animatedHitpoints={10000}
              totalHitpoints={1000000}
            />
          }
          {/* <Suspense fallback={null}>
            <Model />
          </Suspense> */}
          <OrbitControls />
          <OrthographicCamera
            makeDefault
            zoom={100}
            near={1}
            far={20}
            position={[0, 0, 10]}
          />
          {/* <Effects>
              <Glitch />
              <ChromaticAberration
                // @ts-expect-error: Let's ignore a compile error
                offset={[0.005, 0.002]} // color offset
              />

              <Bloom
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                intensity={0.8}
              />
            </Effects> */}
        </Canvas>
       
      </div>

      <div className='mx-auto flex w-full flex-col flex-wrap items-center p-12 md:flex-row  lg:w-4/5'>
        {/* first row */}
        
        <div className='relative my-12 h-48 w-full py-6 sm:w-1/2 md:mb-40'>
         
        </div>

 
      </div>
    </>
  )
}
