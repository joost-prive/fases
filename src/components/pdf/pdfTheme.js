import { StyleSheet } from '@react-pdf/renderer'

export const SEASON_THEMES = {
  winter: {
    skyTop: '#0D47A1', skyMid: '#1976D2', skyBottom: '#90CAF9',
    hill1: '#C8DCE8', hill2: '#D9E8EE', hill3: '#EEF7FB',
    accent: '#90CAF9', text: '#FFFFFF',
  },
  spring: {
    skyTop: '#FF9BB7', skyMid: '#FFCDE0', skyBottom: '#B3E5FC',
    hill1: '#8BC34A', hill2: '#7CB342', hill3: '#9CCC65',
    accent: '#F48FB1', text: '#FFFFFF',
  },
  summer: {
    skyTop: '#1565C0', skyMid: '#2196F3', skyBottom: '#64B5F6',
    hill1: '#2E7D32', hill2: '#388E3C', hill3: '#43A047',
    accent: '#FFD600', text: '#FFFFFF',
  },
  autumn: {
    skyTop: '#B71C1C', skyMid: '#FF7043', skyBottom: '#FFA726',
    hill1: '#5D4037', hill2: '#6D4C41', hill3: '#795548',
    accent: '#FF7043', text: '#FFFFFF',
  },
}

export const COLORS = {
  primary: '#E07845',
  teal: '#5A9EA0',
  purple: '#9B7EC8',
  green: '#6EA86A',
  yellow: '#F9C74F',
  background: '#FFF8F0',
  white: '#FFFFFF',
  textDark: '#2C1F13',
  textMuted: '#8B7355',
  border: '#EDE0D0',
  lightBg: '#FAF0E6',
}

export const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 44,
    paddingTop: 44,
    paddingBottom: 52,
    fontFamily: 'Helvetica',
    color: COLORS.textDark,
    fontSize: 10,
  },
  // Headers
  h1: {
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textDark,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textDark,
  },
  h3: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textDark,
  },
  // Body text
  body: {
    fontSize: 10,
    lineHeight: 1.6,
    color: COLORS.textDark,
  },
  muted: {
    fontSize: 9,
    color: COLORS.textMuted,
    lineHeight: 1.4,
  },
  // Labels
  label: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  // Answer block
  answerBlock: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    padding: 10,
    marginBottom: 4,
  },
  // Child badge (colored dot + name)
  childBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  childDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  childName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textDark,
  },
  childAge: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  // Divider
  divider: {
    borderBottom: `1pt solid ${COLORS.border}`,
    marginVertical: 10,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
})
