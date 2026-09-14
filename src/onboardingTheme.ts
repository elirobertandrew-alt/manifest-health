import { Platform, StyleSheet } from 'react-native';
import { colors } from './theme';

const shadow = (color: string, opacity: number, radius: number, y: number) =>
  Platform.select({
    web: { boxShadow: `0 ${y}px ${radius}px rgba(0, 0, 0, ${opacity})` },
    default: { shadowColor: color, shadowOpacity: opacity, shadowRadius: radius, shadowOffset: { width: 0, height: y } },
  });

export const onb = StyleSheet.create({
  /* shell ------------------------------------------------------- */
  shell: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 24 : 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', minHeight: 48 },
  backHit: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  backGlyph: { fontSize: 22, color: colors.ink, fontWeight: '800' },
  headerSpacer: { width: 32 },
  brandRow: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  logoMark: { width: 22, height: 22, borderRadius: 7, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center', marginRight: 8, transform: [{ rotate: '12deg' }] },
  logoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.coral },
  brand: { fontSize: 11, letterSpacing: 1.6, fontWeight: '900', color: colors.ink },
  skipHit: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 4 },
  skipText: { color: colors.muted, fontWeight: '800', fontSize: 13 },

  trackWrap: { paddingHorizontal: 24, paddingTop: 6, paddingBottom: 4 },
  track: { height: 5, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' },
  trackFill: { height: 5, borderRadius: 3, backgroundColor: colors.coral },
  trackLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  trackLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },

  stage: { flex: 1 },
  scroll: { flex: 1 },
  scrollPad: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 26 },

  footer: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 24 : 16, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: '#EEF2F8' },
  footerNote: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 10, lineHeight: 16 },
  ghost: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', marginTop: 4 },
  ghostText: { color: colors.blue, fontWeight: '800', fontSize: 14 },

  /* type -------------------------------------------------------- */
  eyebrow: { color: colors.coral, fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginBottom: 10 },
  question: { color: colors.ink, fontSize: 30, lineHeight: 35, fontWeight: '900', letterSpacing: -1, marginBottom: 10 },
  display: { color: colors.ink, fontSize: 40, lineHeight: 44, fontWeight: '900', letterSpacing: -1.6, marginBottom: 14 },
  lead: { color: colors.muted, fontSize: 15, lineHeight: 23, marginBottom: 20 },
  helper: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 12 },

  /* options ----------------------------------------------------- */
  list: { gap: 10 },
  option: { minHeight: 68, borderWidth: 1.5, borderColor: colors.line, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white },
  optionOn: { borderColor: colors.blue, backgroundColor: colors.blueSoft },
  optionIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  optionIconOn: { backgroundColor: colors.blue },
  optionIconText: { fontSize: 18, color: colors.ink, fontWeight: '900' },
  optionIconTextOn: { color: colors.white },
  optionCopy: { flex: 1, paddingRight: 8 },
  optionLabel: { color: colors.ink, fontSize: 16, fontWeight: '800', lineHeight: 21 },
  optionHint: { color: colors.muted, fontSize: 12.5, lineHeight: 17, marginTop: 3 },
  mark: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#BCC7D6', alignItems: 'center', justifyContent: 'center' },
  markSquare: { borderRadius: 8 },
  markOn: { borderColor: colors.blue, backgroundColor: colors.blue },
  markGlyph: { color: colors.white, fontSize: 13, fontWeight: '900', lineHeight: 16 },
  markDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white },

  /* compact grid ------------------------------------------------ */
  grid: { flexDirection: 'row', gap: 10 },
  gridItem: { flex: 1, minHeight: 118, borderWidth: 1.5, borderColor: colors.line, borderRadius: 16, padding: 13, backgroundColor: colors.white, justifyContent: 'flex-end' },
  gridItemOn: { borderColor: colors.blue, backgroundColor: colors.blueSoft },
  gridIcon: { fontSize: 22, color: colors.coral, fontWeight: '900', marginBottom: 'auto' },
  gridLabel: { color: colors.ink, fontWeight: '900', fontSize: 15, marginTop: 10 },
  gridHint: { color: colors.muted, fontSize: 11.5, lineHeight: 16, marginTop: 3 },

  /* scale ------------------------------------------------------- */
  scaleRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  scaleCell: { flex: 1, height: 52, borderRadius: 13, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  scaleCellOn: { borderColor: colors.blue, backgroundColor: colors.blue },
  scaleCellNum: { color: colors.muted, fontWeight: '900', fontSize: 15 },
  scaleCellNumOn: { color: colors.white },
  scaleCaption: { backgroundColor: colors.cream, borderRadius: 14, padding: 15 },
  scaleCaptionTitle: { color: colors.ink, fontWeight: '900', fontSize: 17 },
  scaleCaptionBody: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },

  /* commitment -------------------------------------------------- */
  holdWrap: { marginTop: 6, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.cream, borderWidth: 1.5, borderColor: colors.line },
  holdFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.green },
  holdInner: { minHeight: 74, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  holdLabel: { color: colors.ink, fontWeight: '900', fontSize: 16 },
  holdLabelOn: { color: colors.white },
  holdSub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  holdSubOn: { color: '#D8F2E7' },
  pledge: { backgroundColor: colors.blue, borderRadius: 22, padding: 22, marginBottom: 18 },
  pledgeMark: { color: '#9FBAFF', fontSize: 34, fontWeight: '900', lineHeight: 36 },
  pledgeText: { color: colors.white, fontSize: 20, lineHeight: 29, fontWeight: '800', marginTop: 4 },
  pledgeName: { color: colors.coral },

  /* analysing --------------------------------------------------- */
  analyzeWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  dialOuter: { width: 168, height: 168, borderRadius: 84, borderWidth: 10, borderColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  dialArc: { position: 'absolute', width: 168, height: 168, borderRadius: 84, borderWidth: 10, borderColor: 'transparent', borderTopColor: colors.blue, borderRightColor: colors.blue },
  dialValue: { color: colors.ink, fontSize: 40, fontWeight: '900', letterSpacing: -1.5 },
  dialCaption: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 2 },
  analyzeTitle: { color: colors.ink, fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 22 },
  taskRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', minHeight: 40 },
  taskDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  taskDotOn: { backgroundColor: colors.green, borderColor: colors.green },
  taskDotGlyph: { color: colors.white, fontSize: 11, fontWeight: '900' },
  taskText: { color: '#A9B4C4', fontSize: 14.5, fontWeight: '700', flex: 1 },
  taskTextOn: { color: colors.ink },

  /* plan reveal ------------------------------------------------- */
  scoreCard: { backgroundColor: colors.blue, borderRadius: 24, padding: 22, marginBottom: 14, ...(shadow(colors.blue, 0.18, 22, 10) as object) },
  scoreKicker: { color: '#BFD0FF', fontSize: 10, letterSpacing: 1.5, fontWeight: '900' },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8, marginBottom: 4 },
  scoreValue: { color: colors.white, fontSize: 54, fontWeight: '900', letterSpacing: -2.5, lineHeight: 58 },
  scoreOutOf: { color: '#9FBAFF', fontSize: 15, fontWeight: '900', marginBottom: 11, marginLeft: 4 },
  scoreLabel: { color: colors.coral, fontSize: 14, fontWeight: '900', marginLeft: 'auto', marginBottom: 13 },
  scoreBody: { color: '#DCE5FF', fontSize: 13.5, lineHeight: 20, marginTop: 6 },

  chartCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 22, padding: 18, marginBottom: 14 },
  chartHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  chartTitle: { color: colors.ink, fontWeight: '900', fontSize: 16 },
  chartTag: { marginLeft: 'auto', color: colors.green, fontWeight: '900', fontSize: 11, letterSpacing: 0.6 },
  chartBody: { color: colors.muted, fontSize: 12.5, lineHeight: 18, marginBottom: 16 },
  chart: { height: 126, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  chartCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  chartBar: { width: '74%', minHeight: 6, borderRadius: 8, backgroundColor: '#C8D6FF' },
  chartBarNow: { backgroundColor: colors.ink },
  chartBarLast: { backgroundColor: colors.coral },
  chartTick: { color: colors.muted, fontSize: 10, fontWeight: '800', marginTop: 8 },
  chartFoot: { color: colors.muted, fontSize: 10.5, lineHeight: 15, marginTop: 12 },

  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '900', marginTop: 10, marginBottom: 10 },
  planRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 14, marginBottom: 10 },
  planIndex: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.blueSoft, color: colors.blue, textAlign: 'center', lineHeight: 30, fontWeight: '900', fontSize: 12, marginRight: 12, overflow: 'hidden' },
  planCopy: { flex: 1 },
  planTitle: { color: colors.ink, fontWeight: '800', fontSize: 15, lineHeight: 20 },
  planWhen: { color: colors.muted, fontSize: 12, marginTop: 3 },

  proofCard: { backgroundColor: colors.greenSoft, borderRadius: 18, padding: 17, marginBottom: 12 },
  proofTag: { color: colors.green, fontSize: 10, fontWeight: '900', letterSpacing: 1.3, marginBottom: 8 },
  proofRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 7 },
  proofGlyph: { color: colors.green, fontWeight: '900', marginRight: 9, fontSize: 13, lineHeight: 19 },
  proofText: { color: colors.ink, flex: 1, fontSize: 13.5, lineHeight: 19 },

  answerCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 16, marginBottom: 10 },
  answerObstacle: { color: colors.coral, fontWeight: '900', fontSize: 13, marginBottom: 5 },
  answerBody: { color: colors.muted, fontSize: 13.5, lineHeight: 19 },

  /* value / proof ----------------------------------------------- */
  pillarRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 },
  pillarNum: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.coralSoft, color: colors.coral, textAlign: 'center', lineHeight: 34, fontWeight: '900', marginRight: 14, overflow: 'hidden' },
  pillarCopy: { flex: 1 },
  pillarTitle: { color: colors.ink, fontWeight: '900', fontSize: 16.5, marginBottom: 4 },
  pillarBody: { color: colors.muted, fontSize: 13.5, lineHeight: 20 },
  quoteCard: { backgroundColor: colors.cream, borderRadius: 20, padding: 20, marginTop: 6 },
  quoteText: { color: colors.ink, fontSize: 16, lineHeight: 25, fontWeight: '600' },
  quoteWho: { color: colors.muted, fontSize: 12, fontWeight: '800', marginTop: 12 },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statCell: { flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 14 },
  statValue: { color: colors.blue, fontSize: 24, fontWeight: '900', letterSpacing: -0.8 },
  statLabel: { color: colors.muted, fontSize: 11.5, lineHeight: 16, marginTop: 4 },

  /* input ------------------------------------------------------- */
  inputLabel: { color: colors.ink, fontSize: 10.5, fontWeight: '900', letterSpacing: 1.4, marginBottom: 8 },
  input: { minHeight: 60, borderWidth: 1.5, borderColor: '#C9D3E0', borderRadius: 16, paddingHorizontal: 18, fontSize: 17, color: colors.ink, backgroundColor: colors.white },
  inputFocus: { borderColor: colors.blue },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { borderWidth: 1.5, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 14, minHeight: 46, justifyContent: 'center', backgroundColor: colors.white },
  chipOn: { borderColor: colors.blue, backgroundColor: colors.blue },
  chipText: { color: colors.ink, fontWeight: '800', fontSize: 14 },
  chipTextOn: { color: colors.white },

  promise: { flexDirection: 'row', borderRadius: 16, backgroundColor: colors.greenSoft, padding: 15, marginTop: 16 },
  promiseIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.green, color: colors.white, textAlign: 'center', lineHeight: 28, fontWeight: '900', marginRight: 11, overflow: 'hidden' },
  promiseCopy: { flex: 1 },
  promiseTitle: { color: colors.ink, fontWeight: '900', marginBottom: 3, fontSize: 14 },
  promiseBody: { color: colors.muted, lineHeight: 19, fontSize: 12.5 },

  /* hero -------------------------------------------------------- */
  hero: { height: 230, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  heroCircle: {
    width: 132, height: 132, borderRadius: 66, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center',
    ...(shadow(colors.blue, 0.24, 24, 12) as object),
  },
  heroSymbol: { color: colors.white, fontSize: 56 },
  orbitLarge: { position: 'absolute', width: 212, height: 212, borderRadius: 106, borderWidth: 1, borderColor: '#C9D7FF' },
  orbitSmall: { position: 'absolute', width: 172, height: 172, borderRadius: 86, borderWidth: 1, borderColor: colors.coral, transform: [{ rotate: '30deg' }] },
  spark: { position: 'absolute', width: 11, height: 11, borderRadius: 6, backgroundColor: colors.coral },
});
