import Link1, { LinkProps } from "next/link"
import { Link as Link2, LinkProps as ReactLinkProps, To } from "react-router-dom"

export default function Link(props: ReactLinkProps & LinkProps) {
  const isArweave = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "arweave"
  if (isArweave) props.to = props.href as To
  return isArweave ? <Link2 {...props} /> : <Link1 {...props} />
}
