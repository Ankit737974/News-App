import React, { useEffect, useState } from "react";
import NewsItems from "../Components/NewsItems";
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  let [articles, setarticles] = useState([]);
  let [totalresults, settotalresults] = useState(0);

  let [q, setq] = useState("All");
  let [language, setlanguage] = useState("hi");
  let [searchParams] = useSearchParams();
  let [page, setPage] = useState();

  async function getAPIData(q, language) {
    let response = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&language=${language}&page=1&pageSize=24&sortBy=publishedAt&apiKey=c612ac6d7c1542f793cceb9a15492576`
    );
    response = await response.json();
    if (response.status === "ok") {
      setarticles(response.articles);
      settotalresults(response.totalresults);
    }
  }
  async function fetchMoreData() {
    setPage(page + 1);
    let response = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&language=${language}&page=${page}&pageSize=24&sortBy=publishedAt&apiKey=c612ac6d7c1542f793cceb9a15492576`
    );
    response = await response.json();
    if (response.status === "ok") {
      setarticles(articles.concat(response.articles));
    }
  }

  useEffect(() => {
    let q = searchParams.get("q") ?? "All";
    let language = searchParams.get("language") ?? "hi";
    setq(q);
    setlanguage(language);
    getAPIData(q, language);
  }, [searchParams]);

  return (
    <div className="container-fluid my-3 ">
      <h5 className="bg-secondary text-light text-center p-2 text-capitalize">
        {q} News Articles
      </h5>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={true}
        loader={
          <div className="my-5 text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <div className="row">
          {articles.map((items, index) => {
            return (
              <NewsItems
                key={index}
                title={items.title}
                description={items.description}
                img={
                  items.urlToImage ? items.urlToImage : "/images/noimages.webp"
                }
                url={items.url}
                source={items.source.name}
                date={items.publishedAt}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
