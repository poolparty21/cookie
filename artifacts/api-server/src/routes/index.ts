import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import productsRouter from "./products.js";
import checkoutRouter from "./checkout.js";
import checkDomainRouter from "./check-domain.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(checkoutRouter);
router.use(checkDomainRouter);

export default router;
