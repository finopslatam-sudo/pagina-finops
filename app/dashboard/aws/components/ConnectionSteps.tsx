'use client';

import { RefObject } from "react";

interface Props {
  stepsRef: RefObject<HTMLDivElement | null>;
}

export default function ConnectionSteps({ stepsRef }: Props) {
  return (
    <div
      ref={stepsRef}
      className="bg-white p-8 rounded-3xl border shadow-xl space-y-6"
    >
      <h2 className="text-xl font-semibold">Pasos para conectar tu cuenta AWS</h2>
      <ol className="space-y-4 text-gray-600 list-decimal ml-6">
        <li>Genera el stack de CloudFormation con nuevo EXTERNAL ID.</li>
        <li>Descargar el archivo YAML.</li>
        <li>Has click en el hipervinculo "Open AWS CloudFormation".</li>
        <li>
          Copia el contenido numeral de "External ID" lo necesitaras mas adelante.
        </li>
        <li>Luego sigue los pasos de las imagenes.</li>
      </ol>
    </div>
  );
}
