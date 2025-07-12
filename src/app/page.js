"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// Skeleton components
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-stone-300 ${className}`} />
);

const SkeletonServingIndicator = () => (
  <span className="relative flex size-4">
    <span className="size-4 rounded-full bg-stone-300 animate-pulse"></span>
  </span>
);

const SkeletonTeamDisplay = () => (
  <div className="flex items-center justify-center">
    <div className="size-12 rounded-full bg-stone-300 animate-pulse mr-2" />
    <div>
      <SkeletonPulse className="h-3 w-16 mb-1 rounded" />
      <div className="flex mb-1 space-x-2">
        <SkeletonPulse className="h-6 w-20 rounded" />
        <span className="font-black mx-2 text-xl text-stone-300">/</span>
        <SkeletonPulse className="h-6 w-20 rounded" />
      </div>
    </div>
  </div>
);

const SkeletonTeamRow = ({ showServing = false }) => (
  <div className="flex flex-1 py-2 px-4 items-center justify-between">
    <SkeletonTeamDisplay />
    {showServing && <SkeletonServingIndicator />}
  </div>
);

const SkeletonScoreboard = () => (
  <div className="p-18 rounded flex flex-col">
    {/* Main Ticker Bar */}
    <div className="relative h-40 w-180 rounded-r-lg flex items-center justify-between">
      <div className="bg-stone-100 h-full aspect-square flex items-center justify-center">
        <Image
          className="w-full h-auto p-2"
          src="/NPL_LOGO.png"
          width={136}
          height={86}
          alt="National Pickelball League logo"
        />
      </div>

      <div className="text-stone-100 bg-stone-800 flex-1 flex flex-col h-full divide-y divide-stone-600">
        <SkeletonTeamRow showServing={true} />
        <SkeletonTeamRow />
      </div>

      <div className="h-full w-50 bg-stone-100 rounded-r-lg overflow-hidden">
        <div className="h-full bg-stone-600 grid grid-cols-3 gap-0.25 rounded-r-xl">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-stone-100"
            >
              <SkeletonPulse className="h-8 w-8 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Powered By Bar */}
    <div className="h-8 w-130 italic flex items-center justify-between rounded-b-lg bg-stone-900 px-4">
      <span className="bg-gradient-to-r from-[#f38ab8] to-[#56a7db] bg-clip-text text-transparent">
        Powered by RelentNet™
      </span>
      <SkeletonPulse className="h-5 w-12 rounded" />
    </div>
  </div>
);

// Reusable serving indicator component
const ServingIndicator = () => (
  <span className="relative flex size-4">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex size-4 rounded-full bg-emerald-500"></span>
  </span>
);

// Reusable team display component
const TeamDisplay = ({ team }) => (
  <div className="flex items-center justify-center">
    <div className="size-12 rounded-full bg-stone-500 flex items-center justify-center mr-2">
      tL
    </div>
    <div>
      <span className="font-serif text-xs">{team.players[0]}</span>
      <div className="flex mb-1">
        {team.players.map((player, index) => (
          <div key={index} className="font-bold uppercase text-xl">
            {player}
            {index === 0 && <span className="font-black mx-2 text-xl">/</span>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Reusable team row component
const TeamRow = ({ team, isServing }) => (
  <div className="flex flex-1 py-2 px-4 items-center justify-between">
    <TeamDisplay team={team} />
    {isServing && <ServingIndicator />}
  </div>
);

export default function Home() {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);

  const fetchScoreboardData = useCallback(async () => {
    if (!config) return;

    setError(null);

    try {
      const params = new URLSearchParams({
        apiToken: config.apiToken,
        environment: config.environment,
        tvId: config.tvId,
      });

      if (config.tournamentCode) {
        params.append("tournamentCode", config.tournamentCode);
      } else if (config.teamLeagueCode) {
        params.append("teamLeagueCode", config.teamLeagueCode);
      }

      const response = await fetch(`/api/scoreboard?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch scoreboard data");
      }

      const data = await response.json();

      if (data.processedData) {
        setMatchData(data.processedData);
        setLoading(false);
      } else {
        throw new Error("No match data available");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching scoreboard data:", err);
    }
  }, [config]);

  // Listen for configuration updates from controls
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "scoreboardConfig" && e.newValue) {
        const newConfig = JSON.parse(e.newValue);
        setConfig(newConfig);
      }
    };

    // Check for existing config
    const existingConfig = localStorage.getItem("scoreboardConfig");
    if (existingConfig) {
      setConfig(JSON.parse(existingConfig));
    } else {
      // No config found, we're in initial loading state
      setLoading(true);
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Setup polling when config changes
  useEffect(() => {
    if (config && config.refreshRate) {
      // Clear existing interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }

      // Fetch immediately
      fetchScoreboardData();

      // Setup new interval
      const newInterval = setInterval(
        fetchScoreboardData,
        config.refreshRate * 1000
      );
      setRefreshInterval(newInterval);

      return () => {
        if (newInterval) {
          clearInterval(newInterval);
        }
      };
    }
  }, [config, fetchScoreboardData]);

  // Handle double-click to show config
  const handleDoubleClick = () => {
    window.open(
      "/controls",
      "_blank",
      "width=450,height=700,toolbar=no,location=no,menubar=no"
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-900/20 text-red-200 p-4 rounded-lg">
          <p className="font-bold">Error: {error}</p>
          <p className="text-sm mt-2">
            Please check your configuration in the controls panel.
          </p>
        </div>
      </div>
    );
  }

  // Show skeleton while loading or if no data
  if (loading || !matchData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center flex-col"
        onDoubleClick={handleDoubleClick}
      >
        <SkeletonScoreboard />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center flex-col"
      onDoubleClick={handleDoubleClick}
    >
      <div className="p-18 rounded-lg flex flex-col">
        {/* Main Ticker Bar */}
        <div className="relative h-40 w-180 rounded-r-lg rounded-tl-lg flex items-center justify-between overflow-hidden">
          <div className="bg-stone-100 h-full aspect-square flex items-center justify-center">
            <Image
              className="w-full h-auto p-2"
              src="/NPL_LOGO.png"
              width={136}
              height={86}
              alt="National Pickelball League logo"
            />
          </div>

          <div className="text-stone-100 bg-stone-800 flex-1 flex flex-col h-full divide-y divide-stone-600">
            <TeamRow
              team={matchData.homeTeam}
              isServing={matchData.homeTeam.serving}
            />
            <TeamRow
              team={matchData.awayTeam}
              isServing={matchData.awayTeam.serving}
            />
          </div>

          <div className="h-full w-50 bg-stone-100 rounded-r-lg overflow-hidden">
            <div className="h-full bg-stone-600 grid grid-cols-3 gap-0.25 rounded-r-xl">
              {[...matchData.homeTeam.score, ...matchData.awayTeam.score].map(
                (score, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center bg-stone-100 font-black text-3xl"
                  >
                    {score}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Powered By Bar */}
        <div className="h-8 w-130 italic flex items-center justify-between rounded-b-lg bg-stone-900 px-4">
          <span className="bg-gradient-to-r from-[#f38ab8] to-[#56a7db] bg-clip-text text-transparent">
            Powered by RelentNet™
          </span>
          <div className="text-stone-100 font-black">{matchData.court}</div>
        </div>
      </div>
    </div>
  );
}
