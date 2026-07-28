import { StyleSheet } from 'react-native';

/** Drawer width aligned to screenshot shell proportions (Batch 5.DS.0). */
export const DRAWER_WIDTH = 280;

export const HEADER_MIN_HEIGHT = 56;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 11,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  drawerScroll: {
    flex: 1,
  },
  mainColumn: {
    flex: 1,
    minHeight: 0,
  },
  mainContent: {
    flex: 1,
  },
});
