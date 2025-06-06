import hero from '../assets/hero.jpg';

export default function Hero() {
    return (
        <div className="w-full max-h-[600px] overflow-hidden">
            <img
                src={hero}
                className="w-full h-full object-cover"
                alt="Imagen principal"
            />
        </div>
    );
}
