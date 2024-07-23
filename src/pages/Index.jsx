import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTopStories();
  }, []);

  const fetchTopStories = async () => {
    try {
      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = await response.json();
      const top100Ids = storyIds.slice(0, 100);
      const storyPromises = top100Ids.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
      );
      const fetchedStories = await Promise.all(storyPromises);
      setStories(fetchedStories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Top 100 Hacker News Stories
        </h1>
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-2/3 bg-gray-700" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-24 bg-gray-700" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map(story => (
              <Card key={story.id} className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-purple-300">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">Upvotes: {story.score}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => window.open(story.url, '_blank')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;