# Copyright © 2025 Jalapeno Labs

from starlette.applications import Starlette
from langgraph.src.server.routing import routes

app = Starlette(
    routes=routes,
    middleware=[],
)
