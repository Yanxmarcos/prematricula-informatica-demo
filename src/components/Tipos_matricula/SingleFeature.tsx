import { Feature } from "@/types/feature";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { title, category, paragraph, details } = feature;
  
  return (
    <div className="w-full">
      <div className="wow fadeInUp rounded-lg bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800" data-wow-delay=".15s">
  
        {/* Badge de categoría */}
        <span className="mb-3 inline-block bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {category}
        </span>
        
        <h3 className="mb-3 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
          {title}
        </h3>
        
        <p className="text-body-color mb-4 pr-[10px] text-base leading-relaxed font-medium">
          {paragraph}
        </p>
        
        {/* Información adicional del detalle */}
        {details && (
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            {details.type && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tipo:
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {details.type}
                </span>
              </div>
            )}
            
            {details.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {details.description}
              </p>
            )}
            
            {details.condition && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Condición:
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {details.condition}
                </p>
              </div>
            )}
            
            {details.cases && details.cases.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Casos aplicables:
                </span>
                <ul className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {details.cases.map((caseItem, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {caseItem}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {details.requirements && details.requirements.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Requisitos:
                </span>
                <ul className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {details.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {details.features && details.features.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Características:
                </span>
                <ul className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500">✦</span>
                      {feature.replace('✅ ', '')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {details.summer && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Periodo Verano:
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {details.summer}
                </p>
              </div>
            )}
            
            {details.regular && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Límites:
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {details.regular}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleFeature;