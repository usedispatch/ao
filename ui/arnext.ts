import _Link from "@/components-1/link"
import { useParams as _useParams } from "@/components-1/params"
import { useRouter as _useRouter } from "@/components-1/router"

export const isArweave = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "arweave"
export const Link = _Link
export const useParams = _useParams
export const useRouter = _useRouter
