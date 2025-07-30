'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { NewsArticle } from '@/types';
import { Newspaper } from 'lucide-react';

interface NewsFeedProps {
  news: NewsArticle[];
  assetNews: NewsArticle[];
}

const NewsListItem = ({ article }: { article: NewsArticle }) => (
  <a href={article.url} target="_blank" rel="noopener noreferrer" className="block p-3 hover:bg-muted/50 rounded-lg transition-colors">
    <p className="font-semibold text-sm mb-1">{article.headline}</p>
    <div className="flex items-center text-xs text-muted-foreground">
      <span>{article.source}</span>
      <span className="mx-2">&bull;</span>
      <span>{article.timestamp}</span>
    </div>
    {article.summary && <p className="text-xs text-muted-foreground mt-1">{article.summary}</p>}
  </a>
);

export default function NewsFeed({ news, assetNews }: NewsFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Newspaper className="text-accent"/>
            News Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="asset">Asset Specific</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-80 mt-4">
            <TabsContent value="market">
              <div className="space-y-2">
                {news.map(article => <NewsListItem key={article.id} article={article} />)}
              </div>
            </TabsContent>
            <TabsContent value="asset">
              <div className="space-y-2">
                {assetNews.length > 0 ? (
                    assetNews.map(article => <NewsListItem key={article.id} article={article} />)
                ) : (
                    <p className="text-muted-foreground text-sm p-4 text-center">No recent news for this asset.</p>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
