"use client";

import { useState, useEffect } from "react";

export default function StepGuide() {

  const steps = [
    {
      title: "Create stack",
      image: "/1 CLOUDF.png"
    },
    {
      title: "Descarga el archivo YAML y copia el External ID",
      image: "/2 CLOUDF.png"
    },
    {
      title: "Cargar archivo YAML",
      image: "/3 CLOUDF.png"
    },
    {
      title: "Asignar nombre, Pegar External ID entregado anteriormente, Ingresa tu Account ID",
      image: "/4 CLOUDF.png"
    },
    {
        title: "Baja al final y acepta las condiciones",
        image: "/5 CLOUDF.png"
    },
    {
        title: "Revisa el resumen y Submit",
        image: "/6 CLOUDF.png"
    },
    {
      title: "Espera a que el status sea CREATE_COMPLETE",
      image: "/7 CLOUDF.png"
  },
    {
      title: "Espera a que el status sea CREATE_COMPLETE",
      image: "/8 CLOUDF.png"
  },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);

  const next = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % steps.length);
  };

  const prev = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + steps.length) % steps.length);
  };

  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
  
      if (activeIndex === null) return;
  
      if (event.key === "ArrowRight") {
        setActiveIndex((activeIndex + 1) % steps.length);
      }
  
      if (event.key === "ArrowLeft") {
        setActiveIndex((activeIndex - 1 + steps.length) % steps.length);
      }
  
      if (event.key === "Escape") {
        close();
      }
  
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  
  }, [activeIndex]);

  return (

    <div className="bg-white p-10 rounded-3xl border shadow-xl space-y-8">

      <h2 className="text-xl font-semibold">
        Guía paso a paso
      </h2>

      {/* STEPS GRID */}

      <div className="grid md:grid-cols-4 gap-8">

        {steps.map((step, index) => (

          <div
            key={index}
            className="space-y-4 text-center"
          >

            {/* STEP NUMBER */}

            <div className="flex justify-center">

              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">

                {index + 1}

              </div>

            </div>

            {/* IMAGE */}

            <div
              className="relative group cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >

              <img
                src={step.image}
                alt={step.title}
                className="rounded-xl border shadow-sm transition-transform duration-200 group-hover:scale-105"
              />

              {/* HOVER OVERLAY */}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition rounded-xl">

                Click para ampliar

              </div>

            </div>

            {/* TITLE */}

            <p className="text-sm font-semibold">
              {step.title}
            </p>

          </div>

        ))}

      </div>

      {/* LIGHTBOX VIEWER */}

      {activeIndex !== null && (

        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={close}
        >

          <div
            className="relative max-w-6xl w-full px-6"
            onClick={(e) => e.stopPropagation()}
          >

            {/* IMAGE */}

            <img
              src={steps[activeIndex].image}
              alt={steps[activeIndex].title}
              className="w-full rounded-xl shadow-2xl"
            />

            {/* TITLE */}

            <p className="text-center text-white mt-5 text-lg font-medium">

              Paso {activeIndex + 1}: {steps[activeIndex].title}

            </p>

            {/* CLOSE */}

            <button
              onClick={close}
              className="absolute top-4 right-6 text-white text-3xl hover:opacity-70"
            >
              ✕
            </button>

            {/* PREV */}

            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:opacity-70"
            >
              ‹
            </button>

            {/* NEXT */}

            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:opacity-70"
            >
              ›
            </button> 

          </div>

        </div>

      )}

    </div>

  );

}