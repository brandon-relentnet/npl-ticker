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

      // Count completed games won by each team
      const gamesWon1 = games.filter(
        (g) => g.Status === "Completed" && g.T1_Score > g.T2_Score
      ).length;
      const gamesWon2 = games.filter(
        (g) => g.Status === "Completed" && g.T2_Score > g.T1_Score
      ).length;

      // Get current game (first non-completed or last game)
      const currentGame =
        games.find((g) => g.Status !== "Completed") || games[games.length - 1];
      const currentGameScore1 = currentGame ? currentGame.T1_Score : 0;
      const currentGameScore2 = currentGame ? currentGame.T2_Score : 0;

      // Determine serving number for each team
      const team1ServingNumber =
        match.CurrentServingTeam === 1 ? match.CurrentServingNumber : 0;
      const team2ServingNumber =
        match.CurrentServingTeam === 2 ? match.CurrentServingNumber : 0;

      // Create team names using player initials
      const team1Name = t1p2LastName
        ? `${t1p1LastName.charAt(0)}/${t1p2LastName.charAt(0)}`
        : t1p1LastName.substring(0, 3).toUpperCase();

      const team2Name = t2p2LastName
        ? `${t2p1LastName.charAt(0)}/${t2p2LastName.charAt(0)}`
        : t2p1LastName.substring(0, 3).toUpperCase();

      // Build match title from available data
      const matchTitle = match.TournamentTitle || match.EventTitle || "";

      // Generate court name - you might need to adjust this based on your actual data
      const court = `Court ${match.CurrentGameNum || 1}`;

      // Transform the data into the expected format
      const processedData = {
        matchTitle: matchTitle,
        court: court,
        homeTeam: {
          name: team1Name,
          players: team1Players,
          score: [gamesWon1, currentGameScore1, team1ServingNumber],
          serving: match.CurrentServingTeam === 1,
        },
        awayTeam: {
          name: team2Name,
          players: team2Players,
          score: [gamesWon2, currentGameScore2, team2ServingNumber],
          serving: match.CurrentServingTeam === 2,
        },
      };

      console.log(data);

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
