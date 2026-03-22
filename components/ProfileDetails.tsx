"use client";

import { UserProfile } from "@/lib/types";

interface ProfileDetailsProps {
  profile: UserProfile;
}

function formatMoney(amount: number): string {
  return "$" + amount.toLocaleString();
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  const totalDebt = profile.debts.reduce((sum, d) => sum + d.balance, 0);
  const totalAssets = profile.assets.reduce((sum, a) => sum + a.balance, 0);
  const homeEquity = profile.housing.homeValue
    ? profile.housing.homeValue -
      (profile.debts.find((d) => d.name === "Mortgage")?.balance ?? 0)
    : 0;
  const netWorth = totalAssets + homeEquity - totalDebt;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-4xl">{profile.emoji}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-500">
            Age {profile.age} · {profile.occupation} · {profile.location}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Income"
          value={formatMoney(profile.income)}
          sublabel={profile.incomeNote ?? "/yr"}
          color="green"
        />
        <StatCard
          label="Total Debt"
          value={formatMoney(totalDebt)}
          color="red"
        />
        <StatCard
          label="Total Assets"
          value={formatMoney(totalAssets + homeEquity)}
          color="blue"
        />
        <StatCard
          label="Net Worth"
          value={formatMoney(netWorth)}
          color={netWorth >= 0 ? "green" : "red"}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
            Debts
          </h3>
          <div className="space-y-2">
            {profile.debts.map((debt) => (
              <div
                key={debt.name}
                className="flex justify-between text-sm py-1.5 border-b border-gray-100"
              >
                <span className="text-gray-600">
                  {debt.name}
                  {debt.rate ? (
                    <span className="text-gray-400 ml-1">({debt.rate}%)</span>
                  ) : null}
                </span>
                <span className="font-medium text-gray-900">
                  {formatMoney(debt.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
            Assets
          </h3>
          <div className="space-y-2">
            {profile.assets
              .filter((a) => a.balance > 0)
              .map((asset) => (
                <div
                  key={asset.name}
                  className="flex justify-between text-sm py-1.5 border-b border-gray-100"
                >
                  <span className="text-gray-600">{asset.name}</span>
                  <span className="font-medium text-gray-900">
                    {formatMoney(asset.balance)}
                  </span>
                </div>
              ))}
            {homeEquity > 0 && (
              <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Home Equity</span>
                <span className="font-medium text-gray-900">
                  {formatMoney(homeEquity)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Goals
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.goals.map((goal) => (
            <span
              key={goal}
              className="bg-violet-50 text-violet-700 text-sm px-3 py-1 rounded-full"
            >
              {goal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: string;
  sublabel?: string;
  color: "green" | "red" | "blue";
}) {
  const colorClasses = {
    green: "text-green-700",
    red: "text-red-600",
    blue: "text-blue-700",
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-bold ${colorClasses[color]}`}>{value}</p>
      {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
    </div>
  );
}
