import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">VETRA</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Explore
          </Link>
          <Link to="/publish" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Publish
          </Link>
          <Link to="/profile" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button size="sm" className="glow" asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
