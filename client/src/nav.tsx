import { Link } from "wouter";
import { Menu, Search, Bell, User } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Nav() {
  return (
    <nav className="bg-background border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <span className="font-bold text-xl">RyuuStream</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/browse" className="text-foreground/80 hover:text-primary transition-colors">
              Browse
            </Link>
            <Link href="/manga" className="text-foreground/80 hover:text-primary transition-colors">
              Manga
            </Link>
            <Link href="/news" className="text-foreground/80 hover:text-primary transition-colors">
              News
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px]"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-foreground/80">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground/80">
            <User className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-4 py-4">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full"
                />
                <nav className="flex flex-col space-y-4">
                  <Link href="/browse" className="text-foreground/80 hover:text-primary transition-colors">
                    Browse
                  </Link>
                  <Link href="/manga" className="text-foreground/80 hover:text-primary transition-colors">
                    Manga
                  </Link>
                  <Link href="/news" className="text-foreground/80 hover:text-primary transition-colors">
                    News
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}