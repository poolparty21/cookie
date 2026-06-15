import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import checkoutRouter from "./checkout";
import checkDomainRouter from "./check-domain";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(checkoutRouter);
router.use(checkDomainRouter);

export default router;
