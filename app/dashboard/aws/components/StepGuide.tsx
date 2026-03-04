export default function StepGuide() {

    const steps = [
      {
        title: "Descargar Template",
        image: "/aws_steps/step1.png"
      },
      {
        title: "Abrir CloudFormation",
        image: "/aws_steps/step2.png"
      },
      {
        title: "Subir YAML",
        image: "/aws_steps/step3.png"
      },
      {
        title: "Deploy Stack",
        image: "/aws_steps/step4.png"
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