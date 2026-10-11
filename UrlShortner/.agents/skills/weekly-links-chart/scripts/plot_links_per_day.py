"""Plot links generated per day (current week) as a bar chart and save it as a PNG.

Usage:
    python plot_links_per_day.py <input.json> <output.png>

Input JSON shape:
    {"days": [{"day": "2026-10-05", "count": 3}, ...]}

Days with no links are rendered as zero-height bars so the x-axis always shows
the full Monday-Sunday week. The output directory is created if it does not
exist. Renders headlessly (Agg backend), so no display is required.
"""

import json
import os
import sys
from datetime import date, timedelta

try:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.ticker import MaxNLocator
except ImportError:
    sys.exit("matplotlib is required. Install it with: pip install matplotlib")


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit("usage: python plot_links_per_day.py <input.json> <output.png>")

    input_path, output_path = sys.argv[1], sys.argv[2]

    with open(input_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    counts_by_day = {entry["day"]: int(entry["count"]) for entry in payload.get("days", [])}

    # Anchor the week (Monday) on any day present in the data; fall back to today.
    if counts_by_day:
        anchor = date.fromisoformat(min(counts_by_day))
    else:
        anchor = date.today()
    week_start = anchor - timedelta(days=anchor.weekday())

    days = [week_start + timedelta(days=i) for i in range(7)]
    labels = [d.strftime("%a\n%b %d") for d in days]  # e.g. "Mon\nOct 05"
    values = [counts_by_day.get(d.isoformat(), 0) for d in days]

    fig, ax = plt.subplots(figsize=(9, 5))
    bars = ax.bar(labels, values, color="#2563eb")
    ax.bar_label(bars, padding=3)
    ax.set_title("Links generated per day - current week")
    ax.set_xlabel("Day")
    ax.set_ylabel("Links generated")
    ax.set_ylim(bottom=0)
    ax.yaxis.set_major_locator(MaxNLocator(integer=True))
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    fig.tight_layout()

    output_dir = os.path.dirname(os.path.abspath(output_path))
    os.makedirs(output_dir, exist_ok=True)
    fig.savefig(output_path, dpi=150)
    print(f"Saved chart to {output_path}")


if __name__ == "__main__":
    main()
