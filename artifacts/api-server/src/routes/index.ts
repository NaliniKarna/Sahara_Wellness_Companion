import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./sahara/users";
import onboardingRouter from "./sahara/onboarding";
import careerRouter from "./sahara/career";
import skillsRouter from "./sahara/skills";
import wellnessRouter from "./sahara/wellness";
import tasksRouter from "./sahara/tasks";
import chatRouter from "./sahara/chat";
import jobmarketRouter from "./sahara/jobmarket";
import dashboardRouter from "./sahara/dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(onboardingRouter);
router.use(careerRouter);
router.use(skillsRouter);
router.use(wellnessRouter);
router.use(tasksRouter);
router.use(chatRouter);
router.use(jobmarketRouter);
router.use(dashboardRouter);

export default router;
