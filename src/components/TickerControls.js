"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function ScoreboardControls() {
  const [isVisible, setIsVisible] = useState(true);
  const [apiToken, setApiToken] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [tvId, setTvId] = useState("");
  const [tournamentCode, setTournamentCode] = useState("");
  const [teamLeagueCode, setTeamLeagueCode] = useState("");
  const [refreshRate, setRefreshRate] = useState("30");

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
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
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
          onClick={() => console.log("Start Scoreboard clicked")}
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
