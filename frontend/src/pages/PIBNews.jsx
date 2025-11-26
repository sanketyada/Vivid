import React, { useEffect, useState } from "react";

const PIBNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPIBNews = async () => {
      const rssUrl =
        "https://news.google.com/rss/search?q=Press+Information+Bureau+India";

      try {
        const response = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`
        );
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        const items = [...xml.getElementsByTagName("item")];

        const parsedNews = items.map((item) => ({
          title: item.getElementsByTagName("title")[0]?.textContent,
          link: item.getElementsByTagName("link")[0]?.textContent,
          pubDate: item.getElementsByTagName("pubDate")[0]?.textContent,
        }));

        setNews(parsedNews);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    loadPIBNews();
  }, []);

  if (error)
    return <p className="text-red-500 text-center">Error loading feed.</p>;

  return (
    <div id="pib-news" className="space-y-4">
      {news.length === 0 ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : (
        news.map((item, index) => (
          <div
            className="p-5 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition"
            key={index}
          >
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>

            <p className="text-sm text-gray-500 mt-1">
              <span className="font-bold">Date:</span> {item.pubDate}
            </p>

            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-600 font-medium hover:underline"
            >
              Read Full News →
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default PIBNews;
