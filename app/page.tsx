'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import quotesData from '@/data/quotes.json';

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState<{
    text: string;
    author: string;
  }>({ text: '', author: 'Anonymous' });
  const [customAuthor, setCustomAuthor] = useState('Anonymous');
  const [customeQuote, setCustomQuote] = useState('');
  const [likes, setLikes] = useState(5);
  const [dislikes, setDislikes] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    generateQuote();
    updateDateTime();
    // Update the date/time every minute
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  };

  const generateQuote = () => {
    setIsGenerating(true);
    const randomIndex = Math.floor(Math.random() * quotesData.quotes.length);
    const newQuote = quotesData.quotes[randomIndex];
    setCurrentQuote(newQuote);
    setCustomAuthor(newQuote.author);
    setCustomQuote(newQuote.text);
    setLikes(Math.floor(Math.random() * 10) + 1);
    setDislikes(Math.floor(Math.random() * 3));
    setTimeout(() => setIsGenerating(false), 500);
  };

  const downloadImage = async () => {
    if (!quoteRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(quoteRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'motivational-quote.png';
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800">
      <div className="w-full max-w-3xl space-y-8 my-auto">
        <h1 className="text-4xl md:text-6xl font-black text-center tracking-tight text-white">
          QUOTE<span className="text-yellow-400">GENERATOR</span>
        </h1>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-lg text-white">
                Author Name
              </label>
              <Input
                type="text"
                value={customAuthor}
                onChange={(e) => setCustomAuthor(e.target.value)}
                className="border-2 border-white/30 bg-white/20 text-white"
                placeholder="Enter author name"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-lg text-white">Quote</label>
              <textarea
                value={customeQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                className="border-2 border-white/30 bg-white/20 text-white w-full p-2 rounded-md"
                placeholder="Enter your quote here"
              ></textarea>
            </div>
          </div>
        </div>

        <div
          ref={quoteRef}
          className="relative overflow-hidden border-2 border-blue-400 shadow-xl"
        >
          <div className="bg-[#00008B] p-6 md:p-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-600"></div>
                  <div className="absolute inset-0 top-1/2 bg-white"></div>
                </div>
                <span className="text-white font-bold">{customAuthor}</span>
              </div>
              <span className="text-white text-sm">{currentDate}</span>
            </div>

            <p className="text-xl md:text-2xl text-white font-medium mb-6">
              {customeQuote}
            </p>

            <div className="flex items-center space-x-6 text-white">
              <div className="flex items-center">
                <ThumbsUp className="h-5 w-5 mr-1.5 fill-white" />
                <span className="text-base">{likes}</span>
              </div>
              <div className="flex items-center">
                <ThumbsDown className="h-5 w-5 mr-1.5 fill-white" />
                <span className="text-base">{dislikes}</span>
              </div>
              <div>
                <span className="text-base">Reply</span>
              </div>
              <div>
                <span className="text-base">Report</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={generateQuote}
            disabled={isGenerating}
            className="bg-yellow-500 hover:bg-yellow-600 text-black border-2 border-yellow-600 rounded-md px-6 py-5 text-lg font-bold transition-all"
          >
            <RefreshCw
              className={`mr-2 h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`}
            />
            Generate Quote
          </Button>

          <Button
            onClick={downloadImage}
            className="bg-white hover:bg-gray-100 text-black border-2 border-white rounded-md px-6 py-5 text-lg font-bold transition-all"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Image
          </Button>
        </div>
      </div>

      <footer className="w-full text-center py-4 mt-8">
        <a
          href="https://github.com/arifintajul4"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-yellow-300 transition-colors inline-flex items-center"
        >
          Created with <span className="text-red-500 mx-1">❤️</span> by Tajul
          Arifin S
        </a>
      </footer>
    </main>
  );
}
