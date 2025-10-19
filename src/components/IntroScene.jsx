import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import cloudImg from "../assets/scene 1/cloud.png";
import cityImg from "../assets/scene 1/city.png";
import carImg from "../assets/scene 1/car.png";
import glassImg from "../assets/scene 1/glass.png";
import ufoImg from "../assets/scene 1/ufo.png";

gsap.registerPlugin(ScrollToPlugin);

const IntroScene = () => {
  const cloudRef = useRef(null);
  const carRef = useRef(null);
  const glassRef = useRef(null);
  const ufoRef = useRef(null);

  useGSAP(() => {
    // Cloud animation
    gsap.to(cloudRef.current, {
      scale: 1.5,
      rotate: 0,
      duration: 10,
      ease: "expo.outIn",
    });

    // Car animation
    const carTl = gsap.timeline();
    carTl.set(carRef.current, {
      x: "-8%",
      scale: 0.1,
      top: "18%",
      position: "absolute",
    });
    carTl
      .to(carRef.current, {
        x: "-2%",
        scale: 0.2,
        top: "16%",
        rotation: 5,
        duration: 1.1,
      })
      .to(carRef.current, {
        x: "-20%",
        scale: 0.4,
        top: "14%",
        rotation: -5,
        duration: 1,
      })
      .to(
        carRef.current,
        {
          x: "-6%",
          scale: 1.1,
          top: "0%",
          rotation: 5,
          duration: 0.8,
        },
        "-=0.3"
      );

    // UFO animation
    const ufoTl = gsap.timeline();
    ufoTl.set(ufoRef.current, {
      x: 200,
      y: -400,
      scale: 0.05,
      position: "absolute",
    });
    ufoTl
      .to(ufoRef.current, {
        x: 180,
        y: -300,
        scale: 0.1,
        duration: 1,
        rotation: 15,
        ease: "power2.out",
      })
      .to(ufoRef.current, {
        x: 220,
        y: -250,
        scale: 0.15,
        duration: 0.7,
        rotation: -15,
        ease: "power2.out",
      })
      .to(ufoRef.current, {
        y: -200,
        scale: 0.2,
        duration: 0.7,
        rotation: 15,
        ease: "power2.out",
      });

    // Scroll downward (to next 100vh) after 5 seconds
    setTimeout(() => {
      gsap.to(window, {
        scrollTo: { y: window.innerHeight },
        duration: 1.5,
        ease: "power2.inOut",
      });
    }, 5000);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      {/* Cloud background */}
      <img
        ref={cloudRef}
        src={cloudImg}
        alt="Cloud Background"
        className="w-full h-full object-bottom absolute top-0 left-0 z-0"
      />

      {/* City foreground */}
      <img
        src={cityImg}
        alt="City Layer"
        className="w-full h-full object-bottom absolute top-0 left-0 z-10"
      />

      {/* Car */}
      <img
        ref={carRef}
        src={carImg}
        alt="Mr. Bean's Car"
        className="w-64 z-20"
      />

      {/* Glass (fade in) */}
      <img
        ref={glassRef}
        src={glassImg}
        alt="Glass Effect"
        className="w-full h-full object-cover absolute top-0 left-0 z-30 opacity-0"
      />

      {/* UFO */}
      <img
        ref={ufoRef}
        src={ufoImg}
        alt="UFO"
        className="absolute top-0 left-10 z-15"
      />
    </div>
  );
};

export default IntroScene;
