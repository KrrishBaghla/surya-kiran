"""
Phase 3: Data Bridge - Convert Phase 2 Output to Phase 4 Input Format
This bridges your working Phase 2 code with Phase 4 correlation engine
"""

import pandas as pd
import json
import csv
from datetime import datetime, timedelta
import logging
from typing import Dict, Any, List
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Phase3DataNormalizer:
    """
    Convert Phase 2 MinimalEventAnalyzer output to Phase 4 DataFrame format
    """

    def __init__(self):
        self.normalized_events = []

    def normalize_events_from_analyzer(self, analyzer):
        """
        Convert MinimalEventAnalyzer events to Phase 4 format
        """
        print("🔄 PHASE 3: NORMALIZING EVENTS FOR CORRELATION ANALYSIS")
        print("=" * 70)

        normalized_events = []

        # Get all events from the analyzer
        all_events = analyzer.all_events
        print(f"📥 Processing {len(all_events)} events from Phase 2...")

        for event in all_events:
            try:
                # Extract and normalize data
                normalized_event = {
                    'source': str(event.get('source', 'unknown')),
                    'event_id': str(event.get('event_id', 'unknown')),
                    'event_type': str(event.get('event_type', 'unknown')),
                    'time_iso': self._normalize_time(event.get('time')),
                    'has_time': self._has_valid_time(event.get('time')),
                    'ra_deg': self._normalize_coordinate(event.get('ra')),
                    'dec_deg': self._normalize_coordinate(event.get('dec')),
                    'has_coordinates': self._has_valid_coordinates(event.get('ra'), event.get('dec')),
                    'metadata_json': json.dumps(event.get('metadata', {}))
                }

                normalized_events.append(normalized_event)

            except Exception as e:
                logger.warning(f"Error normalizing event {event.get('event_id', 'unknown')}: {e}")
                # Keep event with minimal data rather than discarding
                normalized_events.append({
                    'source': str(event.get('source', 'unknown')),
                    'event_id': str(event.get('event_id', f'error_event_{len(normalized_events)}')),
                    'event_type': 'unknown',
                    'time_iso': None,
                    'has_time': False,
                    'ra_deg': None,
                    'dec_deg': None,
                    'has_coordinates': False,
                    'metadata_json': json.dumps(event)
                })

        self.normalized_events = normalized_events

        # Create DataFrame
        events_df = pd.DataFrame(normalized_events)

        print(f"✅ Normalization Complete!")
        print(f"   • Input events: {len(all_events)}")
        print(f"   • Normalized events: {len(events_df)}")
        print(f"   • Data retention: {len(events_df)/len(all_events)*100:.1f}%")
        print(f"   • Events with time: {events_df['has_time'].sum()}")
        print(f"   • Events with coordinates: {events_df['has_coordinates'].sum()}")

        return events_df

    def _normalize_time(self, time_value):
        """Normalize time to ISO format"""
        if time_value is None or time_value == '':
            return None

        try:
            # Try parsing as ISO format first
            if isinstance(time_value, str):
                # Remove timezone indicator if present
                clean_time = time_value.replace('Z', '')
                dt = datetime.fromisoformat(clean_time)
                return dt.isoformat()
            return str(time_value)
        except:
            try:
                # Try pandas datetime parsing
                import pandas as pd
                dt = pd.to_datetime(time_value)
                return dt.isoformat()
            except:
                return None

    def _has_valid_time(self, time_value):
        """Check if time is valid"""
        return self._normalize_time(time_value) is not None

    def _normalize_coordinate(self, coord_value):
        """Normalize coordinate to float"""
        if coord_value is None:
            return None

        try:
            coord_float = float(coord_value)
            # Basic sanity check
            if -180 <= coord_float <= 360:  # Loose bounds for RA/Dec
                return coord_float
            return None
        except:
            return None

    def _has_valid_coordinates(self, ra, dec):
        """Check if both coordinates are valid"""
        ra_norm = self._normalize_coordinate(ra)
        dec_norm = self._normalize_coordinate(dec)
        return ra_norm is not None and dec_norm is not None

    def export_normalized_data(self, events_df, filename=None):
        """Export normalized data for Phase 4"""
        if filename is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"normalized_events_{timestamp}.csv"

        try:
            events_df.to_csv(filename, index=False)
            print(f"✅ Normalized data exported: {filename}")
            return filename
        except Exception as e:
            logger.error(f"Export failed: {e}")
            return None
