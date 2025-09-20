"""
Mock data for Vercel deployment
"""

def get_mock_events():
    """Return mock cosmic events for demonstration"""
    return [
        {
            "id": "GW240101_123456",
            "source": "GWOSC",
            "event_type": "gravitational_wave",
            "type": "gravitational_wave",
            "time": "2024-01-01T12:34:56Z",
            "timestamp": "2024-01-01T12:34:56Z",
            "ra": 150.2,
            "dec": -45.8,
            "coordinates": {"ra": 150.2, "dec": -45.8},
            "confidence": 0.95,
            "priority": "HIGH",
            "description": "Gravitational wave detection from binary black hole merger",
            "metadata": {"mass1": 30.5, "mass2": 25.2, "distance": 1.2}
        },
        {
            "id": "GRB240101_125012",
            "source": "HEASARC",
            "event_type": "gamma_ray_burst",
            "type": "gamma_ray_burst",
            "time": "2024-01-01T12:50:12Z",
            "timestamp": "2024-01-01T12:50:12Z",
            "ra": 151.1,
            "dec": -44.9,
            "coordinates": {"ra": 151.1, "dec": -44.9},
            "confidence": 0.89,
            "priority": "HIGH",
            "description": "Gamma-ray burst detected by Fermi-GBM",
            "metadata": {"duration": 45.2, "energy": 1e52}
        },
        {
            "id": "SN2024ab",
            "source": "TNS",
            "event_type": "supernova",
            "type": "supernova",
            "time": "2024-01-02T08:22:15Z",
            "timestamp": "2024-01-02T08:22:15Z",
            "ra": 203.4,
            "dec": 12.7,
            "coordinates": {"ra": 203.4, "dec": 12.7},
            "confidence": 0.92,
            "priority": "MEDIUM",
            "description": "Type Ia supernova detected in galaxy NGC 1234",
            "metadata": {"magnitude": 18.5, "redshift": 0.05}
        },
        {
            "id": "IC240103_142837",
            "source": "ICECUBE",
            "event_type": "neutrino",
            "type": "neutrino",
            "time": "2024-01-03T14:28:37Z",
            "timestamp": "2024-01-03T14:28:37Z",
            "ra": 88.2,
            "dec": 35.1,
            "coordinates": {"ra": 88.2, "dec": 35.1},
            "confidence": 0.72,
            "priority": "MEDIUM",
            "description": "High-energy neutrino event detected by IceCube",
            "metadata": {"energy": 1e15, "track_type": "cascade"}
        },
        {
            "id": "CHIME240104_091523",
            "source": "CHIME",
            "event_type": "radio_burst",
            "type": "radio_burst",
            "time": "2024-01-04T09:15:23Z",
            "timestamp": "2024-01-04T09:15:23Z",
            "ra": 45.6,
            "dec": -12.3,
            "coordinates": {"ra": 45.6, "dec": -12.3},
            "confidence": 0.68,
            "priority": "LOW",
            "description": "Fast radio burst detected by CHIME",
            "metadata": {"dm": 500.2, "width": 2.5}
        }
    ]

def get_mock_correlations():
    """Return mock correlations for demonstration"""
    return [
        {
            "id": "corr_001",
            "event1_id": "GW240101_123456",
            "event2_id": "GRB240101_125012",
            "event1_source": "GWOSC",
            "event2_source": "HEASARC",
            "correlation_score": 0.95,
            "temporal_separation_hours": 0.26,
            "angular_separation_degrees": 0.8,
            "confidence": 0.95,
            "priority": "CRITICAL",
            "scientific_interest": "BREAKTHROUGH",
            "follow_up_recommended": True,
            "scoring_notes": "High-confidence multi-messenger correlation"
        },
        {
            "id": "corr_002",
            "event1_id": "SN2024ab",
            "event2_id": "IC240103_142837",
            "event1_source": "TNS",
            "event2_source": "ICECUBE",
            "correlation_score": 0.78,
            "temporal_separation_hours": 30.1,
            "angular_separation_degrees": 5.2,
            "confidence": 0.78,
            "priority": "HIGH",
            "scientific_interest": "SIGNIFICANT",
            "follow_up_recommended": True,
            "scoring_notes": "Potential supernova-neutrino correlation"
        },
        {
            "id": "corr_003",
            "event1_id": "GRB240101_125012",
            "event2_id": "CHIME240104_091523",
            "event1_source": "HEASARC",
            "event2_source": "CHIME",
            "correlation_score": 0.45,
            "temporal_separation_hours": 65.4,
            "angular_separation_degrees": 12.8,
            "confidence": 0.45,
            "priority": "LOW",
            "scientific_interest": "ROUTINE",
            "follow_up_recommended": False,
            "scoring_notes": "Low-confidence correlation, likely background"
        }
    ]
