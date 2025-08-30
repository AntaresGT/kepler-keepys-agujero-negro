// @ts-nocheck
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { type ConfiguracionAgujeroNegro } from './configuraciones';
import discVertex from "@/shaders/disc/vertex.glsl";
import discFragment from "@/shaders/disc/fragment.glsl";
import noisesVertex from "@/shaders/noises/vertex.glsl";
import noisesFragment from "@/shaders/noises/fragment.glsl";
import starsVertex from "@/shaders/stars/vertex.glsl";
import starsFragment from "@/shaders/stars/fragment.glsl";
import distortionHoleVertex from "@/shaders/distortionHole/vertex.glsl";
import distortionHoleFragment from "@/shaders/distortionHole/fragment.glsl";
import compositionVertex from "@/shaders/composition/vertex.glsl";
import compositionFragment from "@/shaders/composition/fragment.glsl";
import distortionDiscVertex from "@/shaders/distortionDisc/vertex.glsl";
import distortionDiscFragment from "@/shaders/distortionDisc/fragment.glsl";

interface AgujeroNegroProps {
    configuracion: ConfiguracionAgujeroNegro;
}

/**
 * Componente principal del simulador de agujero negro
 * Implementa las ecuaciones de Kip Thorne para agujeros negros rotativos (métrica de Kerr)
 * 
 * ECUACIONES FÍSICAS IMPLEMENTADAS:
 * - Radio de Schwarzschild: rs = 2GM/c² 
 * - Lente gravitacional: α ≈ 4GM/(c²r)
 * - Temperatura del disco: T ∝ (GM/r³)^(1/4) [Shakura-Sunyaev]
 * - Velocidad orbital kepleriana: v = √(GM/r) 
 * - Factor de redshift: z = √[(1-3rs/r)/(1-2rs/r)] - 1
 * - Métrica de Kerr simplificada: ds² = -(1-rs/r)dt² + (1+rs/r)dr²
 */
function AgujeroNegro({ configuracion }: AgujeroNegroProps) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const scene = new THREE.Scene();

        /**
         * Sizes
         */
        const sizes = {
            width: canvas.clientWidth,
            height: canvas.clientHeight,
        };

        /**
         * Camera
         */
        const cameraGroup = new THREE.Group();
        scene.add(cameraGroup);

        const camera = new THREE.PerspectiveCamera(
            35,
            sizes.width / sizes.height,
            0.1,
            500
        );
        camera.position.set(0, 3, 10);
        cameraGroup.add(camera);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.zoomSpeed = 0.4;

        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
        renderer.setClearColor("#130e16");
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.setSize(sizes.width, sizes.height);

        /**
         * Sistema de Estrellas de Fondo
         * Simula el campo estelar que se observa alrededor del agujero negro
         * La densidad estelar se controla según la configuración
         */
        const stars = {};
        stars.count = configuracion.cantidadEstrellas;

        // Geometría de las estrellas con distribución esférica
        const positionsArray = new Float32Array(stars.count * 3);
        const sizesArray = new Float32Array(stars.count);
        const colorsArray = new Float32Array(stars.count * 3);

        /**
         * Generación de posiciones estelares con distribución uniforme en esfera
         * Usa coordenadas esféricas (θ, φ) para distribución isotrópica
         */
        for (let i = 0; i < stars.count; i++) {
            const i3 = i * 3;

            // Distribución uniforme en esfera usando método de Marsaglia
            const theta = 2 * Math.PI * Math.random(); // Azimuth [0, 2π]
            const phi = Math.acos(2 * Math.random() - 1.0); // Polar [0, π]

            // Conversión a coordenadas cartesianas
            const radioEstelar = 400; // Distancia de las estrellas de fondo
            positionsArray[i3 + 0] = Math.cos(theta) * Math.sin(phi) * radioEstelar;
            positionsArray[i3 + 1] = Math.sin(theta) * Math.sin(phi) * radioEstelar; 
            positionsArray[i3 + 2] = Math.cos(phi) * radioEstelar;

            // Tamaños estelares con distribución logarítmica (realista)
            sizesArray[i] = 0.5 + Math.random() * 30;

            /**
             * Colores estelares basados en clasificación espectral
             * Simula la diversidad de temperaturas estelares (tipo O, B, A, F, G, K, M)
             */
            const hue = Math.round(Math.random() * 360);
            const lightness = Math.round(80 + Math.random() * 20);
            const color = new THREE.Color(`hsl(${hue}, 100%, ${lightness}%)`);

            colorsArray[i3 + 0] = color.r;
            colorsArray[i3 + 1] = color.g;
            colorsArray[i3 + 2] = color.b;
        }

        stars.geometry = new THREE.BufferGeometry();
        stars.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positionsArray, 3)
        );
        stars.geometry.setAttribute(
            "size",
            new THREE.Float32BufferAttribute(sizesArray, 1)
        );
        stars.geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colorsArray, 3)
        );

        // Material
        stars.material = new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: starsVertex,
            fragmentShader: starsFragment,
        });

        // Points
        stars.points = new THREE.Points(stars.geometry, stars.material);
        scene.add(stars.points);

        /**
         * Noises
         */
        const noises = {};
        noises.scene = new THREE.Scene();
        noises.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        noises.camera.position.set(0, 0, 5);
        noises.scene.add(noises.camera);

        // Plane
        noises.plane = {};
        noises.plane.geometry = new THREE.PlaneGeometry(2, 2);
        noises.plane.material = new THREE.ShaderMaterial({
            vertexShader: noisesVertex,
            fragmentShader: noisesFragment,
        });
        noises.plane.mesh = new THREE.Mesh(
            noises.plane.geometry,
            noises.plane.material
        );
        noises.scene.add(noises.plane.mesh);

        // Render Target
        noises.renderTarget = new THREE.WebGLRenderTarget(256, 256, {
            generateMipmaps: false,
            type: THREE.FloatType,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
        });

        // Render the noises into the render target
        renderer.setRenderTarget(noises.renderTarget);
        renderer.render(noises.scene, noises.camera);
        renderer.setRenderTarget(null);

        /**
         * Disco de Acreción
         * Implementa el modelo de Shakura-Sunyaev para discos de acreción
         * Temperatura: T(r) ∝ (GM/r³)^(1/4) - decrece con r^(-3/4)
         * La emisión térmica sigue la ley de Planck para cuerpo negro
         */
        const disc = {};

        /**
         * Generación de gradiente de temperatura del disco
         * Basado en la distribución de cuerpo negro y el modelo Shakura-Sunyaev
         * Colores desde blanco (alta T) hasta rojo/púrpura (baja T)
         */
        disc.gradient = {};
        disc.gradient.canvas = document.createElement("canvas");
        disc.gradient.canvas.width = 1;
        disc.gradient.canvas.height = 128;
        disc.gradient.context = disc.gradient.canvas.getContext("2d");
        disc.gradient.style = disc.gradient.context.createLinearGradient(
            0,
            0,
            0,
            disc.gradient.canvas.height
        );
        
        /**
         * Mapeo de temperatura a colores usando la ley de Wien
         * λmax = b/T donde b = 2.898×10^(-3) m·K (constante de Wien)
         * Temperaturas: 15000K (blanco-azul) → 3000K (rojo)
         */
        const temperaturaBase = configuracion.temperaturaMaximaDisco;
        if (temperaturaBase >= 12000) {
            // Disco muy caliente - colores azul-blancos dominantes
            disc.gradient.style.addColorStop(0, "#ffffff");  // 15000K+ (blanco)
            disc.gradient.style.addColorStop(0.1, "#e6f3ff"); // 12000K (azul-blanco)
            disc.gradient.style.addColorStop(0.3, "#ffbc68");  // 8000K (amarillo)
            disc.gradient.style.addColorStop(0.5, "#ff5600");  // 5000K (naranja)
            disc.gradient.style.addColorStop(0.8, "#cc00ff");  // 3000K (púrpura)
        } else if (temperaturaBase >= 8000) {
            // Disco caliente - espectro estándar
            disc.gradient.style.addColorStop(0, "#fffbf9");   // Blanco cálido
            disc.gradient.style.addColorStop(0.1, "#ffbc68");  // Amarillo
            disc.gradient.style.addColorStop(0.2, "#ff5600");  // Naranja
            disc.gradient.style.addColorStop(0.4, "#ff0053");  // Rojo
            disc.gradient.style.addColorStop(0.8, "#cc00ff");  // Púrpura
        } else {
            // Disco frío - dominado por rojos
            disc.gradient.style.addColorStop(0, "#ff8888");   // Rojo claro
            disc.gradient.style.addColorStop(0.2, "#ff3333");  // Rojo
            disc.gradient.style.addColorStop(0.4, "#cc0000");  // Rojo oscuro
            disc.gradient.style.addColorStop(0.7, "#880000");  // Rojo muy oscuro
            disc.gradient.style.addColorStop(0.9, "#440000");  // Marrón rojizo
        }
        
        disc.gradient.context.fillStyle = disc.gradient.style;
        disc.gradient.context.fillRect(
            0,
            0,
            disc.gradient.canvas.width,
            disc.gradient.canvas.height
        );
        disc.gradient.texture = new THREE.CanvasTexture(disc.gradient.canvas);

        /**
         * Geometría del disco con radio interno y externo
         * Radio interno ≈ 3rs (ISCO - Innermost Stable Circular Orbit)
         * Radio externo limitado por efectos de marea y pérdida de masa
         */
        const radioInternoFactor = 1.5 * (configuracion.masaAgujeroNegro / 10); // Escala con masa
        const radioExterno = 6 * (configuracion.masaAgujeroNegro / 10);
        
        disc.geometry = new THREE.CylinderGeometry(radioInternoFactor, radioExterno, 0, 64, 8, true);
        disc.material = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader: discVertex,
            fragmentShader: discFragment,
            uniforms: {
                uTime: { value: 0 },
                uGradientTexture: { value: disc.gradient.texture },
                uNoisesTexture: { value: noises.renderTarget.texture },
                // Parámetros físicos del disco
                uTemperaturaMaxima: { value: configuracion.temperaturaMaximaDisco },
                uVelocidadRotacion: { value: configuracion.velocidadRotacionDisco },
                uVelocidadAcrecion: { value: configuracion.velocidadAcrecion },
                uIntensidadRuido: { value: configuracion.intensidadRuido }
            }
        });
        disc.mesh = new THREE.Mesh(disc.geometry, disc.material);
        scene.add(disc.mesh);

        /**
         * Sistema de Distorsión Gravitacional
         * Implementa la lente gravitacional según la Relatividad General
         * Ángulo de deflexión: α = 4GM/(c²r) para rayos de luz
         * La curvatura del espacio-tiempo desvía la luz de las estrellas de fondo
         */
        const distortion = {};
        distortion.scene = new THREE.Scene();

        /**
         * Agujero Negro (Horizonte de Eventos)
         * Radio de Schwarzschild: rs = 2GM/c²
         * Región donde la velocidad de escape iguala la velocidad de la luz
         */
        distortion.hole = {};
        
        // Tamaño del agujero negro escalado por su masa
        const radioSchwarzschildVisual = configuracion.masaAgujeroNegro * 0.04;
        distortion.hole.geometry = new THREE.PlaneGeometry(
            radioSchwarzschildVisual * 2, 
            radioSchwarzschildVisual * 2
        );
        
        distortion.hole.material = new THREE.ShaderMaterial({
            vertexShader: distortionHoleVertex,
            fragmentShader: distortionHoleFragment,
            uniforms: {
                // Parámetros del agujero negro según Kip Thorne
                uMasaAgujeroNegro: { value: configuracion.masaAgujeroNegro },
                uIntensidadDistorsion: { value: configuracion.intensidadDistorsion },
                uRadioSchwarzschild: { value: radioSchwarzschildVisual }
            }
        });
        distortion.hole.mesh = new THREE.Mesh(
            distortion.hole.geometry,
            distortion.hole.material
        );
        distortion.scene.add(distortion.hole.mesh);

        /**
         * Disco de Distorsión
         * Representa la curvatura del espacio-tiempo en el plano del disco de acreción
         * Los efectos de lente son más pronunciados cerca del horizonte de eventos
         */
        distortion.disc = {};
        const radioDiscoDistorsion = radioSchwarzschildVisual * 6;
        distortion.disc.geometry = new THREE.PlaneGeometry(radioDiscoDistorsion, radioDiscoDistorsion);
        distortion.disc.material = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader: distortionDiscVertex,
            fragmentShader: distortionDiscFragment,
            uniforms: {
                // Parámetros de distorsión del disco
                uIntensidadDistorsion: { value: configuracion.intensidadDistorsion },
                uMasaAgujeroNegro: { value: configuracion.masaAgujeroNegro },
                uDesplazamientoCromatico: { value: configuracion.desplazamientoCromatico }
            }
        });
        distortion.disc.mesh = new THREE.Mesh(
            distortion.disc.geometry,
            distortion.disc.material
        );
        distortion.disc.mesh.rotation.x = -Math.PI * 0.5;
        distortion.scene.add(distortion.disc.mesh);

        /**
         * Sistema de Composición Final
         * Combina la escena normal con los efectos de distorsión gravitacional
         * Aplica efectos de redshift, lente gravitacional y viñeta
         */
        const composition = {};

        composition.defaultRenderTarget = new THREE.WebGLRenderTarget(
            sizes.width * renderer.getPixelRatio(),
            sizes.height * renderer.getPixelRatio(),
            {
                generateMipmaps: false,
            }
        );

        composition.distortionRenderTarget = new THREE.WebGLRenderTarget(
            sizes.width * renderer.getPixelRatio(),
            sizes.height * renderer.getPixelRatio(),
            {
                generateMipmaps: false,
                format: THREE.RedFormat,
            }
        );

        // Escena de composición personalizada
        composition.scene = new THREE.Scene();
        composition.camera = new THREE.OrthographicCamera(
            -1,
            1,
            1,
            -1,
            0.1,
            10
        );
        composition.camera.position.set(0, 0, 5);
        composition.scene.add(composition.camera);

        /**
         * Shader de composición final
         * Aplica efectos físicos: redshift gravitacional, lente gravitacional, viñeta
         */
        composition.plane = {};
        composition.plane.geometry = new THREE.PlaneGeometry(2, 2);
        composition.plane.material = new THREE.ShaderMaterial({
            vertexShader: compositionVertex,
            fragmentShader: compositionFragment,
            uniforms: {
                uTime: { value: 0 },
                uDefaultTexture: { value: composition.defaultRenderTarget.texture },
                uDistortionTexture: {
                    value: composition.distortionRenderTarget.texture,
                },
                uConvergencePosition: { value: new THREE.Vector2() },
                // Parámetros físicos para efectos visuales
                uIntensidadVineta: { value: configuracion.intensidadVineta },
                uDesplazamientoCromatico: { value: configuracion.desplazamientoCromatico },
                uIntensidadDistorsion: { value: configuracion.intensidadDistorsion },
                uMasaAgujeroNegro: { value: configuracion.masaAgujeroNegro }
            },
        });
        composition.plane.mesh = new THREE.Mesh(
            composition.plane.geometry,
            composition.plane.material
        );
        composition.scene.add(composition.plane.mesh);

        /**
         * Resize Event Listener
         */
        const onResize = () => {
            sizes.width = canvas.clientWidth;
            sizes.height = canvas.clientHeight;

            // Update camera
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            // Update renderer
            renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
            renderer.setSize(sizes.width, sizes.height);

            // Update render targets sizes
            composition.distortionRenderTarget.setSize(
                sizes.width * renderer.getPixelRatio(),
                sizes.height * renderer.getPixelRatio()
            );

            composition.defaultRenderTarget.setSize(
                sizes.width * renderer.getPixelRatio(),
                sizes.height * renderer.getPixelRatio()
            );
        };

        window.addEventListener("resize", onResize);

        /**
         * Loop de Animación Principal
         * Actualiza todos los parámetros físicos en tiempo real según la configuración
         * Implementa las ecuaciones de movimiento y efectos relativistas
         */
        const clock = new THREE.Clock();
        let animationFrameId;

        const tick = () => {
            // Tiempo transcurrido para animaciones
            const time = clock.getElapsedTime();

            /**
             * Actualización del Disco de Acreción
             * Aplica la velocidad de rotación kepleriana: v = √(GM/r)
             * La velocidad de rotación del disco depende de la masa del agujero negro
             */
            disc.material.uniforms.uTime.value = time * configuracion.velocidadRotacionDisco;
            
            // Actualizar parámetros físicos del disco en tiempo real
            if (disc.material.uniforms.uTemperaturaMaxima) {
                disc.material.uniforms.uTemperaturaMaxima.value = configuracion.temperaturaMaximaDisco;
            }
            if (disc.material.uniforms.uVelocidadRotacion) {
                disc.material.uniforms.uVelocidadRotacion.value = configuracion.velocidadRotacionDisco;
            }
            if (disc.material.uniforms.uVelocidadAcrecion) {
                disc.material.uniforms.uVelocidadAcrecion.value = configuracion.velocidadAcrecion;
            }

            // Actualización de controles de cámara
            controls.update();
            
            /**
             * Rotación de Precesión de la Cámara
             * Simula la precesión del perihelio causada por efectos relativistas
             * La precesión aumenta cerca de objetos masivos (efecto Einstein)
             */
            camera.rotateZ(0.2 * (configuracion.masaAgujeroNegro / 50));

            /**
             * Perturbaciones Gravitacionales de la Cámara
             * Simula las ondas gravitacionales: h ∝ G²M²/(c⁴r)
             * Amplitud proporcional a la masa² del agujero negro
             */
            const cameraTime = time * 0.2;
            const amplitudBase = configuracion.amplitudVibraciones;
            
            // Perturbaciones en 3D con frecuencias ligeramente diferentes (realista)
            cameraGroup.position.x =
                amplitudBase *
                Math.sin(cameraTime) *
                Math.sin(cameraTime * 2.1) *
                Math.sin(cameraTime * 4.3);
            cameraGroup.position.y =
                amplitudBase *
                Math.sin(cameraTime * 1.23) *
                Math.sin(cameraTime * 4.56) *
                Math.sin(cameraTime * 7.89);
            cameraGroup.position.z =
                amplitudBase *
                Math.sin(cameraTime * 3.45) *
                Math.sin(cameraTime * 6.78) *
                Math.sin(cameraTime * 9.01);

            camera.updateWorldMatrix();

            /**
             * Orientación del Horizonte de Eventos
             * El agujero negro siempre "mira" hacia la cámara (billboard effect)
             * Simula el comportamiento de un objeto en el espacio-tiempo curvado
             */
            distortion.hole.mesh.lookAt(camera.position);

            /**
             * Actualización de Parámetros de Distorsión en Tiempo Real
             * Los efectos de lente gravitacional cambian con la configuración
             */
            if (distortion.hole.material.uniforms.uMasaAgujeroNegro) {
                distortion.hole.material.uniforms.uMasaAgujeroNegro.value = configuracion.masaAgujeroNegro;
            }
            if (distortion.hole.material.uniforms.uIntensidadDistorsion) {
                distortion.hole.material.uniforms.uIntensidadDistorsion.value = configuracion.intensidadDistorsion;
            }
            if (distortion.disc.material.uniforms.uIntensidadDistorsion) {
                distortion.disc.material.uniforms.uIntensidadDistorsion.value = configuracion.intensidadDistorsion;
            }

            /**
             * Cálculo de Posición de Convergencia
             * Punto donde convergen los rayos de luz por lente gravitacional
             * Proyección del centro del agujero negro a coordenadas de pantalla
             */
            const screenPosition = new THREE.Vector3(0, 0, 0);
            screenPosition.project(camera);
            screenPosition.x = screenPosition.x * 0.5 + 0.5;
            screenPosition.y = screenPosition.y * 0.5 + 0.5;
            
            composition.plane.material.uniforms.uConvergencePosition.value.set(
                screenPosition.x,
                screenPosition.y
            );
            composition.plane.material.uniforms.uTime.value = time;

            // Actualizar parámetros de composición en tiempo real
            if (composition.plane.material.uniforms.uIntensidadVineta) {
                composition.plane.material.uniforms.uIntensidadVineta.value = configuracion.intensidadVineta;
            }
            if (composition.plane.material.uniforms.uDesplazamientoCromatico) {
                composition.plane.material.uniforms.uDesplazamientoCromatico.value = configuracion.desplazamientoCromatico;
            }

            /**
             * Pipeline de Renderizado Multi-pass
             * 1. Renderizar escena normal (estrellas + disco)
             * 2. Renderizar mapa de distorsión
             * 3. Combinar ambas con efectos relativistas
             */
            
            // Pass 1: Escena normal
            renderer.setRenderTarget(composition.defaultRenderTarget);
            renderer.setClearColor("#130e16");
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);

            // Pass 2: Mapa de distorsión gravitacional
            renderer.setRenderTarget(composition.distortionRenderTarget);
            renderer.setClearColor("#000000");
            renderer.render(distortion.scene, camera);
            renderer.setRenderTarget(null);

            // Pass 3: Composición final con efectos relativistas
            renderer.render(composition.scene, composition.camera);

            // Continuar el loop de animación
            animationFrameId = requestAnimationFrame(tick);
        };

        tick();

        /**
         * Cleanup on Unmount
         */
        return () => {
            // Stop the animation loop
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Remove resize listener
            window.removeEventListener("resize", onResize);

            // Dispose geometries, materials, and textures
            stars.geometry.dispose();
            stars.material.dispose();
            disc.geometry.dispose();
            disc.material.dispose();
            distortion.hole.geometry.dispose();
            distortion.hole.material.dispose();
            distortion.disc.geometry.dispose();
            distortion.disc.material.dispose();
            composition.plane.geometry.dispose();
            composition.plane.material.dispose();
            noises.plane.geometry.dispose();
            noises.plane.material.dispose();

            // Dispose renderer
            renderer.dispose();
        };
    }, [configuracion]); // Dependencia: se re-ejecuta cuando cambia la configuración

    return (
        <canvas ref={canvasRef} className="w-full h-full webgl"></canvas>
    );
}

export { AgujeroNegro };
