/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter as _useRouter } from "next/router"
import { useNavigate as _useNavigate } from "react-router-dom"
import { isArweave } from "@/arnext"

class Router {
  public router: any; 
  constructor() {
    this.router = isArweave ? _useNavigate() : _useRouter()
  }
  push(...params: any[]) {
    if (isArweave) {
      this.router(...params)
    } else {
      this.router.push(...params)
    }
  }
}

export const useRouter = () => new Router()
