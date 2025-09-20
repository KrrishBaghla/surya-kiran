"""
Phase 4: Enhanced Correlation Analysis
Advanced correlation detection with adaptive thresholds and improved scoring
"""

import json
import csv
import os
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
import logging

logger = logging.getLogger(__name__)

class EnhancedCorrelationAnalyzer:
    """Enhanced correlation analysis with adaptive thresholds and improved scoring"""
    
    def __init__(self):
        self.adaptive_thresholds = {
            'temporal': 24.0,  # hours
            'spatial': 5.0,    # degrees
            'confidence': 0.3  # minimum confidence
        }
        self.correlation_results = []
        
    def analyze_correlations(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Run enhanced correlation analysis on normalized events"""
        logger.info("🚀 STARTING ENHANCED PHASE 4 ANALYSIS")
        logger.info("=" * 70)
        
        if not events:
            logger.warning("❌ No normalized data found—generating test dataset.")
            events = self._generate_test_dataset()
            logger.info(f"✅ Created test dataset with {len(events)} events")
        
        # Diagnostic analysis
        self._run_diagnostic_analysis(events)
        
        # Find correlations
        correlations = self._find_correlations(events)
        
        # Export results
        self._export_results(correlations, events)
        
        # Summary
        self._print_summary(correlations)
        
        return {
            'correlations': correlations,
            'total_events': len(events),
            'total_correlations': len(correlations),
            'analysis_timestamp': datetime.now().isoformat()
        }
    
    def _generate_test_dataset(self) -> List[Dict[str, Any]]:
        """Generate a test dataset for correlation analysis"""
        events = []
        base_time = datetime.now()
        
        # Generate diverse test events
        event_types = ['gravitational_wave', 'gamma_ray_burst', 'optical_transient', 'neutrino']
        sources = ['GWOSC', 'HEASARC', 'ZTF', 'ICECUBE']
        
        for i in range(17):
            event = {
                'id': f'test_event_{i+1}',
                'source': sources[i % len(sources)],
                'event_type': event_types[i % len(event_types)],
                'time': (base_time.timestamp() - (i * 3600)),  # 1 hour apart
                'ra': np.random.uniform(0, 360),
                'dec': np.random.uniform(-90, 90),
                'confidence': np.random.uniform(0.1, 0.9),
                'metadata': {'test': True}
            }
            events.append(event)
        
        return events
    
    def _run_diagnostic_analysis(self, events: List[Dict[str, Any]]):
        """Run diagnostic analysis on the event dataset"""
        logger.info("CORRELATION DIAGNOSTIC ANALYSIS")
        logger.info("=" * 50)
        
        # Data quality metrics
        with_time = sum(1 for e in events if 'time' in e and e['time'])
        with_coords = sum(1 for e in events if 'ra' in e and 'dec' in e and e['ra'] is not None and e['dec'] is not None)
        with_both = sum(1 for e in events if ('time' in e and e['time']) and ('ra' in e and 'dec' in e and e['ra'] is not None and e['dec'] is not None))
        
        logger.info(f"Data Quality:")
        logger.info(f"  • Total events: {len(events)}")
        logger.info(f"  • With time: {with_time}")
        logger.info(f"  • With coords: {with_coords}")
        logger.info(f"  • With both: {with_both}")
        
        # Temporal analysis
        if with_time > 1:
            times = [e['time'] for e in events if 'time' in e and e['time']]
            time_span = (max(times) - min(times)) / 3600  # hours
            avg_rate = len(events) / max(time_span, 1)
            logger.info(f"Temporal span: {time_span:.2f}h, avg rate: {avg_rate:.1f}ev/h")
        
        # Spatial analysis
        if with_coords > 1:
            ras = [e['ra'] for e in events if 'ra' in e and e['ra'] is not None]
            decs = [e['dec'] for e in events if 'dec' in e and e['dec'] is not None]
            ra_span = max(ras) - min(ras) if ras else 0
            dec_span = max(decs) - min(decs) if decs else 0
            logger.info(f"RA span: {ra_span:.2f}°, Dec span: {dec_span:.2f}°")
    
    def _find_correlations(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Find correlations between events"""
        logger.info("🔍 Running correlation analysis...")
        
        correlations = []
        temporal_pairs = 0
        spatial_pairs = 0
        joint_pairs = 0
        
        for i, event1 in enumerate(events):
            for j, event2 in enumerate(events[i+1:], i+1):
                # Temporal correlation
                if self._check_temporal_correlation(event1, event2):
                    temporal_pairs += 1
                    
                    # Spatial correlation
                    if self._check_spatial_correlation(event1, event2):
                        spatial_pairs += 1
                        
                        # Joint correlation
                        correlation = self._calculate_joint_correlation(event1, event2)
                        if correlation['confidence'] >= self.adaptive_thresholds['confidence']:
                            joint_pairs += 1
                            correlations.append(correlation)
        
        logger.info(f" • Temporal pairs: {temporal_pairs}")
        logger.info(f" • Spatial pairs: {spatial_pairs}")
        logger.info(f" • Joint pairs: {joint_pairs}")
        
        return correlations
    
    def _check_temporal_correlation(self, event1: Dict, event2: Dict) -> bool:
        """Check if two events are temporally correlated"""
        if 'time' not in event1 or 'time' not in event2:
            return False
        
        time_diff = abs(event1['time'] - event2['time']) / 3600  # hours
        return time_diff <= self.adaptive_thresholds['temporal']
    
    def _check_spatial_correlation(self, event1: Dict, event2: Dict) -> bool:
        """Check if two events are spatially correlated"""
        if not all(key in event1 and key in event2 for key in ['ra', 'dec']):
            return False
        
        angular_sep = self._calculate_angular_separation(
            event1['ra'], event1['dec'],
            event2['ra'], event2['dec']
        )
        return angular_sep <= self.adaptive_thresholds['spatial']
    
    def _calculate_angular_separation(self, ra1: float, dec1: float, ra2: float, dec2: float) -> float:
        """Calculate angular separation between two sky coordinates"""
        # Convert to radians
        ra1_rad = np.radians(ra1)
        dec1_rad = np.radians(dec1)
        ra2_rad = np.radians(ra2)
        dec2_rad = np.radians(dec2)
        
        # Calculate angular separation using spherical geometry
        cos_sep = (np.sin(dec1_rad) * np.sin(dec2_rad) + 
                  np.cos(dec1_rad) * np.cos(dec2_rad) * np.cos(ra1_rad - ra2_rad))
        
        # Handle numerical precision issues
        cos_sep = np.clip(cos_sep, -1.0, 1.0)
        sep_rad = np.arccos(cos_sep)
        
        return np.degrees(sep_rad)
    
    def _calculate_joint_correlation(self, event1: Dict, event2: Dict) -> Dict[str, Any]:
        """Calculate joint correlation score and metadata"""
        time_diff = abs(event1['time'] - event2['time']) / 3600  # hours
        
        angular_sep = 0
        if all(key in event1 and key in event2 for key in ['ra', 'dec']):
            angular_sep = self._calculate_angular_separation(
                event1['ra'], event1['dec'],
                event2['ra'], event2['dec']
            )
        
        # Calculate confidence score
        temporal_score = np.exp(-time_diff / 12.0)  # 12-hour decay
        spatial_score = np.exp(-angular_sep / 2.0)  # 2-degree decay
        confidence = (temporal_score + spatial_score) / 2.0
        
        # Determine correlation type
        correlation_type = "joint"
        if time_diff < 1.0 and angular_sep < 1.0:
            correlation_type = "high_confidence"
        elif time_diff < 6.0 and angular_sep < 3.0:
            correlation_type = "medium_confidence"
        else:
            correlation_type = "low_confidence"
        
        return {
            'id': f"corr_{event1['id']}_{event2['id']}",
            'event1_id': event1['id'],
            'event2_id': event2['id'],
            'event1_source': event1.get('source', 'unknown'),
            'event2_source': event2.get('source', 'unknown'),
            'time_separation': time_diff,
            'angular_separation': angular_sep,
            'confidence': confidence,
            'correlation_type': correlation_type,
            'cross_messenger': event1.get('source') != event2.get('source'),
            'analysis_timestamp': datetime.now().isoformat()
        }
    
    def _export_results(self, correlations: List[Dict], events: List[Dict]):
        """Export correlation results to files"""
        logger.info("💾 Exporting results...")
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Export joint correlations CSV
        csv_filename = f"phase4_joint_correlations_{timestamp}.csv"
        with open(csv_filename, 'w', newline='') as csvfile:
            if correlations:
                fieldnames = correlations[0].keys()
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(correlations)
        logger.info(f"✅ Joint correlations saved to: {csv_filename}")
        
        # Export full results JSON
        json_filename = f"phase4_results_{timestamp}.json"
        results = {
            'metadata': {
                'analysis_timestamp': datetime.now().isoformat(),
                'total_events': len(events),
                'total_correlations': len(correlations),
                'analysis_type': 'enhanced_phase4'
            },
            'events': events,
            'correlations': correlations
        }
        
        with open(json_filename, 'w') as jsonfile:
            json.dump(results, jsonfile, indent=2, default=str)
        logger.info(f"✅ Full results exported to: {json_filename}")
    
    def _print_summary(self, correlations: List[Dict]):
        """Print analysis summary"""
        logger.info("=" * 70)
        logger.info("ENHANCED PHASE 4 ANALYSIS COMPLETE!")
        logger.info("=" * 70)
        
        high_conf = sum(1 for c in correlations if c['confidence'] > 0.7)
        med_conf = sum(1 for c in correlations if 0.4 <= c['confidence'] <= 0.7)
        low_conf = sum(1 for c in correlations if c['confidence'] < 0.4)
        
        logger.info(f" • High-confidence: {high_conf}")
        logger.info(f" • Medium-confidence: {med_conf}")
        logger.info(f" • Low-confidence: {low_conf}")
        
        logger.info("📁 Generated Files:")
        logger.info("   📋 JSON Results: phase4_results_*.json")
        logger.info("   📈 CSV Data: phase4_joint_correlations_*.csv")


def run_enhanced_phase4_analysis(events: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Run enhanced Phase 4 correlation analysis"""
    analyzer = EnhancedCorrelationAnalyzer()
    return analyzer.analyze_correlations(events)
