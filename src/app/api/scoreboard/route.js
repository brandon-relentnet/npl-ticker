import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const apiToken = searchParams.get("apiToken") || process.env.PB_API_TOKEN;
  const environment =
    searchParams.get("environment") || "https://api.pickleballdev.net";
  const tvId = searchParams.get("tvId");
  const tournamentCode = searchParams.get("tournamentCode");
  const teamLeagueCode = searchParams.get("teamLeagueCode");

  if (!apiToken) {
    return NextResponse.json(
      { error: "API token is required" },
      { status: 400 }
    );
  }

  if (!tvId) {
    return NextResponse.json({ error: "TV ID is required" }, { status: 400 });
  }

  if (!tournamentCode && !teamLeagueCode) {
    return NextResponse.json(
      { error: "Either Tournament Code or Team League Code is required" },
      { status: 400 }
    );
  }

  try {
    let url = `${environment}/v1/matches_data/scorebug?tv_id=${tvId}`;

    if (tournamentCode) {
      url += `&tournament_code=${tournamentCode}`;
    } else if (teamLeagueCode) {
      url += `&team_league_code=${teamLeagueCode}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "PB-API-TOKEN": apiToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Games data:", data.result.Games);

    // Process the data into the expected format
    if (data.result && data.result.Data) {
      const match = data.result.Data;
      const games = data.result.Games || [];

      // Get player last names for display
      const t1p1LastName = match.T1_P1_LastName || "";
      const t1p2LastName = match.T1_P2_LastName || "";
      const t2p1LastName = match.T2_P1_LastName || "";
      const t2p2LastName = match.T2_P2_LastName || "";

      // Build players arrays (using last names in uppercase)
      const team1Players = t1p2LastName
        ? [t1p1LastName.toUpperCase(), t1p2LastName.toUpperCase()]
        : [t1p1LastName.toUpperCase()];

      const team2Players = t2p2LastName
        ? [t2p1LastName.toUpperCase(), t2p2LastName.toUpperCase()]
        : [t2p1LastName.toUpperCase()];

      // Extract individual game scores for each team
      const team1GameScores = [];
      const team2GameScores = [];

      // Map each game's scores
      games.forEach((game) => {
        team1GameScores.push(game.T1_Score || 0);
        team2GameScores.push(game.T2_Score || 0);
      });

      // Ensure we have at least 3 scores (pad with 0s if needed)
      while (team1GameScores.length < 3) {
        team1GameScores.push(0);
      }
      while (team2GameScores.length < 3) {
        team2GameScores.push(0);
      }

      // Get current game - first non-completed game
      const currentGame = games.find((g) => g.Status !== "Completed");

      // Determine serving number for display (separate from scores)
      const team1ServingNumber =
        currentGame && match.CurrentServingTeam === 1
          ? match.CurrentServingNumber
          : 0;
      const team2ServingNumber =
        currentGame && match.CurrentServingTeam === 2
          ? match.CurrentServingNumber
          : 0;

      // Create team names using player initials
      const team1Name = t1p2LastName
        ? `${t1p1LastName.charAt(0)}/${t1p2LastName.charAt(0)}`
        : t1p1LastName.substring(0, 3).toUpperCase();

      const team2Name = t2p2LastName
        ? `${t2p1LastName.charAt(0)}/${t2p2LastName.charAt(0)}`
        : t2p1LastName.substring(0, 3).toUpperCase();

      // Build match title from available data
      const matchTitle = match.TournamentTitle || match.EventTitle || "";

      // Generate court name - use CourtName if available, otherwise use a default
      const court =
        match.CourtName || match.Court || `Court ${match.CourtNum || ""}`;

      // Transform the data into the expected format
      const processedData = {
        matchTitle: matchTitle,
        court: court,
        homeTeam: {
          name: team1Name,
          players: team1Players,
          score: team1GameScores, // [game1Score, game2Score, game3Score]
          serving: currentGame ? match.CurrentServingTeam === 1 : false,
          servingNumber: team1ServingNumber, // Separate field for serving number if needed
        },
        awayTeam: {
          name: team2Name,
          players: team2Players,
          score: team2GameScores, // [game1Score, game2Score, game3Score]
          serving: currentGame ? match.CurrentServingTeam === 2 : false,
          servingNumber: team2ServingNumber, // Separate field for serving number if needed
        },
      };

      // Add debug info
      console.log("Processed data:", {
        team1GameScores,
        team2GameScores,
        currentGame: currentGame ? currentGame.Num : "None",
        team1ServingNumber,
        team2ServingNumber,
      });

      // Return the processed data
      return NextResponse.json({
        ...data,
        processedData: processedData,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching scoreboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch scoreboard data" },
      { status: 500 }
    );
  }
}
