import { create } from 'zustand';
import { ReportesGacetaStore } from '../interfaces/reportesGaceta.interfaces';

export const useReportesGacetaStore = create<ReportesGacetaStore>((set) => ({
  visible: false,
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
}));