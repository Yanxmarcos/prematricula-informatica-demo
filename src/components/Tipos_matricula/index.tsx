import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Tipos_matricula = () => {
	// Ordenar por el campo 'order' si existe
	const sortedFeatures = [...featuresData].sort((a, b) => (a.order || 0) - (b.order || 0));

	return (
		<>
			<section id="tipos_matricula" className="py-10 mb-36 md:py-10 lg:py-10">
				<div className="container">
					<SectionTitle
						title="Tipos de Matrícula"
						paragraph="Conoce los diferentes tipos de matrícula según el rendimiento académico y créditos."
						center
					/>

					<div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
						{sortedFeatures.map((feature) => (
							<SingleFeature key={feature.id} feature={feature} />
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Tipos_matricula;