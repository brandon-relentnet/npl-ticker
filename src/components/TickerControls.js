"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function ScoreboardControls() {
  const [isVisible, setIsVisible] = useState(true);
  const [apiToken, setApiToken] = useState("6ae80b8a-303a-11f0-9dd5-0e3258621993");
  const [environment, setEnvironment] = useState("https://api.pickleballdev.net");
  const [tvId, setTvId] = useState("A");
  const [tournamentCode, setTournamentCode] = useState("");
  const [teamLeagueCode, setTeamLeagueCode] = useState("TLd176f2");
  const [refreshRate, setRefreshRate] = useState("5");

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('scoreboardConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setApiToken(config.apiToken || "6ae80b8a-303a-11f0-9dd5-0e3258621993");
      setEnvironment(config.environment || "https://api.pickleballdev.net");
      setTvId(config.tvId || "A");
      setTournamentCode(config.tournamentCode || "");
      setTeamLeagueCode(config.teamLeagueCode || "");
      setRefreshRate(config.refreshRate || "5");
    }
  }, []);

  const handleStartScoreboard = () => {
    if (!tvId) {
      alert('Please enter TV ID');
      return;
    }

    if (!tournamentCode && !teamLeagueCode) {
      alert('Please enter either Tournament Code or Team League Code');
      return;
    }

    const config = {
      apiToken,
      environment,
      tvId,
      tournamentCode,
      teamLeagueCode,
      refreshRate: parseInt(refreshRate)
    };

    // Save to localStorage and trigger storage event
    localStorage.setItem('scoreboardConfig', JSON.stringify(config));
    window.dispatchEvent(new Event('storage'));

    // Hide config panel
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-stone-900 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Show Config
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-stone-900 rounded-xl shadow-2xl p-6 text-stone-100">
      <h2 className="text-xl font-bold mb-6">Scoreboard Configuration</h2>

      <div className="space-y-4">
        {/* API Token */}
        <div>
          <label className="block text-sm font-medium mb-1">API Token:</label>
          <input
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Enter PB-API-TOKEN"
            className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-emerald-500 placeholder-stone-500"
          />
        </div>

        {/* Environment */}
        <div>
          <label className="block text-sm font-medium mb-1">Environment:</label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
          >
            <option value="https://api.pickleball.com">Production</option>
            <option value="https://api.pickleballdev.net">Development</option>
          </select>
        </div>

        {/* TV ID */}
        <div>
          <label className="block text-sm font-medium mb-1">TV ID:</label>
          <input
            type="text"
            value={tvId}
            onChange={(e) => setTvId(e.target.value)}
            placeholder="AZ"
            className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-emerald-500 placeholder-stone-500"
          />
        </div>

        {/* Tournament Code */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tournament Code (optional):
          </label>
          <input
            type="text"
            value={tournamentCode}
            onChange={(e) => setTournamentCode(e.target.value)}
            placeholder="e.g., PB1689"
            className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-emerald-500 placeholder-stone-500"
          />
        </div>

        {/* Team League Code */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Team League Code (optional):
          </label>
          <input
            type="text"
            value={teamLeagueCode}
            onChange={(e) => setTeamLeagueCode(e.target.value)}
            placeholder="NPL2025"
            className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-emerald-500 placeholder-stone-500"
          />
        </div>

        {/* Refresh Rate */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Refresh Rate (seconds):
          </label>
          <div className="relative">
            <input
              type="text"
              value={refreshRate}
              onChange={(e) => setRefreshRate(e.target.value)}
              placeholder="30"
              className="w-full px-3 py-2 pr-10 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-emerald-500 placeholder-stone-500"
            />
            <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-500" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleStartScoreboard}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-stone-900 font-bold py-3 rounded-lg transition-colors"
        >
          Start Scoreboard
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-stone-900 font-bold py-3 rounded-lg transition-colors"
        >
          Hide Config
        </button>
      </div>
    </div>
  );
}
