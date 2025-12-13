import { Router } from "express"
import { AuthRoutes } from "../modules/auth/auth.route"
import { testRoutes } from "../modules/test/test.route"
import { tripRoutes } from "../modules/trip/trip.route"
import { userRoutes } from "../modules/user/user.route"


export const router = Router()

const moduleRoutes = [
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
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})