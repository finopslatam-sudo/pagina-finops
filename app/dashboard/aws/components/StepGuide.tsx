export default function StepGuide() {

    const steps = [
      {
        title: "Descargar Template",
        image: "/1 CLOUDF.png"
      },
      {
        title: "Abrir CloudFormation",
        image: "/2 CLOUDF.png"
      },
      {
        title: "Subir YAML",
        image: "/3 CLOUDF.png"
      },
      {
        title: "Deploy Stack",
        image: "/4 CLOUDF.png"
      }
    ];
  
    return (
  
      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
  
        <h2 className="text-xl font-semibold">
          Guía paso a paso
        </h2>
  
        <div className="grid md:grid-cols-4 gap-6">
  
          {steps.map((step, index) => (
  
            <div key={index} className="text-center space-y-3">
  
              <img
                src={step.image}
                className="rounded-lg border"
              />
  
              <p className="text-sm font-semibold">
                {step.title}
              </p>
  
            </div>
  
          ))}
  
        </div>
  
      </div>
  
    );
  
  }