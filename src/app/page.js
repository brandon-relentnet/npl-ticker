import Image from "next/image";

const matchTickerData = [
  {
    matchTitle: "Kansas City NPL Event Weekend #4",
    court: "56CC",
    homeTeam: {
      name: "IND",
      players: ["CILENTO", "MARCOS"],
      score: [5, 0, 0],
      serving: true,
    },
    awayTeam: {
      name: "KAN",
      players: ["DAWSON", "KESNER"],
      score: [1, 0, 0],
      serving: false,
    },
  },
];

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
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      {matchTickerData.map((match, index) => (
        <div key={index} className=" p-18 rounded flex flex-col">
          {/* Match Title Bar */}
          <div className="bg-stone-900 text-stone-50 font-black h-8 w-130 rounded-t-lg flex items-center justify-start pl-2">
            {match.matchTitle}
          </div>

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
              <TeamRow
                team={match.homeTeam}
                isServing={match.homeTeam.serving}
              />
              <TeamRow
                team={match.awayTeam}
                isServing={match.awayTeam.serving}
              />
            </div>

            <div className="h-full w-50 bg-stone-100 rounded-r-lg overflow-hidden">
              <div className="h-full bg-stone-600 grid grid-cols-3 gap-0.25 rounded-r-xl">
                {[...match.homeTeam.score, ...match.awayTeam.score].map(
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

          {/* Court & Teams Bar */}
          <div className="bg-stone-900 text-stone-100 font-black rounded-br-lg h-8 w-130 flex items-center justify-between px-2">
            <div className="flex gap-2">Court: {match.court}</div>
            <div className="flex gap-2">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </div>
          </div>

          {/* Powered By Bar */}
          <div className="h-8 w-50 italic flex items-center justify-center rounded-b-lg bg-stone-950">
            <span className="bg-gradient-to-r from-[#f38ab8] to-[#56a7db] bg-clip-text text-transparent">
              Powered by RelentNet™
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
