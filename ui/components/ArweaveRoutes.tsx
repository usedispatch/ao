import { Routes, Route } from "react-router-dom"
import Home from "../pages/index"
// import Post from "../pages/post/[id]"
import NotFound from "../pages/404"
import SinglePostPage from "@/pages/post/[id]"
const ArweaveRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/post/:id" element={<SinglePostPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default ArweaveRoutes;
