import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: COLORS.GREYSCALE_200,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  brandRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  brandBlock: {
    flex: 1,
    marginRight: 16,
  },
  logo: {
    height: 36,
    marginBottom: 10,
    width: 140,
  },
  businessName: {
    lineHeight: 20,
  },
  invoiceHeading: {
    alignItems: 'flex-end',
  },
  invoiceLabel: {
    letterSpacing: 1,
    marginBottom: 4,
  },
  invoiceNumber: {
    marginTop: 2,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  billToBlock: {
    flex: 1,
    marginRight: 16,
  },
  sectionLabel: {
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  metaRight: {
    minWidth: 150,
  },
  metaRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaLabel: {
    marginRight: 16,
  },
  metaValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
  balanceBlock: {
    borderTopColor: COLORS.GREYSCALE_200,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
    paddingTop: 12,
  },
  balanceAmount: {
    marginTop: 2,
  },
  tableHeader: {
    borderBottomColor: COLORS.GREYSCALE_200,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 4,
  },
  tableHeaderText: {
    letterSpacing: 0.6,
  },
  tableRow: {
    borderBottomColor: COLORS.GREYSCALE_200,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingVertical: 14,
  },
  colItem: {
    flex: 1.4,
    paddingRight: 8,
  },
  colQty: {
    alignItems: 'center',
    flex: 0.7,
  },
  colRate: {
    alignItems: 'flex-end',
    flex: 0.9,
  },
  colAmount: {
    alignItems: 'flex-end',
    flex: 0.9,
  },
  summary: {
    alignSelf: 'flex-end',
    marginTop: 18,
    width: 220,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryDivider: {
    backgroundColor: COLORS.GREYSCALE_200,
    height: StyleSheet.hairlineWidth,
    marginBottom: 12,
    marginTop: 4,
  },
  notes: {
    marginTop: 28,
  },
  notesLabel: {
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  notesBody: {
    lineHeight: 20,
  },
  poweredBy: {
    alignItems: 'center',
    marginTop: 40,
  },
});
