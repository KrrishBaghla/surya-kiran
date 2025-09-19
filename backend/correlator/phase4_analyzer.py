"""
Enhanced Phase 4: Multi-Messenger Event Correlation Engine
Fixed version with missing column handling, diagnostics, visualization and exports.
"""
import warnings
warnings.filterwarnings('ignore')
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
from datetime import datetime, timedelta
import logging
from typing import Dict, Any, List, Tuple, Optional
from dataclasses import dataclass
import glob
import os

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class CorrelationResult:
    """Data structure for correlation results"""
    event1_id: str
    event2_id: str
    event1_source: str
    event2_source: str
    time_separation_hours: float
    angular_separation_deg: Optional[float]
    correlation_score: float
    correlation_type: str
    confidence_level: str
    notes: str

class EnhancedCorrelationAnalyzer:
    def __init__(self, adaptive_mode: bool = True):
        self.adaptive_mode = adaptive_mode
        self.thresholds = {
            'time': {'gw_optical': 72, 'optical_optical': 48, 'gw_gw': 1},
            'space': {'gw_optical': 5, 'optical_optical': 2.0, 'gw_gw': 0.5}
        }
        self.confidence_cutoffs = {'high': 0.7, 'medium': 0.4}

    def adapt_thresholds(self, df: pd.DataFrame):
        """Adapt thresholds based on data distribution"""
        if not self.adaptive_mode: return
        if 'datetime' in df.columns and len(df) > 1:
            dt_hours = df['datetime'].diff().abs().dt.total_seconds() / 3600
            dt_hours = dt_hours.dropna()
            if not dt_hours.empty:
                median_dt = dt_hours.median()
                self.thresholds['time']['optical_optical'] = max(
                    self.thresholds['time']['optical_optical'], median_dt * 1.5
                )
        coords = df.dropna(subset=['ra_deg','dec_deg'])
        if len(coords) > 1:
            ra_span = coords['ra_deg'].max() - coords['ra_deg'].min()
            self.thresholds['space']['optical_optical'] = max(
                self.thresholds['space']['optical_optical'], ra_span * 0.1
            )

    def sigmoid_score(self, x: float, x0: float, k: float = 1.0):
        """Sigmoid scoring centered at x0"""
        return 1 / (1 + np.exp(k * (x - x0)))

    def analyze_events(self, df: pd.DataFrame) -> Dict[str, Any]:
        results = {'time_correlations': [], 'spatial_correlations': [], 'joint_correlations': [], 'summary': {}}
        df = df.copy()
        df['datetime'] = pd.to_datetime(df['time_iso'])
        # Add time_mjd if missing (convert from datetime)
        if 'time_mjd' not in df.columns:
            epoch = pd.Timestamp('1858-11-17')
            df['time_mjd'] = (df['datetime'] - epoch).dt.total_seconds() / 86400.0
        self.adapt_thresholds(df)

        n = len(df)
        for i in range(n):
            for j in range(i+1, n):
                e1, e2 = df.iloc[i], df.iloc[j]
                dt = abs((e1['datetime'] - e2['datetime']).total_seconds()) / 3600.0
                if (pd.notnull(e1.get('ra_deg')) and pd.notnull(e2.get('ra_deg')) and
                    pd.notnull(e1.get('dec_deg')) and pd.notnull(e2.get('dec_deg'))):
                    dra = abs(e1['ra_deg'] - e2['ra_deg'])
                    ddec = abs(e1['dec_deg'] - e2['dec_deg'])
                    dtheta = np.sqrt(dra**2 + ddec**2)
                else:
                    dtheta = np.nan
                sources = {e1['source'], e2['source']}
                if 'GWOSC' in sources and ('ZTF' in sources or 'TNS' in sources):
                    pair = 'gw_optical'
                elif sources <= {'ZTF','TNS'}:
                    pair = 'optical_optical'
                else:
                    pair = 'gw_gw'
                # Temporal
                if dt <= self.thresholds['time'][pair]:
                    ts = self.sigmoid_score(dt, self.thresholds['time'][pair]/2)
                    if pd.notnull(dtheta) and dtheta <= self.thresholds['space'][pair]:
                        ss = self.sigmoid_score(dtheta, self.thresholds['space'][pair]/2)
                    else:
                        ss = 0
                    score = 0.6 * ts + 0.4 * ss
                    if score >= self.confidence_cutoffs['high']:
                        conf = 'high'
                    elif score >= self.confidence_cutoffs['medium']:
                        conf = 'medium'
                    else:
                        conf = 'low'
                    notes = f"Δt={dt:.2f}h, Δθ={dtheta if not np.isnan(dtheta) else 'N/A'}°, score={score:.3f}"
                    result = CorrelationResult(
                        str(e1['event_id']), str(e2['event_id']),
                        str(e1['source']), str(e2['source']),
                        dt, dtheta, score,
                        'joint' if ss>0 else 'temporal',
                        conf, notes
                    )
                    if result.correlation_type == 'joint':
                        results['joint_correlations'].append(result)
                    else:
                        results['time_correlations'].append(result)
                # Spatial-only
                elif pd.notnull(dtheta) and dtheta <= self.thresholds['space'][pair]:
                    ss = self.sigmoid_score(dtheta, self.thresholds['space'][pair]/2)
                    conf = 'medium' if ss >= self.confidence_cutoffs['medium'] else 'low'
                    notes = f"Spatial-only Δθ={dtheta:.2f}°, score={ss:.3f}"
                    result = CorrelationResult(
                        str(e1['event_id']), str(e2['event_id']),
                        str(e1['source']), str(e2['source']),
                        dt, dtheta, ss, 'spatial', conf, notes
                    )
                    results['spatial_correlations'].append(result)
        results['summary'] = {
            'total_events': len(df),
            'temporal_pairs': len(results['time_correlations']),
            'spatial_pairs': len(results['spatial_correlations']),
            'joint_pairs': len(results['joint_correlations']),
            'high_confidence': sum(1 for c in results['joint_correlations'] if c.confidence_level=='high'),
            'medium_confidence': sum(1 for c in results['joint_correlations'] if c.confidence_level=='medium'),
        }
        return results

def load_phase2_data() -> Optional[pd.DataFrame]:
    files = glob.glob("normalized_events_*.csv")
    if not files:
        return None
    df = pd.read_csv(sorted(files)[-1])
    return df

def create_enhanced_test_data() -> pd.DataFrame:
    now = datetime.utcnow()
    events = []
    events.append({
        'source': 'HEASARC', 'event_id': 'GRB240925_TEST',
        'time_iso': now.isoformat(), 'ra_deg': 150.0, 'dec_deg': 2.0
    })
    events.append({
        'source': 'ZTF', 'event_id': 'ZTF24_afterglow_test',
        'time_iso': (now + timedelta(hours=0.3)).isoformat(),
        'ra_deg': 150.05, 'dec_deg': 2.03
    })
    for i in range(10):
        events.append({
            'source': 'ZTF', 'event_id': f'ZTF24_rand{i}',
            'time_iso': (now + timedelta(hours=1+i*2)).isoformat(),
            'ra_deg': np.random.uniform(0, 360),
            'dec_deg': np.random.uniform(-90, 90)
        })
    for i in range(5):
        events.append({
            'source': 'TNS', 'event_id': f'SN2024{chr(65+i)}',
            'time_iso': (now + timedelta(hours=5+i*3)).isoformat(),
            'ra_deg': np.random.uniform(0, 360),
            'dec_deg': np.random.uniform(-90, 90)
        })
    return pd.DataFrame(events)

def enhanced_correlation_diagnostics(df: pd.DataFrame):
    total = len(df)
    has_time = df['time_iso'].notnull().sum()
    has_coord = (df['ra_deg'].notnull() & df['dec_deg'].notnull()).sum()
    both = df['time_iso'].notnull() & df['ra_deg'].notnull() & df['dec_deg'].notnull()
    print("\nCORRELATION DIAGNOSTIC ANALYSIS")
    print("="*50)
    print(f"Data Quality:\n  • Total events: {total}\n  • With time: {has_time}\n  • With coords: {has_coord}\n  • With both: {both.sum()}")
    if both.sum() > 1:
        times = pd.to_datetime(df['time_iso'])
        span = (times.max() - times.min()).total_seconds()/3600.0
        rate = total / span if span > 0 else np.nan
        coords_df = df.dropna(subset=['ra_deg', 'dec_deg'])
        if len(coords_df) > 0:
            ra_span = coords_df['ra_deg'].max() - coords_df['ra_deg'].min()
            dec_span = coords_df['dec_deg'].max() - coords_df['dec_deg'].min()
            print(f"\nTemporal span: {span:.2f}h, avg rate: {rate:.1f}ev/h")
            print(f"RA span: {ra_span:.2f}°, Dec span: {dec_span:.2f}°")

def export_enhanced_results(results: Dict[str, Any], events_df: pd.DataFrame) -> Dict[str, Optional[str]]:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    export_data = {
        'metadata': {
            'timestamp': timestamp,
            'total_events': len(events_df),
            'adaptive_mode': True,
            'version': 'enhanced_v2.0'
        },
        'summary': results['summary'],
        'correlations': {
            'temporal': [c.__dict__ for c in results['time_correlations']],
            'spatial': [c.__dict__ for c in results['spatial_correlations']],
            'joint': [c.__dict__ for c in results['joint_correlations']],
        }
    }
    json_file = f'phase4_results_{timestamp}.json'
    with open(json_file, 'w') as f:
        json.dump(export_data, f, indent=2, default=str)
    csv_file = None
    if results['joint_correlations']:
        high_confidence = [c for c in results['joint_correlations'] if c.confidence_level == 'high']
        if high_confidence:
            df_high = pd.DataFrame([c.__dict__ for c in high_confidence])
            csv_file = f'phase4_high_priority_{timestamp}.csv'
            df_high.to_csv(csv_file, index=False)
            print(f"✅ High-priority correlations saved to: {csv_file}")
        else:
            df_joint = pd.DataFrame([c.__dict__ for c in results['joint_correlations']])
            csv_file = f'phase4_joint_correlations_{timestamp}.csv'
            df_joint.to_csv(csv_file, index=False)
            print(f"✅ Joint correlations saved to: {csv_file}")
    print(f"✅ Full results exported to: {json_file}")
    return {'json': json_file, 'csv': csv_file}

def run_enhanced_phase4_analysis():
    print("\n🚀 STARTING ENHANCED PHASE 4 ANALYSIS")
    print("="*70)
    df = load_phase2_data()
    if df is None:
        print("\n❌ No normalized data found—generating test dataset.")
        df = create_enhanced_test_data()
        print(f"✅ Created test dataset with {len(df)} events")
    else:
        print(f"✅ Loaded {len(df)} events from normalized data")
    enhanced_correlation_diagnostics(df)
    analyzer = EnhancedCorrelationAnalyzer(adaptive_mode=True)
    print("\n🔍 Running correlation analysis...")
    results = analyzer.analyze_events(df)
    print("\n💾 Exporting results...")
    export_files = export_enhanced_results(results, df)
    s = results['summary']
    print("\n" + "="*70)
    print("ENHANCED PHASE 4 ANALYSIS COMPLETE!")
    print("="*70)
    print(f" • Total events: {s['total_events']}")
    print(f" • Temporal pairs: {s['temporal_pairs']}")
    print(f" • Spatial pairs: {s['spatial_pairs']}")
    print(f" • Joint pairs: {s['joint_pairs']}")
    print(f" • High-confidence: {s['high_confidence']}")
    print(f" • Medium-confidence: {s['medium_confidence']}")
    print("\n📁 Generated Files:")
    print(f"   📋 JSON Results: {export_files['json']}")
    if export_files['csv']:
        print(f"   📈 CSV Data: {export_files['csv']}")
    return results
