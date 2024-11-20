import React, { useState } from 'react';
import { Search, Upload, Download, Tag, User, ChevronDown, BarChart2, Book, Users, Trophy } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCardProps } from '@/type/card';

export const FeaturedProjectCard = ({ project }: ProjectCardProps) => (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 right-2">
          Featured
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={project.authorAvatar} />
            <AvatarFallback>{project.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{project.author}</span>
        </div>
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <span className="text-sm text-gray-500">{project.downloads} downloads</span>
          <span className="text-sm text-gray-500">{project.likes} likes</span>
        </div>
        <Button>View Project</Button>
      </CardFooter>
    </Card>
  );