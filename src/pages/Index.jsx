import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function fetchTopStories() {
  return fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then((res) => res.json());
}

function fetchStory(id) {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => res.json());
}

function Index() {
  const [search, setSearch] = useState("");
  const { data: storyIds, isLoading: isLoadingIds } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const { data: stories, isLoading: isLoadingStories } = useQuery({
    queryKey: ["stories", storyIds],
    queryFn: () => Promise.all(storyIds.slice(0, 100).map(fetchStory)),
    enabled: !!storyIds,
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Input
        type="text"
        placeholder="Search stories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      {isLoadingIds || isLoadingStories ? (
        <Skeleton className="w-full h-10 mb-4" count={10} />
      ) : (
        filteredStories?.map((story) => (
          <Card key={story.id} className="mb-4">
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{story.score} upvotes</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </CardContent>
          </Card>
        ))
      )}
    </main>
  );
}

export default Index;
