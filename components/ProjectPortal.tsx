'use client'
import React, { useState } from 'react';
import { Search, BarChart2, Book, Users, Trophy } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturedProjectCard } from '@/components/FeatureCard';
import { StatCard } from './StatCard';
import Header from './layout/Header';
import Footer from './layout/Footer';







const ProjectPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const stats = [
    {
      title: "Total Projects",
      value: "2,543",
      icon: <Book className="h-4 w-4 text-muted-foreground" />,
      description: "+20% from last month"
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Active this week"
    },
    {
      title: "Downloads",
      value: "12.5K",
      icon: <BarChart2 className="h-4 w-4 text-muted-foreground" />,
      description: "Total downloads"
    },
    {
      title: "Top Contributors",
      value: "156",
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
      description: "This semester"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Student Projects</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore thousands of student projects, get inspired, and share your own work
            with the academic community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="ai-ml">AI/ML</SelectItem>
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="mobile">Mobile Apps</SelectItem>
              <SelectItem value="database">Database</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="featured" className="mb-8">
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
          <TabsContent value="featured" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FeaturedProjectCard
                project={{
                  id: "1",
                  title: "AI-Powered Study Assistant",
                  description: "An intelligent study companion using NLP to help students learn more effectively.",
                  author: "Sarah Johnson",
                  authorAvatar: "/placeholder-avatar.jpg",
                  year: 2024,
                  tags: ["AI", "ML", "Education"],
                  downloadUrl: "/projects/1",
                  category: "AI/ML",
                  downloads: 1234,
                  likes: 456,
                  thumbnail: "/api/placeholder/600/400"
                }}
              />
              <FeaturedProjectCard
                project={{
                  id: "2",
                  title: "Sustainable Smart Campus",
                  description: "IoT-based solution for monitoring and optimizing campus energy usage.",
                  author: "Michael Chen",
                  authorAvatar: "/placeholder-avatar.jpg",
                  year: 2024,
                  tags: ["IoT", "Sustainability"],
                  downloadUrl: "/projects/2",
                  category: "IoT",
                  downloads: 892,
                  likes: 345,
                  thumbnail: "/api/placeholder/600/400"
                }}
              />
            </div>
          </TabsContent>

        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectPortal;