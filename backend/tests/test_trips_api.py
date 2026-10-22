from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

AUTH_HEADER = {"Authorization": "Bearer demo-token-123"}


def test_list_trips():
    res = client.get("/api/trips", headers=AUTH_HEADER)
    assert res.status_code == 200
    trips = res.json()
    assert isinstance(trips, list)
    assert len(trips) >= 1
    assert "id" in trips[0]
    assert "budget_breakdown" in trips[0]


def test_get_single_trip():
    res = client.get("/api/trips/trip-tokyo-demo", headers=AUTH_HEADER)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "trip-tokyo-demo"
    assert data["destination"] == "Tokyo, Japan"
    assert "days" in data
    assert len(data["days"]) >= 1


def test_get_nonexistent_trip():
    res = client.get("/api/trips/trip-does-not-exist", headers=AUTH_HEADER)
    assert res.status_code == 404
    assert res.json()["detail"] == "Trip not found"


def test_create_and_delete_trip():
    new_trip = {
        "title": "Barcelona Tapas & Gaudí Weekend",
        "destination": "Barcelona, Spain",
        "start_date": "2026-11-20",
        "end_date": "2026-11-23",
        "total_days": 4,
        "travelers_count": 2,
        "travel_type": "couple",
        "travel_style": "balanced",
        "daily_pace": "moderate",
        "total_budget": 1800.0,
        "currency": "EUR",
        "days": []
    }

    create_res = client.post("/api/trips", json=new_trip, headers=AUTH_HEADER)
    assert create_res.status_code == 201
    created = create_res.json()
    trip_id = created["id"]
    assert created["title"] == "Barcelona Tapas & Gaudí Weekend"

    # Delete the trip
    del_res = client.delete(f"/api/trips/{trip_id}", headers=AUTH_HEADER)
    assert del_res.status_code == 204

    # Verify deleted
    get_res = client.get(f"/api/trips/{trip_id}", headers=AUTH_HEADER)
    assert get_res.status_code == 404


def test_patch_trip_metadata():
    patch_res = client.patch(
        "/api/trips/trip-tokyo-demo",
        json={"total_budget": 3500.0, "title": "Tokyo Extended Explorer"},
        headers=AUTH_HEADER
    )
    assert patch_res.status_code == 200
    updated = patch_res.json()
    assert updated["total_budget"] == 3500.0
    assert updated["title"] == "Tokyo Extended Explorer"


def test_export_html_endpoint():
    res = client.post("/api/trips/trip-tokyo-demo/export", headers=AUTH_HEADER)
    assert res.status_code == 200
    assert "text/html" in res.headers["content-type"]
    assert "Tokyo" in res.text
