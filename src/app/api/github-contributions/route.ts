import { NextResponse } from "next/server";

const query = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

const login = "cadorowo";

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

async function getPublicCalendar() {
  const response = await fetch(
    "https://github.com/users/cadorowo/contributions",
    {
      headers: { Accept: "text/html" },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) throw new Error("GitHub public calendar request failed");

  const html = await response.text();
  const totalMatch = html.match(
    /<h2[^>]*>[\s\S]*?([\d,]+)\s+contributions\s+in the last year/i
  );
  const days: ContributionDay[] = [];
  const dayPattern =
    /<td\b(?=[^>]*\bdata-date="([^"]+)")(?=[^>]*\bdata-level="([0-4])")[^>]*>/g;

  for (const match of html.matchAll(dayPattern)) {
    days.push({
      date: match[1],
      count: 0,
      level: Number(match[2]),
    });
  }

  if (days.length === 0) throw new Error("GitHub public calendar had no days");

  return {
    total: totalMatch ? Number(totalMatch[1].replaceAll(",", "")) : 0,
    days,
  };
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    try {
      return NextResponse.json(await getPublicCalendar());
    } catch {
      return NextResponse.json(
        { error: "GitHub contribution data is temporarily unavailable" },
        { status: 502 }
      );
    }
  }

  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { login, from: from.toISOString(), to: to.toISOString() },
    }),
    next: { revalidate: 3600 },
  });
  if (!response.ok) return NextResponse.json({ error: "GitHub request failed" }, { status: response.status });
  const payload = await response.json();
  if (payload.errors) return NextResponse.json({ error: "GitHub request failed" }, { status: 502 });
  const calendar = payload.data.user.contributionsCollection;
  const days = calendar.contributionCalendar.weeks.flatMap((week: { contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }) => week.contributionDays.map((day) => ({
    date: day.date,
    count: day.contributionCount,
    level: { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }[day.contributionLevel as "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE"] ?? 0,
  })));
  return NextResponse.json({ total: calendar.contributionCalendar.totalContributions, days });
}
