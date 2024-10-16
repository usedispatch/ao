import _Link from "@/components/arnext/link"
import { useParams as _useParams } from "@/components/arnext/params"
import { useRouter as _useRouter } from "@/components/arnext/router"

export const isArweave = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "arweave"
export const Link = _Link
export const useParams = _useParams
export const useRouter = _useRouter