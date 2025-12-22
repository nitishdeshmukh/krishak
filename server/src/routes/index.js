import { Router } from 'express';

// Auth routes
import authRoutes from './authRoutes.js';

// Master data routes
import partiesRoutes from './partiesRoutes.js';
import brokersRoutes from './brokersRoutes.js';
import transportersRoutes from './transportersRoutes.js';
import doEntriesRoutes from './doEntriesRoutes.js';
import committeesRoutes from './committeesRoutes.js';

// Purchase routes
import paddyPurchasesRoutes from './purchases/paddyPurchasesRoutes.js';
import ricePurchasesRoutes from './purchases/ricePurchasesRoutes.js';
import frkPurchasesRoutes from './purchases/frkPurchasesRoutes.js';
import sackPurchasesRoutes from './purchases/sackPurchasesRoutes.js';
import otherPurchasesRoutes from './purchases/otherPurchasesRoutes.js';

// Sales routes
import paddySalesRoutes from './sales/paddySalesRoutes.js';
import riceSalesRoutes from './sales/riceSalesRoutes.js';
import frkSalesRoutes from './sales/frkSalesRoutes.js';
import sackSalesRoutes from './sales/sackSalesRoutes.js';
import brokensSalesRoutes from './sales/brokensSalesRoutes.js';
import brewersSalesRoutes from './sales/brewersSalesRoutes.js';
import huskSalesRoutes from './sales/huskSalesRoutes.js';
import riceBranSalesRoutes from './sales/riceBranSalesRoutes.js';
import whiteBranSalesRoutes from './sales/whiteBranSalesRoutes.js';
import otherSalesRoutes from './sales/otherSalesRoutes.js';

// Inward routes
import paddyInwardRoutes from './inward/paddyInwardRoutes.js';
import riceInwardRoutes from './inward/riceInwardRoutes.js';
import frkInwardRoutes from './inward/frkInwardRoutes.js';
import sackInwardRoutes from './inward/sackInwardRoutes.js';
import privateInwardRoutes from './inward/privateInwardRoutes.js';
import privatePaddyInwardRoutes from './inward/privatePaddyInwardRoutes.js';
import otherInwardRoutes from './inward/otherInwardRoutes.js';

// Outward routes
import govtRiceOutwardRoutes from './outward/govtRiceOutwardRoutes.js';
import govtSackOutwardRoutes from './outward/govtSackOutwardRoutes.js';
import privateRiceOutwardRoutes from './outward/privateRiceOutwardRoutes.js';
import privateSackOutwardRoutes from './outward/privateSackOutwardRoutes.js';
import privatePaddyOutwardRoutes from './outward/privatePaddyOutwardRoutes.js';
import frkOutwardRoutes from './outward/frkOutwardRoutes.js';
import brokensOutwardRoutes from './outward/brokensOutwardRoutes.js';
import brewersOutwardRoutes from './outward/brewersOutwardRoutes.js';
import huskOutwardRoutes from './outward/huskOutwardRoutes.js';
import riceBranOutwardRoutes from './outward/riceBranOutwardRoutes.js';
import whiteBranOutwardRoutes from './outward/whiteBranOutwardRoutes.js';
import otherOutwardRoutes from './outward/otherOutwardRoutes.js';

// Milling routes
import paddyMillingRoutes from './milling/paddyMillingRoutes.js';
import riceMillingRoutes from './milling/riceMillingRoutes.js';

const router = Router();

// ===== AUTH ROUTES =====
router.use('/auth', authRoutes);

// ===== MASTER DATA ROUTES =====
router.use('/parties', partiesRoutes);
router.use('/brokers', brokersRoutes);
router.use('/transporters', transportersRoutes);
router.use('/do-entries', doEntriesRoutes);
router.use('/committees', committeesRoutes);
router.use('/committee', committeesRoutes); // Alias for client API compatibility

// ===== PURCHASE ROUTES =====
router.use('/purchases/paddy', paddyPurchasesRoutes);
router.use('/purchases/rice', ricePurchasesRoutes);
router.use('/purchases/frk', frkPurchasesRoutes);
router.use('/purchases/sack', sackPurchasesRoutes);
router.use('/purchases/other', otherPurchasesRoutes);

// ===== SALES ROUTES =====
router.use('/sales/paddy', paddySalesRoutes);
router.use('/sales/rice', riceSalesRoutes);
router.use('/sales/frk', frkSalesRoutes);
router.use('/sales/sack', sackSalesRoutes);
router.use('/sales/brokens', brokensSalesRoutes);
router.use('/sales/brewers', brewersSalesRoutes);
router.use('/sales/husk', huskSalesRoutes);
router.use('/sales/ricebran', riceBranSalesRoutes);
router.use('/sales/whitebran', whiteBranSalesRoutes);
router.use('/sales/other', otherSalesRoutes);

// ===== INWARD ROUTES =====
router.use('/inward/paddy', paddyInwardRoutes);
router.use('/inward/rice', riceInwardRoutes);
router.use('/inward/frk', frkInwardRoutes);
router.use('/inward/sack', sackInwardRoutes);
router.use('/inward/private', privateInwardRoutes);
router.use('/inward/private-paddy', privatePaddyInwardRoutes);
router.use('/inward/paddy/private', privatePaddyInwardRoutes); // Alias for client API compatibility
router.use('/inward/other', otherInwardRoutes);

// ===== OUTWARD ROUTES =====
router.use('/outward/govt-rice', govtRiceOutwardRoutes);
router.use('/outward/govt-sack', govtSackOutwardRoutes);
router.use('/outward/private-rice', privateRiceOutwardRoutes);
router.use('/outward/private-sack', privateSackOutwardRoutes);
router.use('/outward/private-paddy', privatePaddyOutwardRoutes);
router.use('/outward/frk', frkOutwardRoutes);
router.use('/outward/brokens', brokensOutwardRoutes);
router.use('/outward/brewers', brewersOutwardRoutes);
router.use('/outward/husk', huskOutwardRoutes);
router.use('/outward/rice-bran', riceBranOutwardRoutes);
router.use('/outward/white-bran', whiteBranOutwardRoutes);
router.use('/outward/other', otherOutwardRoutes);

// ===== MILLING ROUTES =====
router.use('/milling/paddy', paddyMillingRoutes);
router.use('/milling/rice', riceMillingRoutes);

export default router;
