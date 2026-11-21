import { NextRequest } from "next/server";
import { handleDemo } from "@/lib/demo/handler";
export const GET = (request: NextRequest) => handleDemo(request);
export const POST = (request: NextRequest) => handleDemo(request);
export const PUT = (request: NextRequest) => handleDemo(request);
export const DELETE = (request: NextRequest) => handleDemo(request);
