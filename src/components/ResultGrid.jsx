import { useDispatch, useSelector } from "react-redux";
import { PhotoFetcher, PexelsVideoFetcher } from "../api/mediaApi";
import { useEffect, useRef, useCallback, useMemo } from "react";
import {
  setActiveTab,
  setLoading,
  setQuery,
  setResults,
  setError,
  clearResults,
} from "../Redux/Features/searchSlice";
import ResultCard from "./ResultCard";

const ResultGrid = () => {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const { query, activeTab, results, loading, error } = useSelector(
    (store) => store.search,
  );

  // Memoize results to prevent unnecessary re-renders
  const memoizedResults = useMemo(() => results, [results]);

  useEffect(
    function () {
      if (!query) return;

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const getData = async () => {
        try {
          dispatch(setLoading());
          let data = [];
          if (activeTab == "photos") {
            let res = await PhotoFetcher(query);
            data = res.results.map((item) => ({
              id: item.id,
              type: "photo",
              url: item.urls.small,
              alt_description: item.alt_description,
              link: item.links.html,
              download: item.links.download,
              slug: item.slug,
              title: item.user.name,
              user_url: item.user.links.html,
              src: item.urls.regular,
            }));
          }
          if (activeTab == "videos") {
            let res = await PexelsVideoFetcher(query);
            data = res.videos.map((item) => ({
              id: item.id,
              type: "video",
              // Get medium quality video for better performance
              url: item.video_files.find(v => v.quality === 'sd')?.link || item.video_files[0].link,
              poster: item.image, // Thumbnail poster image
              alt_description: item.user.name,
              user_url: item.user.url,
            }));
          }
          dispatch(setResults(data));
        } catch (err) {
          if (err.name !== 'AbortError') {
            dispatch(setError(err));
          }
        }
      };

      getData();

      // Cleanup - cancel request on unmount or query change
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    },
    [query, activeTab],
  );

  if (error) return <h1 className="text-center mt-10">Error: {error.message}</h1>;

  return (
    <div className="flex items-center p-10 justify-center w-full h-screen">
        <div 
          className="box-grid w-full h-full border-2 rounded-2xl border-white overflow-auto p-4 grid grid-cols-2 gap-6 auto-rows-[350px]"
          data-lenis-prevent
        >
          {loading === true && (
            <p className="col-span-2 text-center text-gray-400">Loading...</p>
          )}
          {!loading && memoizedResults.length === 0 ? (
            <p className="col-span-2 text-center text-gray-400">Search something to see results</p>
          ) : (
            memoizedResults.map((item) => (
              <ResultCard key={item.id} item={item} idx={item.id} />
            ))
          )}
        </div>
    </div>
  );
};

export default ResultGrid;
