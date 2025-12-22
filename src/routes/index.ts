import { Router } from "express"
import { AuthRoutes } from "../modules/auth/auth.route"
import { explorerRoutes } from "../modules/explorer/route.explorer"
import { testRoutes } from "../modules/test/test.route"
import { tripRoutes } from "../modules/trip/trip.route"
import { userRoutes } from "../modules/user/user.route"
import { webReviewRoutes } from "../modules/website-reviews/route.webReviews"

export const router = Router()

const moduleRoutes = [
    {
        path: "/explorer",
        route: explorerRoutes
    },
    {
        path: "/test",
        route: testRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/users",
        route: userRoutes
    },

    {
        path: "/trips",
        route: tripRoutes
    },
    {
        path: "/website-reviews",
        route: webReviewRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})