import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="font-script text-5xl md:text-7xl text-primary mb-4">
          Marta & Jakub
        </h1>
        <p className="font-serif text-xl text-muted-foreground mb-2">
          08.08.2026
        </p>
        <p className="font-sans text-muted-foreground mb-8">
          Gdańsk, Pomorskie
        </p>
        <Link
          to="/games"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          <Gamepad2 className="w-5 h-5" />
          Gry Weselne / Wedding Games
        </Link>
      </div>
    </div>
  );
};

export default Index;
