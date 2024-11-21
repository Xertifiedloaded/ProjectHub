import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from '@/components/ui/button';
  import { Search, Upload, BarChart2, Book, Users, Trophy } from 'lucide-react';
export default function Header() {
  return (
    <nav className="border-b bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">ProjectHub</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-96">
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="ghost" className="justify-start">
                        <Book className="mr-2 h-4 w-4" />
                        Latest Projects
                      </Button>
                      <Button variant="ghost" className="justify-start">
                        <Trophy className="mr-2 h-4 w-4" />
                        Featured
                      </Button>
                      <Button variant="ghost" className="justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Top Contributors
                      </Button>
                      <Button variant="ghost" className="justify-start">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Trending
                      </Button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
         <a href="/upload">
         <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Project
          </Button>
         </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>My Projects</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </nav>

  )
}
