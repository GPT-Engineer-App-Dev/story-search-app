import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchTopStories();
  }, []);

  const fetchTopStories = async () => {
    try {
      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = await response.json();
      const top20Ids = storyIds.slice(0, 20);
      const storyPromises = top20Ids.map(id =>
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

  const handleGuess = () => {
    const currentStory = stories[currentStoryIndex];
    const actualScore = currentStory.score;
    const guessNumber = parseInt(guess);
    
    let pointsEarned = 0;
    const difference = Math.abs(guessNumber - actualScore);
    
    if (difference === 0) {
      pointsEarned = 100;
    } else if (difference <= 10) {
      pointsEarned = 50;
    } else if (difference <= 50) {
      pointsEarned = 25;
    } else if (difference <= 100) {
      pointsEarned = 10;
    }

    setScore(score + pointsEarned);
    setShowResult(true);
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setGuess('');
      setShowResult(false);
    } else {
      alert(`Game Over! Your final score is ${score}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex items-center justify-center">
        <Skeleton className="h-12 w-64 bg-gray-700" />
      </div>
    );
  }

  const currentStory = stories[currentStoryIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Hacker News Upvote Guesser
        </h1>
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-300">{currentStory.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">Guess the number of upvotes for this story:</p>
            <Input
              type="number"
              placeholder="Enter your guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mb-4"
            />
            <Button
              onClick={handleGuess}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              disabled={showResult}
            >
              Submit Guess
            </Button>
          </CardContent>
          {showResult && (
            <CardFooter className="flex flex-col items-center">
              <p className="text-lg font-semibold mb-2">Actual upvotes: {currentStory.score}</p>
              <p className="text-md mb-4">Your guess: {guess}</p>
              <Button onClick={nextStory} className="bg-green-500 hover:bg-green-600">Next Story</Button>
            </CardFooter>
          )}
        </Card>
        <div className="text-center">
          <p className="text-xl font-bold mb-2">Your Score: {score}</p>
          <Progress value={(currentStoryIndex + 1) / stories.length * 100} className="w-full" />
          <p className="mt-2">Story {currentStoryIndex + 1} of {stories.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;