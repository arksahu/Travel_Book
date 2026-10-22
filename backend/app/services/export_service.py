from typing import Dict, Any


class ExportService:
    @staticmethod
    def generate_html_itinerary(trip: Dict[str, Any]) -> str:
        """
        Builds a standalone printable HTML document for the itinerary.
        """
        title = trip.get("title", "WanderWise Itinerary")
        dest = trip.get("destination", "")
        start_date = trip.get("start_date", "")
        end_date = trip.get("end_date", "")
        budget = trip.get("total_budget", 0)
        currency = trip.get("currency", "USD")
        days = trip.get("days", [])

        days_html = ""
        for day in days:
            acts_html = ""
            for act in day.get("activities", []):
                cost_str = f"{currency} {act.get('estimated_cost', 0):,.0f}" if act.get('estimated_cost') else "Free"
                acts_html += f"""
                <div class="activity">
                    <div class="activity-header">
                        <span class="slot slot-{act.get('time_slot')}">{str(act.get('time_slot')).upper()}</span>
                        <strong>{act.get('title')}</strong>
                        <span class="cost">{cost_str}</span>
                    </div>
                    <p class="desc">{act.get('description', '')}</p>
                    <div class="meta">
                        <span>Time: {act.get('start_time', 'TBD')} ({act.get('duration_minutes', 60)} min)</span>
                        <span>Location: {act.get('location_name', dest)}</span>
                        {f"<span>Tip: {act.get('booking_tip')}</span>" if act.get('booking_tip') else ""}
                    </div>
                </div>
                """

            days_html += f"""
            <div class="day-section">
                <h2>Day {day.get('day_number')} — {day.get('date', '')}</h2>
                <p class="day-summary">{day.get('summary', '')}</p>
                {f'<p class="transit-tip"><strong>Transit:</strong> {day.get("transit_tip")}</p>' if day.get("transit_tip") else ""}
                <div class="activities-list">
                    {acts_html}
                </div>
            </div>
            """

        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{title} — Itinerary</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            max-width: 800px;
            margin: 0 auto;
            padding: 24px;
            line-height: 1.5;
        }}
        .header {{
            border-bottom: 2px solid #0d9488;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }}
        h1 {{ margin: 0 0 8px 0; color: #0f172a; font-size: 24px; }}
        .header-meta {{ color: #64748b; font-size: 13px; }}
        .day-section {{
            margin-bottom: 32px;
            page-break-inside: avoid;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
        }}
        h2 {{ color: #0d9488; margin-top: 0; font-size: 18px; }}
        .day-summary {{ font-size: 13px; color: #475569; }}
        .transit-tip {{ font-size: 12px; background: #f0fdfa; padding: 8px; border-radius: 6px; color: #115e59; }}
        .activity {{
            border-top: 1px solid #f1f5f9;
            padding: 10px 0;
        }}
        .activity-header {{
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }}
        .slot {{
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
        }}
        .slot-morning {{ background: #fef3c7; color: #92400e; }}
        .slot-afternoon {{ background: #e0f2fe; color: #0369a1; }}
        .slot-evening {{ background: #e0e7ff; color: #3730a3; }}
        .cost {{ margin-left: auto; font-weight: bold; color: #0f766e; }}
        .desc {{ font-size: 12px; color: #64748b; margin: 4px 0; }}
        .meta {{ font-size: 11px; color: #94a3b8; display: flex; gap: 16px; }}
        @media print {{
            body {{ padding: 0; }}
            .day-section {{ border: 1px solid #cbd5e1; page-break-after: always; }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>{title}</h1>
        <div class="header-meta">
            <span>Destination: <strong>{dest}</strong></span> |
            <span>Dates: <strong>{start_date} to {end_date}</strong></span> |
            <span>Budget: <strong>{currency} {budget:,.0f}</strong></span>
        </div>
    </div>
    {days_html}
</body>
</html>
"""
        return html
