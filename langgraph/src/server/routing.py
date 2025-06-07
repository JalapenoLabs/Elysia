# Copyright © 2025 Jalapeno Labs

# Core
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from starlette.routing import BaseRoute, Route


async def ok(request: Request):
    return JSONResponse({"ok": True})


async def ping(request: Request):
    return Response("pong")


routes: list[BaseRoute] = [
    Route("/ok", ok, methods=["GET"]),
    Route("/ping", ping, methods=["GET"]),
]
