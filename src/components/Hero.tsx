import hero from '../assets/hero.png';

export default function Hero() {
    return (
        <div className="w-screen h-[600px] overflow-hidden">
            <img
                src={hero}
                className="w-full h-full object-cover"
                alt="Imagen principal"
            />
        </div>
    );
}
